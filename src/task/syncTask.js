import Task, { TASK_TYPE } from "./task";

class SyncTask extends Task {
	constructor(fn, config) {
		super(TASK_TYPE.sync, fn, config);
	}

	_run(runId) {
		const args = this._getExecuteArgs(runId);
		try {
			const fn = this.fn;
			this._done(runId, this, fn(
				...args
			));
		} catch (e) {
			this.onError(runId, this, e);
		}
	}
}

export default SyncTask;
