import { Layout, SKContainer, SKLabel } from "simplekit/imperative-mode";
import type { Model } from "../model";
import type { Observer } from "../observer";

export class StatusBar extends SKContainer implements Observer {
	leftText: SKLabel;
	rightText: SKLabel;

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

	update(model: Model) {
		this.leftText.text =
			`${model.getChartCount()} chart` +
			(model.getChartCount() === 1 ? "" : "s") +
			(model.getSelectCount() === 0
				? ""
				: ` (${model.getSelectCount()} selected)`);

		this.rightText.text = model.isShiftDown() ? "SHIFT" : "";
	}
}
