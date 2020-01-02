import { genTasks } from '../utils.js';
import assert from 'assert';
import {
	Pipeline,
	PromiseTask,
	SyncTask,
	AsyncTask,
} from '../../src/index.js';

export const runTask = function () {
	console.log('test task before');
	Pipeline('series')
		.addTask([
			new SyncTask(function(){
				console.log('run task 1')
			}, {
				name: 'task1',
			}),
			new SyncTask(function(){
				console.log('run task 2')
			}, {
				name: 'task2',
				before: ['task1']
			}),
			new SyncTask(function(){
				console.log('run task 3')
			}, {
				name: 'task3',
				before: ['task2', 'task1']
			})
		])
		.run()
		.then(function (res) {
			assert.equal(res, null);
			console.log('run end');
		})
		.catch(function (e) {
			console.log('get error', e);
		});
};
