import { Layout, SKContainer, SKLabel } from "simplekit/imperative-mode";
import type { Model } from "../model";
import type { Observer } from "../observer";

export class StatusBar extends SKContainer implements Observer {
	private leftText: SKLabel;
	private rightText: SKLabel;

	constructor(model: Model) {
		super();
		this.leftText = new SKLabel();
		this.rightText = new SKLabel();

		const filler = new SKContainer();
		filler.fillWidth = 1;
		filler.fillHeight = 1;

		this.padding = 10;
		this.fill = "lightgrey";
		this.layoutMethod = new Layout.FillRowLayout();

		this.addChild(this.leftText);
		this.addChild(filler);
		this.addChild(this.rightText);
		this.update(model);
		model.addObserver(this);
	}

	update(model: Model): void {
		const chartCount = model.getChartCount();
		const selectCount = model.getSelectCount();
		this.leftText.text =
			`${chartCount || "no"} chart` +
			(chartCount === 1 ? "" : "s") +
			(selectCount === 0 ? "" : ` (${selectCount} selected)`);

		this.rightText.text = model.isShiftDown() ? "SHIFT" : "";
	}
}
