import { animator } from "./animator";
import { Circle, Line, Rect, Text } from "./basicshapes";
import { type Dataset } from "./datasets";
import { Drawable, EventDrawable } from "./drawable";
import { eventHandler } from "./eventhandler";

export type ChartOptions = {x: number, y: number, w: number, h: number};
type ChartBarOptions = {x: number, y1: number, y2: number, w: number, value: number, hue: number};
type OutlinedChevronOptions = {x: number, y: number, dir: string};

export class Chart extends EventDrawable {
	background = new Rect();
	titleText = new Text();
	xAxis = new Line();
	yAxis = new Line();
	outlinedChevron = new OutlinedChevron();
	ticks: Line[] = [];
	yLabels: Text[] = [];
	xLabels: Text[] = [];
	bars: ChartBar[] = [];
	dataset?: Dataset;
	flickDir = "left";
	changeNext: () => void;
	changePrev: () => void

	constructor(changePrev: () => void, changeNext: () => void) {
		super();
		this.changeNext = changeNext;
		this.changePrev = changePrev;
		for (let i = 0; i < 11; i++) {
			this.ticks.push(new Line());
		}
		for (let i = 0; i < 6; i++) {
			this.yLabels.push(new Text());
		}
		eventHandler.addFlickEvent(this);
	}

	setDataset(dataset: Dataset, animate = true) {
		this.bars.forEach(bar => bar.prepareDelete());
		this.xLabels = [];
		this.bars = [];
		this.dataset = dataset;

		dataset.labels.forEach((label, i) => {
			this.xLabels.push(new Text());
			this.bars.push(new ChartBar((value) => dataset.values[i] = value, animate));
		});
	}

	draw(gc: CanvasRenderingContext2D, {x, y, w, h}: ChartOptions) {
		this.background.draw(gc, {x, y, w, h, color: "white"});
		this.xAxis.draw(gc, {x1: x + 60, x2: x + w - 30, y1: y + h - 60, y2: y + h - 60});
		
		this.xAxis.draw(gc, {x1: x + 60, x2: x + w - 30, y1: y + h - 60, y2: y + h - 60});
		this.yAxis.draw(gc, {x1: x + 60, x2: x + 60, y1: y + 60, y2: y + h - 60});

		for (let i = 0; i < 11; i++) {
			let tickY = (h - 60 - 60) / (11 - 1) * i + y + 60;
			this.ticks[i].draw(gc, {x1: x + 60 - 5, x2: x + 60, y1: tickY, y2: tickY})
		}

		for (let i = 0; i < 6; i++) {
			let labelY = (h - 60 - 60) / (6 - 1) * i + y + 60;
			this.yLabels[i].draw(gc, {x: x + 60 - 5 - 5, y: labelY, size: 14, text: "" + (100 - i * 20), alignX: "right"});
		}

		if (this.dataset) {
			let {title, labels, values} = this.dataset;
			let cnt = labels.length;
			let barW = ((w - 30 - 60) - 20 * (cnt + 1)) / cnt;

			this.titleText.draw(gc, {x: x + w / 2, y: y + 60 / 2, size: 18, text: title});

			labels.forEach((label, i) => {
				let labelX = x + 60 + (barW + 20) * i + 20 + barW / 2;
				this.xLabels[i].draw(gc, {x: labelX, y: y + h - 60 + 10, size: 14, text: label, alignY: "top"});
			});

			values.forEach((value, i) => {
				let barX = x + 60 + (barW + 20) * i + 20;
				this.bars[i].draw(gc, {x: barX, y1: y + 60, y2: y + h - 60, w: barW, value, hue: 360 / cnt * i});
			});
			this.outlinedChevron.draw(gc, {x: x + w / 2, y: y + h / 2, dir: this.flickDir});
		}
	}

	handleFlickLeft(): void {
		this.flickDir = "left";
		this.outlinedChevron.startAnimate();
		this.changePrev();
	}

	handleFlickRight(): void {
		this.flickDir = "right";
		this.outlinedChevron.startAnimate();
		this.changeNext();
	}
}

class ChartBar extends EventDrawable {
	rect = new Rect();
	label = new Text();
	hovered = false;
	focused = false;
	animationProgress = 1;
	value?: number;
	changeValue: (value: number) => void;
	x1?: number;
	x2?: number;
	y1?: number;
	y2?: number;

	constructor(changeValue: (value: number) => void, animate = true) {
		super();
		this.changeValue = changeValue;
		eventHandler.addMouseMoveEvent(this);
		eventHandler.addFocusEvent(this);
		if (animate) {
			animator.addJob(1000, (progress: number) => {this.animationProgress = progress});
		}
	}

	draw(gc: CanvasRenderingContext2D, {x, y1, y2, w, value, hue}: ChartBarOptions) {
		let h = (y2 - y1) / 100 * value * this.animationProgress;
		let color = `hsl(${hue},100%,${this.hovered ? 38 : 50}%)`;
		if (this.focused) {
			this.rect.draw(gc, {x: x - 5, y: y2 - h - 5, w: w + 5 * 2, h: h + 5 * 2, color: "dodgerblue"});
		}
		this.x1 = x, this.x2 = x + w, this.y1 = y2 - h, this.y2 = y2, this.value = value;
		this.rect.draw(gc, {x, y: y2 - h, w, h, color, border: true});
		if (this.hovered) {
			if (w > 20 && h > 20) {
				this.label.draw(gc, {x: x + w / 2, y: y2 - h / 2, size: 14, text: `${value}`, color: "white"});
			} else {
				this.label.draw(gc, {x: x + w / 2, y: y2 - h - 10, size: 14, text: `${value}`, color: "black", alignY: "bottom"});
			}
		}
	}

	isHovered(x: number, y: number): boolean {
		if (!this.x1 || !this.x2 || !this.y1 || !this.y2) {
			return false;
		}
		return this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2;
	}

	handleMouseEnter(): void {this.hovered = true;}
	handleMouseLeave(): void {this.hovered = false;}
	handleFocus(): void {
		this.focused = true;
		eventHandler.addKeyEvent(this);
	}
	handleUnFocus(): void {
		this.focused = false;
		eventHandler.removeKeyEvent(this);
	}

	handleKeyPress(keys: string[]): void {
		if (this.value === undefined) {
			return;
		}
		let lastKey = keys[keys.length - 1];
		let diff = keys.indexOf("Shift") != -1 ? 10 : 1;

		if (lastKey == "ArrowUp") {
			this.changeValue(Math.min(100, this.value + diff));
		} else if (lastKey == "ArrowDown") {
			this.changeValue(Math.max(0, this.value - diff));
		}
	}

	prepareDelete() {
		eventHandler.removeMouseMoveEvent(this);
		eventHandler.removeFocusEvent(this);
		eventHandler.removeKeyEvent(this);
	}
}

class OutlinedChevron extends Drawable {
	circle = new Circle();
	opacity = 0;

	startAnimate() {
		this.opacity = 0.8;
		animator.addJob(1000, progress => this.opacity = (1 - progress) * 0.8);
		console.log("start animate?");
	}

	draw(gc: CanvasRenderingContext2D, {x, y, dir}: OutlinedChevronOptions) {
		if (this.opacity == 0) {
			return;
		}
		let lineColor = `rgba(0,0,0,${this.opacity})`;
		let backgroundColor = `rgba(211,211,211,${this.opacity})`
		this.circle.draw(gc, {x, y, r: 75, color: backgroundColor, border: true, borderWidth: 5, borderColor: lineColor});
		gc.lineWidth = 12;
		gc.strokeStyle = lineColor;
		gc.beginPath();
		if (dir === "left") {
			gc.moveTo(x + 30, y - 45);
			gc.lineTo(x - 30, y);
			gc.lineTo(x + 30, y + 45);
		} else {
			gc.moveTo(x - 30, y - 45);
			gc.lineTo(x + 30, y);
			gc.lineTo(x - 30, y + 45);
		}
		gc.stroke();
	}
}