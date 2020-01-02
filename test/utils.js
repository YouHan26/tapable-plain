import {
	PromiseTask,
	SyncTask,
	AsyncTask,
} from '../src/index.js';

export const genTasks = function () {
	return [
		new SyncTask(function () {
			console.log('run task1');
		}),
		new AsyncTask(function (callback) {
			setTimeout(function () {
				console.log('run task2');
				callback();
			}, 1000);
		}),
		new PromiseTask(function () {
			return Promise.resolve().then(function () {
				console.log('run task3');
				return;
			});
		})
	];
};

export const runTimes = function (fn) {
	let count = 0;
	return function (...args) {
		return fn && fn(...args, ++count);
	};
};
