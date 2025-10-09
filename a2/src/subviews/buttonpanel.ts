import { SKContainer, Layout, SKButton } from "simplekit/imperative-mode";
import type { Model } from "../model";

export class ButtonPanel extends SKContainer {
	constructor(model: Model) {
		super();
		const width = 80,
			height = 28;
		const addButton = new SKButton({ text: "Add", width, height }),
			deleteButton = new SKButton({ text: "Delete", width, height }),
			noneButton = new SKButton({ text: "None", width, height }),
			allButton = new SKButton({ text: "All", width, height });
		this.addChild(addButton);
		this.addChild(deleteButton);
		this.addChild(noneButton);
		this.addChild(allButton);
		this.layoutMethod = new Layout.FillRowLayout({ gap: 10 });
		this.padding = 10;
		this.fill = "lightgrey";

		addButton.addEventListener("click", () => model.addChart());
		deleteButton.addEventListener("click", () =>
			model.removeSelectedCharts()
		);
		noneButton.addEventListener("click", () => model.deselectAllCharts());
		allButton.addEventListener("click", () => model.selectAllCharts());
	}
}
