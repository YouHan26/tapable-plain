import { createId, isObject, merge, noop } from "../utils";

export const TASK_TYPE = {
	sync: 'sync',
	promise: 'promise',
	async: 'async'
};

const taskId = createId('$queue_task');


/**
 * Task
 * config: {
 *  waterfall,
 *  bail,
 *  loop,
 *  context,
 * } // 其中bail和waterfall冲突,只能开启一个
 */
class Task {
	constructor(type, config, fn) {
		this.id = taskId();
		this.fn = fn;
		this.type = type;
		this.config = isObject(config) ? config : { name: config };
	}

	setup({ onError, onExecute, onDone, onBreak, config }) {
		this.onError = onError || noop;
		this.onExecute = onExecute || noop;
		this.onDone = onDone || noop;
		this.onBreak = onBreak || noop;
		this.config = merge(config, this.config);
		const { bail, waterfall } = this.config;
		if (bail && waterfall) {
			console.warn('bail and waterfall should not both true ');
		}
	}

	_setExecuteArgs(args) {
		this._runArgs = args;
	}

	_resetExecuteArgs() {
		this._runArgs = null;
	}

	_run() {
		console.warn('should be override');
	}

	_done(result) {
		const { waterfall, bail, loop } = this.config;
		if (bail) {
			if (result !== undefined) {
				this.onBreak(this);
			}
		}

		if (loop) {
			if (!result) {
				this._run();
				return;
			}
		} else {
			this._resetExecuteArgs();
		}

		this.onDone(this, waterfall ? result : undefined);
	}

	execute(args) {
		this.onExecute(this);
		this._setExecuteArgs(args);
	}
}

export default Task;
