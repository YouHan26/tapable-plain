import { genTasks } from '../utils.js';
import assert from 'assert';
import {
	Pipeline,
	PromiseTask,
	SyncTask,
	AsyncTask,
} from '../../src/index.js';

export const runFlow = function () {
	console.log('test parallel basic');
	Pipeline('parallel')
		.addTask(
			genTasks()
		)
		.run()
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
	runRethrowIfPossible();
	runContext();
};


function runBail() {
	console.log('test parallel config bail');
	Pipeline('parallel', {
		bail: true
	})
		.addTask([
			new AsyncTask(function (callback) {
				console.log('run task1');
				callback();
			}),
			new PromiseTask(function () {
				console.log('run task2');
				return Promise.resolve()
					.then(function () {
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
	console.log('test parallel config loop');
	Pipeline('parallel', {
		loop: true
	})
		.addTask([
			new AsyncTask(function (callback) {
				console.log('run task1');
				if (count >= 5) {
					callback(1);
				} else {
					count++;
					callback();
				}
			}),
			new PromiseTask(function () {
				console.log('run task2');
				return Promise.resolve()
					.then(function () {
						if (count >= 3) {
							return 2;
						} else {
							count++;
							return;
						}
					});
			}),
			new SyncTask(function () {
				console.log('run task3');
				if (count >= 10) {
					return 3;
				}
				count++;
				return;
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


function runRethrowIfPossible() {
	console.log('test parallel config rethrowIfPossible');
	Pipeline('parallel', {
		rethrowIfPossible: false
	})
		.addTask([
			new AsyncTask(function (callback) {
				console.log('run task 1');
				throw Error(1);
			}),
			new AsyncTask(function (callback) {
				console.log('run task 2');
				callback(2);
			}),
		])
		.run()
		.then(function (res) {
			assert.equal(res, null);
			console.log('runRethrowIfPossible run end', res);
		})
		.catch(function (e) {
			console.error('get error', e);
		});
}


function runContext() {
	console.log('test parallel config context');
	Pipeline('parallel', {
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
			assert.equal(res, 2);
			console.log('run end', res);
		})
		.catch(function (e) {
			console.error('get error', e);
		});
}


