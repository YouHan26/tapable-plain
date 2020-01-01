import { createId, isObject, merge, noop } from "../utils/utils";

export const TASK_TYPE = {
	sync: 'sync',
	promise: 'promise',
	async: 'async'
};

const taskId = createId('$queue_task');

/**
 * Task
 * config: {
 *  name,
 *  context,
 *  before: '' / []
 * } // 其中bail和waterfall冲突,只能开启一个
 */
class Task {
	constructor(type, fn, config) {
		this.id = taskId();
		this.fn = fn;
		this.type = type;
		this.config = isObject(config) ? config : { name: config };
		this._runArgs = {};
	}

	setup({ onError, onExecute, onDone, config }) {
		this.onError = onError || noop;
		this.onExecute = onExecute || noop;
		this.onDone = onDone || noop;
		this.pipeLineConfig = config;
	}

	static isValid(task) {
		return task && task.id && task.config;
	}

	_setExecuteArgs(runId, args) {
		this._runArgs[runId] = args || [];
	}

	_resetExecuteArgs(runId) {
		this._runArgs[runId] = undefined;
	}

	_getExecuteArgs(runId){
		return this._runArgs[ runId ] || [];
	}

	_run() {
		console.warn('should be override');
	}

	_done(runId, result) {
		if (!this.pipeLineConfig.loop) {
			this._resetExecuteArgs();
		}

		this.onDone(runId, this, result);
	}

	execute(runId, args, isRerun = false) {
		this.onExecute(runId, this);
		if (!isRerun) {
			this._setExecuteArgs(runId, args);
		}
		this._run(runId);
	}

	rerun(runId) {
		this.execute(runId, undefined, true);
	}
}

export default Task;
