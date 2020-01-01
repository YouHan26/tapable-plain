import Observable from "./observable";
import TaskArr from "../task/taskArr";
import Task from "../task/task";
import { createId, isArray, isFunction } from "../utils/utils";

const interceptorNames = [
	'onError',
	'onStart',
	'onEnd',
	'onTaskStart',
	'onTaskError',
	'onTaskEnd',
];

const pipelineRunId = createId('$pipeline_run_id');

/**
 * base queue
 */
class BasePipeline {
	constructor(config) {
		this.config = config;
		this._tasks = new TaskArr();
		// 每次执行共享，后续考虑是否分隔每次执行context
		this.context = null;
		this._initObservables();
		this._runIds = {};
	}

	_initObservables() {
		this.observables = {};
		interceptorNames.forEach(function (name) {
			this.observables[ name ] = new Observable();
		});
	}


	addTask(task) {
		if (isArray(task)) {
			const tasks = task.filter(Task.isValid);
			this._tasks.push(tasks);
			task.forEach(this._setup.bind(this));
		} else {
			if (Task.isValid(task)) {
				this._tasks.push(task);
				this._setup(task);
			}
		}
		return this;
	}

	intercept(config = {}) {
		const ids = {};
		interceptorNames.forEach((name) => {
			const fn = config[ name ];
			if (isFunction(fn)) {
				ids[ name ] = this.observables[ name ].subscribe(fn);
			}
		});
	}

	unintercept(ids = {}) {
		interceptorNames.forEach((name) => {
			const id = ids[ name ];
			this.observables[ name ].unsubscribe(id);
		});
	}

	_trigger(eventName, ...args) {
		const observable = this.observables[ eventName ];
		if (observable) {
			observable.trigger(...args);
		}
	}

	_setup(task) {
		task.setup({
			onError: this._onTaskError.bind(this),
			onExecute: this._onTaskStart.bind(this),
			onDone: this._onTaskEnd.bind(this),
			config: this.config,
		});
	}

	_cleanRunStatus(runId) {
		if (this._runIds[ runId ]) {
			delete this._runIds[ runId ];
		}
	}

	_onPipelineStart() {
		this._trigger('onStart');
	}

	// 当bail 或者所有的task都执行完毕
	_onPipelineEnd(runId, result) {
		const config = this._runIds[ runId ];
		if (config) {
			this._trigger('onEnd', result);
			config.status = 'done';
			config.resolve(result);
			this._cleanRunStatus(runId);
		}
	}

	// 并行不会block，所以永远不会走到这里
	// 只有串行,且continueIfError设置为false
	_onPipelineError(runId, e) {
		const config = this._runIds[ runId ];
		if (config) {
			this._trigger('onError', e);
			config.status = 'error';
			config.reject(e);
			this._cleanRunStatus(runId);
		}
	}

	_onTaskStart(runId, task) {
		this._trigger('onTaskStart', task.name);
		this._updateTaskStatus(runId, task, 'start', null, false);
	}

	_onTaskEnd(runId, task, result) {
		this._trigger('onTaskEnd', task.name, result);
		this._updateTaskStatus(runId, task, 'end', result);
	}

	_onTaskError(runId, task, e, checkStatus) {
		this._trigger('onTaskError', task.name, e);
		this._updateTaskStatus(runId, task, 'error', null, checkStatus);
	}

	_updateTaskStatus(runId, task, status, result, checkStatus = true) {
		const tasks = get(this._runIds, `${runId}.tasks`);
		if (tasks) {
			tasks[ task.id ] = status;
		}
		checkStatus && this._checkRunnableTask(runId, result);
	}

	_checkRunnableTask(runId, result) {
		const runConfig = this._runIds[ runId ];
		if (!runConfig || (runConfig !== 'start')) {
			return;
		}

		const tasks = runConfig.tasks;
		if (!tasks) {
			return;
		}

		const stillRunTask = Object.keys(tasks)
			.find((taskId) => {
				return tasks[ taskId ] === 'start';
			});
		if (!stillRunTask) {
			this._onPipelineEnd(result);
		}
	}

	_getTaskArgs(args = [], runId) {
		const { context, waterfall } = this.config;
		const newArgs = [ ...args ];

		if (waterfall) {
			const config = this._runIds[ runId ];
			if (config) {

			}
		}
		return context ? newArgs.unshift(this.context) : newArgs;
	}

	run() {
		this._onPipelineStart();
		return pipelineRunId();
	}
}

export default BasePipeline;
