import html from "html-template-tag";
import { View } from "../view";

export class Options extends View {
	private selectedIndex = 0;

	constructor(
		labels: string[],
		onSelect: (index: number) => void,
		beforeSelect: () => void
	) {
		super(html`<select class="options"></select>`);
		labels.forEach((label) =>
			this.addChild(new View(`<option>${label}</option`))
		);
		this.addEventListener("change", () => {
			if (this.root.selectedIndex !== this.selectedIndex) {
				beforeSelect();
				this.selectedIndex = this.root.selectedIndex;
			}
			onSelect(this.root.selectedIndex);
		});
	}

	get root() {
		return this._root as HTMLSelectElement;
	}

	select(index: number): void {
		this.root.selectedIndex = index;
		this.selectedIndex = index;
	}

	deselect(): void {
		this.root.selectedIndex = 0;
		this.selectedIndex = 0;
	}

	enable(): void {
		this.root.disabled = false;
	}

	disable(): void {
		this.root.disabled = true;
	}
}
