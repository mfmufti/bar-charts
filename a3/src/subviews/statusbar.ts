import html from "html-template-tag";
import type { Model } from "../model";
import { View } from "../view";

export class StatusBar extends View {
	private leftText: View;
	private rightText: View;

	constructor(model: Model) {
		super(html`<div id="status-bar"></div>`);
		this.leftText = new View(html`<span id="status-bar-left"></span>`);
		this.rightText = new View(html`<span id="status-bar-right"></span>`);

		this.addChild(this.leftText);
		this.addChild(this.rightText);
		this.update(model);
		model.addObserver(this);
	}

	update(model: Model): void {
		const chartCount = model.getChartCount();
		const selectCount = model.getSelectCount();
		this.leftText.root.innerText =
			`${chartCount || "no"} chart` +
			(chartCount === 1 ? "" : "s") +
			(selectCount === 0 ? "" : ` (${selectCount} selected)`);

		this.rightText.root.innerText = model.isShiftDown() ? "SHIFT" : "";
	}
}
