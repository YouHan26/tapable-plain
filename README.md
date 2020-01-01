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

# Pipeline Type

### Series Pipeline

flow

![flow](https://i.ibb.co/t22mCVp/2020-01-01-11-28-31.png)




### TODO
* [ ] 优化task注册机制
* [ ] 单元测试
* [ ] 
