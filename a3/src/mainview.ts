import html from "html-template-tag";
import { ButtonPanel } from "./subviews/buttonpanel";
import type { Model } from "./model";
import { StatusBar } from "./subviews/statusbar";
import { ChartList } from "./subviews/chartlist";
import { EditPanel } from "./subviews/editpanel";
import { ChartArea } from "./subviews/chart";
import { View } from "./view";

export class MainView extends View {
	constructor(model: Model) {
		super(html`<div id="main-view"></div>`);

		const topWrapper = new View(html`<div id="top-wrapper"></div>`),
			bottomWrapper = new View(html`<div id="bottom-wrapper"></div>`),
			chartArea = new ChartArea(model),
			editPanel = new EditPanel(model),
			buttonPanel = new ButtonPanel(model),
			chartList = new ChartList(model),
			statusBar = new StatusBar(model);

		topWrapper.addChild(chartArea);
		topWrapper.addChild(editPanel);

		bottomWrapper.addChild(buttonPanel);
		bottomWrapper.addChild(chartList);
		bottomWrapper.addChild(statusBar);

		this.addChild(topWrapper);
		this.addChild(bottomWrapper);
	}
}
