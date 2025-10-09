import {
	SKContainer,
	Layout,
	requestKeyboardFocus,
	SKMouseEvent,
} from "simplekit/imperative-mode";
import { ButtonPanel } from "./subviews/buttonpanel";
import type { Model } from "./model";
import { StatusBar } from "./subviews/statusbar";
import { ChartList } from "./subviews/chartlist";
import { EditPanel } from "./subviews/editpanel";
import { ChartArea } from "./subviews/chart";

export class MainView extends SKContainer {
	constructor(model: Model) {
		super();
		const topWrapper = new SKContainer(),
			chartArea = new ChartArea(model),
			editPanel = new EditPanel(model),
			buttonPanel = new ButtonPanel(model),
			chartList = new ChartList(model),
			statusBar = new StatusBar(model);

		chartArea.fillHeight = 1;
		chartArea.fillWidth = 1;

		topWrapper.addChild(chartArea);
		topWrapper.addChild(editPanel);
		topWrapper.layoutMethod = new Layout.FillRowLayout({ gap: 10 });
		topWrapper.padding = 10;

		this.addChild(topWrapper);
		this.addChild(buttonPanel);
		this.addChild(chartList);
		this.addChild(statusBar);

		this.addEventListener("keydown", (ev) => {
			if ((ev as KeyboardEvent).key === "Shift") {
				model.shiftDown();
			}
		});

		this.addEventListener("keyup", (ev) => {
			if ((ev as KeyboardEvent).key === "Shift") {
				model.shiftUp();
			}
		});
	}

	handleMouseEvent(me: SKMouseEvent): boolean {
		if (me.type === "mousedown") {
			requestKeyboardFocus(this);
		}
		return false;
	}
}
