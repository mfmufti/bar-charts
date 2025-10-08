export interface Observer {
	update(subject: Subject): void;
}

export class Subject {
	private observers: Observer[] = [];

	addObserver(observer: Observer): void {
		if (this.observers.indexOf(observer) === -1) {
			this.observers.push(observer);
		}
	}

	removeObserver(observer: Observer) {
		this.observers = this.observers.filter((ob) => ob !== observer);
	}

	updateObservers() {
		this.observers.forEach((ob) => ob.update(this));
	}
}
