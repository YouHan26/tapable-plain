/**
 * TaskArr
 */
import { ensureArray, isArray } from "../utils/utils";

class TaskArr {
	constructor() {
		this._taskMap = {};
		this._taskArr = [];
		this._runs = {};
	}

	/**
	 * push
	 * @param task
	 * @param isBatch
	 */
	push(task, isBatch = false) {
		if (isArray(task)) {
			task.forEach((t) => {
				this._taskMap[ t.id ] = t;
			});
			this._taskArr = this._taskArr.concat(task);
		} else {
			this._taskMap[ task.id ] = task;
			this._taskArr.push(task);
		}
		this._sort(isBatch);
	}

	/**
	 * _sort
	 * @param isBatch
	 * @private
	 */
	_sort(isBatch) {
		if (isBatch) {
			Promise.resolve()
				.then(this._sortArr.bind(this));
		} else {
			this._sortArr();
		}
	}

	_sortArr() {
		this._taskArr.sort(function (a, b) {
			const { before } = b.config;
			if (before && ~ensureArray(before).indexOf(a.config.name)) {
				return 1;
			}
			return -1;
		});
	}

	remove(taskId) {
		if (taskId) {
			const task = this._taskMap[ taskId ];
			if (task) {
				const index = this._taskArr.indexOf(task);
				!index && this._taskArr.splice(index, 1);
				delete this._taskMap[ taskId ];
			}
		}
	}

	getAll() {
		return [ ...this._taskArr ];
	}

	getNextTask(pid) {
		if (!pid) {
			return;
		}
		if (!this._runs[ pid ]) {
			this._runs[ pid ] = this.getAll();
		}
		return this._runs[ pid ].pop();
	}
}

export default TaskArr;
