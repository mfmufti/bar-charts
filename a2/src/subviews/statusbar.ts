import { SKContainer, SKLabel } from "simplekit/imperative-mode";
import type { Model } from "../model";
import type { Observer } from "../observer";

export class StatusBar extends SKContainer implements Observer {
	text: SKLabel;

	update(model: Model) {
		this.text.text =
			`${model.getChartCount()} chart` +
			(model.getChartCount() === 1 ? "" : "s") +
			(model.getSelectCount() === 0
				? ""
				: ` (${model.getSelectCount()} selected)`);
	}

	constructor(model: Model) {
		super();
		this.text = new SKLabel({ fill: "green" });

		this.addChild(this.text);
		this.padding = 10;
		this.fill = "lightgrey";

		model.addObserver(this);
		this.update(model);
	}
}
