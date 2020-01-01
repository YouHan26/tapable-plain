/**
 * 串行序列
 */
import BasePipeline from "./basePipeline";

class SeriesPipeline extends BasePipeline {
	constructor(config = {}) {
		super(config);
	}

	_onTaskError(runId, task, e) {
		super._onTaskError(runId, task, e, false);

		const { rethrowIfPossible, continueIfError } = this.config;
		if (continueIfError) {
			// 继续执行下一个
			// 更新waterfall, 这里就不用处理是否开启waterfall
			this._updateWaterfall(runId, null);
			this._runNextTask(runId);
		} else {
			// 结束pipeline
			this._onPipelineError(runId, e);
		}
		// TODO 直接throw可能会有问题
		if (rethrowIfPossible) {
			throw e;
		}
	}

	_onTaskEnd(runId, task, result) {
		const { loop, bail, waterfall } = this.config;
		// bail与 loop/waterfall互斥
		// 并行没有waterfall模式

		// continueRun有三种状态：
		// true： 需要继续执行
		// false： 不需要继续执行
		// null： 不需要继续执行，且不需要后续处理
		let continueRun = true;

		const typeHandleArr = [];

		bail && typeHandleArr.push(this._handleBail);
		loop && typeHandleArr.push(this._handleLoop);
		waterfall && typeHandleArr.push(this._handleWaterfall);

		let method = typeHandleArr.shift();
		while (continueRun && method) {
			continueRun = method.call(this, runId, task, result);
		}
		// 还没有处理状态啥的,需要最后更新下task状态
		if (continueRun !== null) {
			super._onTaskEnd(runId, task, result);
			this._runNextTask(runId);
		}
	}

	_handleBail(runId, task, result) {
		if (result !== undefined) {
			// hack: 因为执行都是同步，所以这里添加来保证 pipeline end在task end之后触发
			Promise.resolve()
				.then(() => {
					this._onPipelineEnd(runId, result);
				});
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

	_handleWaterfall(runId, task, result) {
		this._updateWaterfall(runId, result);
		return true;
	}

	_updateWaterfall(runId, value) {
		const config = this._runIds[ runId ];
		if (config) {
			config.waterfall = value;
		}
	}

	_getWaterfall(runId) {
		const config = this._runIds[ runId ];
		return config && config.waterfall;
	}

	_runNextTask(runId) {
		const task = this._tasks.getNextTask(runId);
		if (task) {
			task.execute(runId,
			);
		} else {
			// 目前来看，只有当前pipeline为空会执行
			this._onPipelineEnd(runId, this._getWaterfall(runId));
		}
	}

	run(...args) {
		const runId = super.run();
		return new Promise((resolve, reject) => {
			this._runIds[ runId ] = {
				status: 'start',
				waterfall: null,
				resolve,
				reject,
				tasks: {},
			};
			this._runNextTask(runId);
		});
	}
}

export default SeriesPipeline;
