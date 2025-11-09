import type { Model } from "./model";
import type { Observer } from "./observer";

export class View implements Observer {
	protected _root: HTMLElement;

	constructor(html: string) {
		const tmp = document.createElement("template");
		tmp.innerHTML = html;
		this._root = tmp.content.firstElementChild as HTMLElement;
	}

	get root() {
		return this._root;
	}

	update(_: Model): void {}

	addChild(el: HTMLElement | View): void {
		if (el instanceof HTMLElement) {
			this._root.appendChild(el);
		} else {
			this._root.appendChild(el.root);
		}
	}

	addEventListener(type: string, callback: (ev: Event) => void): void {
		this.root.addEventListener(type, callback);
	}
}
