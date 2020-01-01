import Task, { TASK_TYPE } from "./task";

class AsyncTask extends Task {
	constructor(config, fn) {
		super(TASK_TYPE.sync, config, fn);
	}

	_run(runId) {
		const args = this._getExecuteArgs(runId);
		try {
			const fn = this.fn;
			return fn(
				...args,
				this._done.bind(this, runId, this)
			);
		} catch (e) {
			this.onError(runId, this, e);
		}
	}
}

export default AsyncTask;
