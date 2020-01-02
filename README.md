# pipeline-task

pipeline task

``` javascript
import {
    Task,
    AsyncTask,
    SyncTask,
    PromiseTask,
    Pipeline,
    ParallelPipeline,
    SeriesPipeline,
 } from 'pipeline-task';
```

# Installation
``` bash
npm install --save pipeline-task
```

# Usage
put task to pipeline. It seems really simply.

``` javascript
const p = new Pipeline('series'); // new SeriesPipeline();

p
.addTask([
	new SyncTask(function(){
		console.log('run task 1')
	}),
	new PromiseTask(function(){
		console.log('run task2');
		return Promise.resolve();
	}),
	new AsyncTask(function(callback){
		setTimeout(function(){
			console.log('run task 3')
			callback();
		}, 1000)
	})
])
.addTask(new SyncTask(function(){
	console.log('run chain add task')
}))
.then(function(){
	console.log('run pipeline result')
})
.catch(function(e){
	console.log('get error', e);
})

// run task 1
// run task 2
// run task 3
// run chain add task
// run pipeline result

```

# Pipeline

### interface
``` typescript
interface PipelineConfig {
	bail: boolean,
	waterfall: boolean,
	loop: boolean,
	continueIfError: boolean,
	rethrowIfPossible: boolean,
	context: boolean,
}

interface PipelineType: 'series' | 'parallel'

interface Pipeline{
	constructor: (type: PipelineType, config?: PipelineConfig),
	addTask: (task: Task | Array(Task))
	run: (...args)
}

```

### Pipeline Type
#### Series Pipeline
![flow](https://i.ibb.co/t22mCVp/2020-01-01-11-28-31.png)
#### Parallel Pipeline
![flow](https://i.ibb.co/3vQPKFL/2020-01-01-11-35-48.png)

### pipeline config
``` javascript
const defaultQueueConfig = {
	bail: false,
	waterfall: false,
	loop: false,
	continueIfError: false,
	rethrowIfPossible: true,
	context: true,
};
```
* bail: A bail allows exiting early. When any of the task returns anything, the bail will stop executing the remaining ones
* waterfall: A waterfall also calls each task in a row. It passes a return value from each task to the next task.
* loop: A loop will execute each task until returns anything.
* continueIfError: If the continueIfError set true, when the task throw an error, it will treat as null, and continue to execute next task.
* rethrowIfPossible: Throw error rightly if set true.
* context: A context alllows each task using common context.

# Task
### Task interface
``` typescript
interface TaskType: 'async' | 'promise' | 'sync'

interface TaskConfig {
	name?: string,
	before?: string | Array(string)
}

interface Task{
	constructor(type: TaskType, fn: function, config: string | TaskConfig)
}

interface SyncTask extends Task{
	constructor(fn: function, config: string | TaskConfig)
}

interface AsyncTask extends Task{
	constructor(fn: function, config: string | TaskConfig)
}

interface PromiseTask extends Task{
	constructor(fn: function, config: string | TaskConfig)
}

```

### Task Type
* SyncTask: sync method
* AsyncTask: callback method
* PromiseTask: method which return promise


### TODO
* [ ] 优化task注册机制
* [ ] 支持pipeline作为task嵌套
