import Task, { TASK_TYPE } from "./task";

class SyncTask extends Task {
	constructor(config, fn) {
		super(TASK_TYPE.sync, config, fn);
	}

	_run() {
		const args = this._runArgs || [];
		try {
			const fn = this.fn;
			return fn(
				...args
			);
		} catch (e) {
			this.onError(e);
		}
	}

	execute(args) {
		this.onExecute(this);
		this._setExecuteArgs(args);
		const result = this._run();
		this._done(result);
	}
}

export default SyncTask;
