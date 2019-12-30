import Hook from "./Hook";


function createId(prefix) {
	let i = 0;
	return () => {
		return `${prefix}_${i++}`;
	};
}

const hookNameId = createId('hook_name');

function noop() {

}

function identify(a) {
	return a;
}

function removeNull(a) {
	if (typeof a !== 'object') {
		return a;
	}
	const result = {};
	Object.keys(a)
		.forEach(function (key) {
			const value = a[ key ];
			if (value !== null && value !== undefined) {
				result[ key ] = value;
			}
		});
	return result;
}

function merge(a, b, excludeNull = true) {

	const handler = excludeNull ? removeNull : identify;
	return {
		...handler(a),
		...handler(b),
	};
}

function combineTap(config, fn = noop, type) {
	return merge({
			stage: 0,
			name: hookNameId(),
			context: false,
			before: null,
			fn: noop,
		},
		typeof config === 'object' ? { ...config, fn } : { name: config, fn });


	if (typeof config === 'object') {
		return {
			...config,
			fn,
		};
	}
	return {
		name: config,
		stage: 0,
		context: false,
		before: null,
		fn,
		type,
	};
}

/**
 * SyncHook
 */
class SyncHook extends Hook {
	constructor(props) {
		super(props);
	}

	tap(config, fn) {
		const newTap = combineTap(config, fn, 'sync');
		this._taps.push(newTap);
	}

	call(...args) {
		const tapArgs = this._combineArgs('sync', args);
		this._taps.
	}

	intercept(interceptor) {
		if (!interceptor) {
			console.error('no valid interceptor');
			return;
		}
		const { call, loop, tap, register, context } = interceptor;
		// TODO
		this._interceptors.push(interceptor);
	}
}
