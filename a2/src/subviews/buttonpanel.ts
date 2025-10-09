import { SKContainer, Layout, SKButton } from "simplekit/imperative-mode";
import type { Model } from "../model";
import type { Observer } from "../observer";

export class ButtonPanel extends SKContainer implements Observer {
	private addButton;
	private deleteButton;
	private noneButton;
	private allButton;

	constructor(model: Model) {
		super();
		const width = 80,
			height = 28;
		(this.addButton = new Button({ text: "Add", width, height })),
			(this.deleteButton = new Button({ text: "Delete", width, height })),
			(this.noneButton = new Button({ text: "None", width, height })),
			(this.allButton = new Button({ text: "All", width, height }));
		this.addChild(this.addButton);
		this.addChild(this.deleteButton);
		this.addChild(this.noneButton);
		this.addChild(this.allButton);
		this.layoutMethod = new Layout.FillRowLayout({ gap: 10 });
		this.padding = 10;
		this.fill = "lightgrey";

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

export class Button extends SKButton {
	private _enabled = true;
	border = "black";

	get enabled(): boolean {
		return this._enabled;
	}

	set enabled(enabled: boolean) {
		this._enabled = enabled;
		if (enabled) {
			this.border = "black";
		} else {
			this.border = "grey";
			this.state = "idle";
		}
	}

	hitTest(mx: number, my: number): boolean {
		if (this._enabled) {
			return super.hitTest(mx, my);
		} else {
			return false;
		}
	}
}
