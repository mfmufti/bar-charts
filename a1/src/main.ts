import {
	startSimpleKit,
	setSKDrawCallback,
	setSKEventListener,
	SKEvent,
	SKMouseEvent,
	setSKAnimationCallback,
	addSKEventTranslator,
} from "simplekit/canvas-mode";
import { BottomBar } from "./bottombar";
import { Chart } from "./chart";
import { Rect } from "./basicshapes";
import { datasets } from "./datasets";
import { eventHandler } from "./eventhandler";
import { animator } from "./animator";
import { flickEventTranslator } from "./flickeventtranslator";

let index = 0;
let setIndex = (i: number) => {
	if (i >= 0 && i < 10 && i !== index) {
		index = i;
		chart.setDataset(datasets[i]);
		bottomBar.changeIndex(i);
	}
};
let background = new Rect();
let bottomBar = new BottomBar(setIndex);
let chart = new Chart(() => setIndex(index - 1), () => setIndex(index + 1));
chart.setDataset(datasets[index], false);

addSKEventTranslator(flickEventTranslator);

setSKEventListener((event: SKEvent) => {
	switch (event.type) {
		case "mousemove": {
			const {x, y} = event as SKMouseEvent;
			eventHandler.mouseMoved(x, y);
			break;
		} case "click": {
			const {x, y} = event as SKMouseEvent;
			eventHandler.clicked(x, y);
			break;
		} case "keydown": {
			const {key} = event as KeyboardEvent;
			eventHandler.keyDown(key);
			break;
		} case "keyup": {
			const {key} = event as KeyboardEvent;
			eventHandler.keyUp(key);
			break;
		} case "flickleft": {
			console.log("flickleft");
			eventHandler.flickedLeft();
			break;
		} case "flickright": {
			console.log("flickright");
			eventHandler.flickedRight();
			break;
		}
	}
});

setSKDrawCallback((gc) => {
	let w = gc.canvas.width, h = gc.canvas.height;

	background.draw(gc, {x: 0, y: 0, w: w, h: h, color: "gray"});
	bottomBar.draw(gc, {x: 0, y: h - 50, w: w, h: 50});
	
	let chartWidth = w - 20, chartHeight = h - 20 - 50;
	chartWidth = Math.min(chartWidth, chartHeight / 3 * 4);
	chartHeight = Math.min(chartHeight, chartWidth / 4 * 3);
	chart.draw(gc, {x: (w - chartWidth) / 2, y: (h - 50 - chartHeight) / 2, w: chartWidth, h: chartHeight});
});

setSKAnimationCallback((time) => {
	animator.animate(time);
});

startSimpleKit();