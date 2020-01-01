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

``` flow
st=start:Start
i=inputoutput:输入年份n
cond1=condition:n能否被4整除？
cond2=condition:n能否被100整除？
cond3=condition:n能否被400整除？
o1=inputoutput:输出非闰年
o2=inputoutput:输出非闰年
o3=inputoutput:输出闰年
o4=inputoutput:输出闰年
e=end

st-i-cond1
cond1(no)-o1-e
cond1(yes)-cond2
cond2(no)-o3-e
cond2(yes)-cond3
cond3(yes)-o2-e
cond3(no)-o4-e
```




### TODO
* [ ] 优化task注册机制
* [ ] 单元测试
* [ ] 
