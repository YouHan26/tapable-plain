


const defaultQueueConfig = {
	// 是否提前退出
	bail: false,
	// 是否将结果传递下去
	waterfall: false,
	// 是否循环执行task
	loop: false,
	context: true,
};

const QUEUE_TYPE = {
	series: 'series',
	parallel: 'parallel'
};

const defaultQueueType = QUEUE_TYPE.parallel;


class TaskArr {
	constructor() {
		this._taskMap = {};
		this._taskArr = [];
	}

	push(task) {

	}
}



/**
 * Queue
 */
class Queue {
	constructor(config) {

		// can override by specify task
		this.config = merge(config, defaultQueueConfig);
		this.type = type || defaultQueueType;
		this._tasks = new TaskArr();
	}

	addTask(task) {
		if (!task || !task.id) {
			console.warn('invalid task', task);
		}
		this._taskMap[ task.id ] = task;
		this._taskArr.push(task);
	}


}
