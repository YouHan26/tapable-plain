import {
	runFlow as runSeriesFlow,
	runConfig as runSeriesConfig,
} from './pipeline/series.js';
import {
	runFlow as runParallelFlow,
	runConfig as runParallelConfig,
} from './pipeline/parallel.js';

import { runTask } from './task/task.js';

runSeriesFlow();
runSeriesConfig();
runParallelFlow();
runParallelConfig();
runTask();
