import html from "html-template-tag";
import type { Model } from "../model";
import { View } from "../view";

export class ButtonPanel extends View {
	private addButton;
	private deleteButton;
	private noneButton;
	private allButton;

	constructor(model: Model) {
		super(html`<div id="button-panel"></div>`);
		this.addButton = new Button("add-button", "Add");
		this.deleteButton = new Button("delete-button", "Delete");
		this.noneButton = new Button("none-button", "None");
		this.allButton = new Button("all-button", "All");
		this.addChild(this.addButton);
		this.addChild(this.deleteButton);
		this.addChild(this.noneButton);
		this.addChild(this.allButton);

		this.addButton.addEventListener("click", () => model.addChart());
		this.deleteButton.addEventListener("click", () =>
			model.removeSelectedCharts()
		);
		this.noneButton.addEventListener("click", () =>
			model.deselectAllCharts()
		);
		this.allButton.addEventListener("click", () => model.selectAllCharts());

		model.addObserver(this);
		this.update(model);
	}

	update(model: Model): void {
		const selectCount = model.getSelectCount();
		const chartCount = model.getChartCount();
		this.addButton.enabled = chartCount !== 20;
		this.deleteButton.enabled = selectCount !== 0;
		this.noneButton.enabled = selectCount !== 0;
		this.allButton.enabled = selectCount !== chartCount;
	}
}

export class Button extends View {
	constructor(id: string, name: string) {
		super(html`<button id="${id}" class="button">${name}</button>`);
	}

	get root() {
		return this._root as HTMLButtonElement;
	}

	get enabled(): boolean {
		return !this.root.disabled;
	}

	set enabled(enabled: boolean) {
		this.root.disabled = !enabled;
	}
}
