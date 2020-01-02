import Task, { TASK_TYPE } from "./task.js";

class SyncTask extends Task {
	constructor(fn, config) {
		super(TASK_TYPE.sync, fn, config);
	}

	_run(runId) {
		const args = this._getExecuteArgs(runId);
		try {
			const fn = this.fn;
			this._done(runId, fn(
				...args
			));
		} catch (e) {
			this.onError(runId, this, e);
		}
	}
}

export default SyncTask;
