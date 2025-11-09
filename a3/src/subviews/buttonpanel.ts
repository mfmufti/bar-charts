import html from "html-template-tag";
import type { Model } from "../model";
import { View } from "../view";

export class ButtonPanel extends View {
	private addButton;
	private deleteButton;
	private noneButton;
	private allButton;
	private undoButton;
	private redoButton;

	constructor(model: Model) {
		super(html`<div id="button-panel"></div>`);

		this.addButton = new Button("add-button", "Add");
		this.deleteButton = new Button("delete-button", "Delete");
		this.noneButton = new Button("none-button", "None");
		this.allButton = new Button("all-button", "All");
		this.undoButton = new Button("undo-button", "Undo");
		this.redoButton = new Button("redo-button", "Redo");

		const rightButtons = new View(html`<div id="right-buttons"></div>`);
		rightButtons.addChild(this.undoButton);
		rightButtons.addChild(this.redoButton);

		this.addChild(this.addButton);
		this.addChild(this.deleteButton);
		this.addChild(this.noneButton);
		this.addChild(this.allButton);
		this.addChild(rightButtons);

		this.addButton.addEventListener("click", () => {
			model.saveState();
			model.addChart();
		});
		this.deleteButton.addEventListener("click", () => {
			model.saveState();
			model.removeSelectedCharts();
		});
		this.noneButton.addEventListener("click", () =>
			model.deselectAllCharts()
		);
		this.allButton.addEventListener("click", () => model.selectAllCharts());
		this.undoButton.addEventListener("click", () => model.undo());
		this.redoButton.addEventListener("click", () => model.redo());

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
		this.undoButton.enabled = model.hasUndo();
		this.redoButton.enabled = model.hasRedo();
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
