import Task, { TASK_TYPE } from "./task.js";

class AsyncTask extends Task {
	constructor(fn, config) {
		super(TASK_TYPE.async, fn, config);
	}

	_run(runId) {
		const args = this._getExecuteArgs(runId);
		try {
			const fn = this.fn;
			args.push(this._done.bind(this, runId));
			return fn(
				...args,
			);
		} catch (e) {
			this.onError(runId, this, e);
		}
	}
}

export default AsyncTask;
