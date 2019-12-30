import Task, { TASK_TYPE } from "./task";

class AsyncTask extends Task {
	constructor(config, fn) {
		super(TASK_TYPE.sync, config, fn);
	}

	_callback(result){
		this._done(result);
	}

	_run() {
		const args = this._runArgs || [];
		try {
			const fn = this.fn;
			return fn(
				...args,
				this._callback.bind(this)
			);
		} catch (e) {
			this.onError(e);
		}
	}

	execute(args) {
		this.onExecute(this);
		this._setExecuteArgs(args);
		this._run();
	}
}

export default AsyncTask;
