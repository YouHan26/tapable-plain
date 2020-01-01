
export function createId(prefix) {
	let i = 0;
	return () => {
		return `${prefix}_${i++}`;
	};
}


export function noop() {

}

export function identify(a) {
	return a;
}

export function removeNull(a) {
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

export function merge(a, b, excludeNull = true) {

	const handler = excludeNull ? removeNull : identify;
	return {
		...handler(a),
		...handler(b),
	};
}


function is(typeStr) {
	return function (obj) {
		return Object.prototype.toString.call(obj)
			.slice(8, -1) === typeStr;
	};
}

export const isFunction = is('Function');
export const isObject = is('Object');
export const isArray = Array.isArray || is('Array');
export const isString = is('String');


export function ensureArray(){

}
