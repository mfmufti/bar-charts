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

let curIndex = 0;
let setIndex = (i: number) => {
	if (i >= 0 && i < 10 && i !== curIndex) {
		curIndex = i;
		chart.setDataset(datasets[i]);
		bottomBar.changeIndex(i);
	}
};
let background = new Rect();
let bottomBar = new BottomBar(setIndex);
let chart = new Chart(() => setIndex(curIndex - 1), () => setIndex(curIndex + 1));
chart.setDataset(datasets[curIndex], false);

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
	const w = gc.canvas.width, h = gc.canvas.height;
	const barH = 50, chartPadding = 20; // 20 for 10 on both sides

	background.draw(gc, {x: 0, y: 0, w: w, h: h, color: "gray"});
	bottomBar.draw(gc, {x: 0, y: h - barH, w: w, h: barH});
	
	let chartWidth = w - chartPadding, chartHeight = h - chartPadding - barH;
	chartWidth = Math.min(chartWidth, chartHeight / 3 * 4);
	chartHeight = Math.min(chartHeight, chartWidth / 4 * 3);
	chart.draw(gc, {x: (w - chartWidth) / 2, y: (h - barH - chartHeight) / 2, w: chartWidth, h: chartHeight});
});

setSKAnimationCallback((time) => {
	animator.animate(time);
});

startSimpleKit();