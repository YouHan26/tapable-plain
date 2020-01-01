/**
 * 并行序列
 */
import BasePipeline from "./basePipeline";

class ParallelPipeline extends BasePipeline {
	constructor(config = {}) {
		super({
			...config,
			waterfall: false,
			continueIfError: false,
		});
	}

	_onTaskError(runId, task, e) {
		super._onTaskError(runId, task, e);

		const { rethrowIfPossible } = this.config;
		// TODO 直接throw可能会有问题
		if (rethrowIfPossible) {
			throw e;
		}
	}

	_onTaskEnd(runId, task, result) {
		const { loop, bail, waterfall } = this.config;
		// bail与 loop/waterfall互斥
		// 并行没有waterfall模式
		let continueRun = true;
		const typeHandleArr = [];

		bail && typeHandleArr.push(this._handleBail);
		loop && typeHandleArr.push(this._handleLoop);

		let method = typeHandleArr.shift();
		while (continueRun && method) {
			continueRun = method.call(this, runId, task, result);
		}
		// 还没有处理状态啥的,需要最后更新下task状态
		if (continueRun !== null) {
			super._onTaskEnd(runId, task, result);
		}
	}

	_handleBail(runId, task, result) {
		if (result !== undefined) {
			// 直接可以执行完毕，不用浪费更新task状态
			// super._onTaskEnd(runId, task, result);
			this._onPipelineEnd(runId, result);
			return false;
		}
		return true;
	}

	_handleLoop(runId, task, result) {
		if (!result) {
			task.rerun();
			return null; //不需要后续处理
		}
		return true;
	}

	run(...args) {
		const runId = super.run();
		return new Promise((resolve, reject) => {
			const tasks = this._tasks.getAll();

			this._runIds[ runId ] = {
				status: 'start',
				waterfall: undefined,
				resolve,
				reject,
				tasks: tasks.reduce((res, task) => {
					return res[ task.id ] = 'start';
				}, {}),
			};
			// 锁定当前执行task，防止中途添加task
			tasks.forEach((task) => {
				task.execute(runId, this._getTaskArgs(args, runId));
			});
		});
	}
}

export default ParallelPipeline;
