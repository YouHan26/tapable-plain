import { genTasks, runTimes } from '../utils.js';
import assert from 'assert';
import {
	Pipeline,
	PromiseTask,
	SyncTask,
	AsyncTask,
} from '../../src/index.js';

export const runFlow = function () {
	console.log('test series basic');
	Pipeline('series')
		.addTask(
			new SyncTask(function (arg) {
				assert.equal(arg, 111);
				console.log('run task1');
			}),
			new AsyncTask(function (arg, callback) {
				assert.equal(arg, 111);
				setTimeout(function () {
					console.log('run task2');
					callback();
				}, 1000);
			}),
			new PromiseTask(function (arg) {
				assert.equal(arg, 111);
				return Promise.resolve().then(function () {
					console.log('run task3');
					return;
				});
			})
		)
		.run(111)
		.then(function (res) {
			assert.equal(res, null);
			console.log('run end');
		})
		.catch(function (e) {
			console.log('get error', e);
		});
};


export const runConfig = function () {
	runBail();
	runLoop();
	runWaterfall();
	runContinueIfError();
	runRethrowIfPossible();
	runContext();
};


function runBail() {
	console.log('test series config bail');
	Pipeline('series', {
		bail: true
	})
		.addTask([
			new AsyncTask(function (callback) {
				console.log('run task1');
				callback();
			}),
			new PromiseTask(function () {
				return Promise.resolve()
					.then(function () {
						console.log('run task2');
						return 2;
					});
			}),
			new SyncTask(function () {
				console.log('run task3');
			})
		])
		.run()
		.then(function (res) {
			assert.equal(res, 2);
			console.log('run end', res);
		})
		.catch(function (e) {
			console.error('get error', e);
		});
}


let count = 0;

function runLoop() {
	console.log('test series config loop');
	Pipeline('series', {
		loop: true
	})
		.addTask([
			new AsyncTask(function (callback) {
				console.log('run task1', count);
				if (count >= 5) {
					callback(1);
				} else {
					count++
					callback();
				}
			}),
			new PromiseTask(function () {
				console.log('run task2', count);
				return Promise.resolve()
					.then(function () {
						if (count >= 3) {
							return 2;
						} else {
							count++
							return;
						}
					});
			}),
			new SyncTask(function () {
				console.log('run task3', count);
				if (count >= 10) {
					return 3;
				}
				count++
				return;
			})
		])
		.run()
		.then(function (res) {
			assert.equal(res, null);
			console.log('run end', res);
		})
		.catch(function (e) {
			console.error('get error', e);
		});
}


function runWaterfall(){
	console.log('test series config waterfall');
	Pipeline('series', {
		loop: true,
		waterfall: true,
	})
		.addTask([
			new AsyncTask(runTimes(function (arg, callback, runTime) {
				console.log('run task1', runTime);
				assert.equal(arg, 'test');
				if (runTime >= 5) {
					callback(1);
				} else {
					callback();
				}
			})),
			new PromiseTask(runTimes(function (pre, runTime) {
				console.log('run task2', pre, runTime);
				assert.equal(pre, 1);
				return Promise.resolve()
					.then(function () {
						if (runTime >= 3) {
							return 2;
						} else {
							return;
						}
					});
			})),
			new SyncTask(runTimes(function (pre, runTime) {
				assert.equal(pre, 2);
				console.log('run task3', runTime);
				if (runTime >= 4) {
					return 3;
				}
				count ++;
				return;
			}))
		])
		.run('test')
		.then(function (res) {
			assert.equal(res, 3);
			console.log('run end', res);
		})
		.catch(function (e) {
			console.error('get error', e);
		});
}


function runContinueIfError(){
	console.log('test series config continueIfError');
	Pipeline('series', {
		continueIfError: true,
	})
		.addTask([
			new AsyncTask(runTimes(function (arg, callback, runTime) {
				console.log('run task1', runTime);
				assert.equal(arg, 'test');
				if (runTime >= 5) {
					throw new Error('error happen in task')
				} else {
					callback();
				}
			})),
			new PromiseTask(runTimes(function (arg, runTime) {
				console.log('run task2', runTime);
				assert.equal(arg, 'test');
				return Promise.resolve()
					.then(function () {
						if (runTime >= 3) {
							return 2;
						} else {
							return;
						}
					});
			})),
			new SyncTask(runTimes(function (arg, runTime) {
				assert.equal(arg, 'test');
				console.log('run task3', runTime);
				if (runTime >= 4) {
					return 3;
				}
				count ++;
				return;
			}))
		])
		.run('test')
		.then(function (res) {
			assert.equal(res, null);
			console.log('run end', res);
		})
		.catch(function (e) {
			console.error('get error', e);
		});
}


function runRethrowIfPossible() {
	console.log('test series config rethrowIfPossible');
	Pipeline('series', {
		rethrowIfPossible: true
	})
		.addTask([
			new AsyncTask(function (callback) {
				console.log('run task 1');
				throw Error(1)
			}),
			new AsyncTask(function (callback) {
				console.log('run task 2');
				callback(2)
			}),
		])
		.run()
		.then(function (res) {
			assert.equal(res, null);
			console.log('runRethrowIfPossible run end', res);
		})
		.catch(function (e) {
			console.log('get error', e);
		});
}


function runContext() {
	console.log('test series config context');
	Pipeline('series', {
		context: {},
		loop: true
	})
		.addTask([
			new AsyncTask(function (c, callback) {
				console.log('run task1', c);
				if (c.count >= 5) {
					callback(1);
				} else {
					c.count = c.count ? c.count + 1 : 1;
					callback();
				}
			}),
			new PromiseTask(function (c) {
				console.log('run task2', c.count);
				return Promise.resolve()
					.then(function () {
						if (c.count >= 3) {
							return 2;
						} else {
							c.count++;
							return;
						}
					});
			}),
			new SyncTask(function (c) {
				console.log('run task3', c);
				if (c.count >= 10) {
					return 3;
				}
				c.count++;
				return;
			})
		])
		.run()
		.then(function (res) {
			assert.equal(res, null);
			console.log('run end', res);
		})
		.catch(function (e) {
			console.error('get error', e);
		});
}


