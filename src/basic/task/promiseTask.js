import Task, { TASK_TYPE } from "./task";

class PromiseTask extends Task {
	constructor(config, fn) {
		super(TASK_TYPE.sync, config, fn);
	}

	_run(runId) {
		const args = this._getExecuteArgs(runId);
		try {
			const fn = this.fn;
			return fn(
				...args,
			).then((result) => {
				this._done(runId, result);
			}).catch(function (e) {
				this.onError(runId, this, e);
			});
		} catch (e) {
			this.onError(runId, this, e);
		}
	}
}

export default PromiseTask;
