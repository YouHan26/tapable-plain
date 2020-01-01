import { merge } from "../utils/utils";
import ParallelPipeline from "./parallel";
import SeriesPipeline from "./series";

const defaultQueueConfig = {
	// 是否提前退出
	bail: false,
	// 是否将结果传递下去
	waterfall: false,
	// 是否循环执行task
	loop: false,
	// task异常是否继续执行
	continueIfError: false,
	// 是否重新throw被捕获error
	rethrowIfPossible: true,
	// 是否开启共享context
	context: true,
};

const QUEUE_TYPE = {
	series: 'series',
	parallel: 'parallel'
};

const defaultQueueType = QUEUE_TYPE.parallel;

/**
 * Queue
 * @param config
 * @param type
 * @returns {BasePipeline}
 * @constructor
 */
function Pipeline(type = defaultQueueType, config) {
	const newConfig = merge(config, defaultQueueConfig);
	if (type === QUEUE_TYPE.parallel) {
		return new ParallelPipeline(newConfig);
	}
	return new SeriesPipeline(newConfig);
}

export default Pipeline;
