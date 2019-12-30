/**
 * Hook
 */
class Hook {
	constructor(args, name) {
		this._used = false;
		this.name = name;
		this._args = args || [];
		this.context = null;
		this._interceptors = [];
		this._taps = [];
	}

	_combineArgs(type, args) {
		return (this.context ? [ this.context ] : [])
			.concat(args.slice(0, this._args.length))
	}

	tap() {
		console.error('should not run');
	}

	tapAsync() {
		console.error('should not run');
	}

	tapPromise() {
		console.error('should not run');
	}

	isUsed() {

	}

	call() {
		console.error('should not run');
	}

	promise() {
		console.error('should not run');
	}

	callAsync() {
		console.error('should not run');
	}

	intercept(interceptor) {
		if (!interceptor) {
			console.error('no valid interceptor');
			return;
		}
		const { call, loop, tap, register, context } = interceptor;
		// TODO
	}
}

export default Hook;
