import { createId } from "../utils/utils.js";

const observableId = createId('$observable_id');

class Observable {
	constructor() {
		this.observers = {};
	}

	subscribe(observer) {
		const id = observableId();
		this.observers[ id ] = observer;
		return id;
	}

	unsubscribe(id) {
		if (id && this.observers[ id ]) {
			delete this.observers[ id ];
		}
	}

	trigger(...args) {
		Object.keys(this.observers).forEach( (key) => {
			const observer = this.observers[ key ];
			const { fn } = observer || {};
			fn && fn(...args);
		});
	}
}

export default Observable;
