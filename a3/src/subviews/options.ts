import html from "html-template-tag";
import { View } from "../view";

export class Options extends View {
	constructor(labels: string[], onSelect: (index: number) => void) {
		super(html`<select class="options"></select>`);
		labels.forEach((label) =>
			this.addChild(new View(`<option>${label}</option`))
		);
		this.addEventListener("change", () => {
			onSelect(this.root.selectedIndex);
		});
	}

	get root() {
		return this._root as HTMLSelectElement;
	}

	select(index: number): void {
		this.root.selectedIndex = index;
	}

	deselect(): void {
		this.root.selectedIndex = 0;
	}

	enable(): void {
		this.root.disabled = false;
	}

	disable(): void {
		this.root.disabled = true;
	}
}
