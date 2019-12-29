/**
 * Created by: YouHan
 * Date: 2019/12/29 22:30
 * file: index.js
 */
;

const TASK_TYPE = {
	promise: 'promise',
	sync: 'sync',
	async: 'async',
};



class Task{
	constructor(executeFn, config) {
		this.executeFn = executeFn;
		this.onExecute = config.onExecute;
		this.onFinish = config.onFinish;
		this.onError = config.onError;
	}

	execute(){
		throw Error('Task execute should be override');
	}
}

class SyncTask extends Task{
	constructor(props) {
		super(props);
	}


	execute() {
	}
}
