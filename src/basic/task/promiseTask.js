import Task, { TASK_TYPE } from "./task";

class PromiseTask extends Task {
	constructor(config, fn) {
		super(TASK_TYPE.sync, config, fn);
	}

	_run() {
		const args = this._runArgs || [];
		try {
			const fn = this.fn;
			return fn(
				...args,
			).then((result) => {
				this._done(result);
			}).catch(function (e) {
				this.onError(e);
			});
		} catch (e) {
			this.onError(e);
		}
	}

	execute(args) {
		super.execute(args);
		this._run();
	}
}

export default PromiseTask;
