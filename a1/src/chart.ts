import { animator, easeIn, easeOut } from "./animator";
import { Circle, Line, Rect, Text } from "./basicshapes";
import { type Dataset } from "./datasets";
import { Drawable, EventDrawable } from "./drawable";
import { eventHandler } from "./eventhandler";

export type ChartOptions = {x: number, y: number, w: number, h: number};
type ChartBarOptions = {x: number, y1: number, y2: number, w: number, value: number, hue: number};
type OutlinedChevronOptions = {x: number, y: number, dir: string};

export class Chart extends EventDrawable {
	private background = new Rect();
	private titleText = new Text();
	private xAxis = new Line();
	private yAxis = new Line();
	private outlinedChevron = new OutlinedChevron();
	private ticks: Line[] = [];
	private yLabels: Text[] = [];
	private xLabels: Text[] = [];
	private bars: ChartBar[] = [];
	private dataset?: Dataset;
	private flickDir = "left";
	private changeNext: () => void;
	private changePrev: () => void

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
		const margin = 60, marginRight = 30, tickSize = 5, barSpace = 20;
		const labelCnt = this.yLabels.length, tickCnt = this.ticks.length;
		
		this.background.draw(gc, {x, y, w, h, color: "white"});
		this.xAxis.draw(gc, {x1: x + margin, x2: x + w - marginRight, y1: y + h - margin, y2: y + h - margin});
		this.yAxis.draw(gc, {x1: x + margin, x2: x + margin, y1: y + margin, y2: y + h - margin});

		for (let i = 0; i < tickCnt; i++) {
			let tickY = (h - margin * 2) / (tickCnt - 1) * i + y + margin;
			this.ticks[i].draw(gc, {x1: x + margin - tickSize, x2: x + margin, y1: tickY, y2: tickY})
		}

		for (let i = 0; i < labelCnt; i++) {
			let labelY = (h - margin * 2) / (labelCnt - 1) * i + y + margin;
			this.yLabels[i].draw(gc, {x: x + margin - tickSize * 2, y: labelY, size: 14, text: "" + (100 - i * barSpace), alignX: "right"});
		}

		if (this.dataset) {
			let {title, labels, values} = this.dataset;
			let cnt = labels.length;
			let barW = ((w - marginRight - margin) - barSpace * (cnt + 1)) / cnt;

			this.titleText.draw(gc, {x: x + w / 2, y: y + margin / 2, size: 18, text: title});

			labels.forEach((label, i) => {
				let labelX = x + margin + (barW + barSpace) * i + barSpace + barW / 2;
				this.xLabels[i].draw(gc, {x: labelX, y: y + h - margin + 10, size: 14, text: label, alignY: "top"});
			});

			values.forEach((value, i) => {
				let barX = x + margin + (barW + barSpace) * i + barSpace;
				this.bars[i].draw(gc, {x: barX, y1: y + margin, y2: y + h - margin, w: barW, value, hue: 360 / cnt * i});
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
	private rect = new Rect();
	private label = new Text();
	private hovered = false;
	private focused = false;
	private animationProgress = 1;
	private value?: number;
	private changeValue: (value: number) => void;
	private x1?: number;
	private x2?: number;
	private y1?: number;
	private y2?: number;

	constructor(changeValue: (value: number) => void, animate = true) {
		super();

		this.changeValue = changeValue;
		eventHandler.addMouseMoveEvent(this);
		eventHandler.addFocusEvent(this);

		if (animate) {
			animator.addJob(1000, (progress: number) => {this.animationProgress = progress}, easeIn);
		}
	}

	draw(gc: CanvasRenderingContext2D, {x, y1, y2, w, value, hue}: ChartBarOptions) {
		const h = (y2 - y1) / 100 * value * this.animationProgress;
		const color = `hsl(${hue},100%,${this.hovered ? 38 : 50}%)`;
		const borderWidth = 1;
		
		if (this.focused) {
			const focusWidth = borderWidth + 4;
			this.rect.draw(gc, {x: x - focusWidth, y: y2 - h - focusWidth, w: w + focusWidth * 2, h: h + focusWidth * 2, color: "dodgerblue"});
		}

		this.x1 = x - borderWidth, this.x2 = x + w + borderWidth, this.y1 = y2 - h - borderWidth, this.y2 = y2 + borderWidth, this.value = value;
		this.rect.draw(gc, {x, y: y2 - h, w, h, color, border: true});
		
		if (this.hovered) {
			const labelSize = 14;
			if (w > 20 && h > 20) {
				this.label.draw(gc, {x: x + w / 2, y: y2 - h / 2, size: labelSize, text: `${value}`, color: "white"});
			} else {
				this.label.draw(gc, {x: x + w / 2, y: y2 - h - 10, size: labelSize, text: `${value}`, color: "black", alignY: "bottom"});
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

		const lastKey = keys[keys.length - 1];
		const diff = keys.indexOf("Shift") != -1 ? 10 : 1;

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
	private circle = new Circle();
	private opacity = 0;

	startAnimate() {
		this.opacity = 0.8;
		animator.addJob(1000, progress => this.opacity = (1 - progress) * 0.8, easeOut);
	}

	draw(gc: CanvasRenderingContext2D, {x, y, dir}: OutlinedChevronOptions) {
		if (this.opacity === 0) {
			return;
		}

		const lineColor = `rgba(0,0,0,${this.opacity})`;
		const backgroundColor = `rgba(211,211,211,${this.opacity})`;
		const addX = 30, addY = 45;

		this.circle.draw(gc, {x, y, r: 75, color: backgroundColor, border: true, borderWidth: 5, borderColor: lineColor});
		gc.lineWidth = 12;
		gc.strokeStyle = lineColor;
		gc.beginPath();

		if (dir === "left") {
			gc.moveTo(x + addX, y - addY);
			gc.lineTo(x - addX, y);
			gc.lineTo(x + addX, y + addY);
		} else {
			gc.moveTo(x - addX, y - addY);
			gc.lineTo(x + addX, y);
			gc.lineTo(x - addX, y + addY);
		}

		gc.stroke();
	}
}