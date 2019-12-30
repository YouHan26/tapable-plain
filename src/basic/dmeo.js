
let count = 5;
PromiseTask({
	name: 'name',
	context: true,
}, (context, previous, a, b, c) => {
	context.leftTime --;
	return rpc('a,b,c');
});

AsyncTask('name', (a, b, c, callback) => {
	setTimeout(() => {
		callback('value');
	});
});



