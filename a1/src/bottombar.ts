import { Drawable, EventDrawable } from "./drawable";
import { Rect, Line, Circle, Text } from "./basicshapes"
import { eventHandler } from "./eventhandler";
import { animator } from "./animator";

export type BottomBarOptions = {x: number, y: number, w: number, h: number}
type ButtonOptions = {x: number, y: number, r: number};

export class BottomBar extends Drawable {
	private rect = new Rect();
	private line = new Line();
	private buttons: Button[] = [];
	private activeIndex = 0;

	constructor(setActiveGraph: (index: number) => void) {
		super();
		for (let i = 0; i < 10; i++) {
			this.buttons.push(new Button(`${i + 1}`, () => {
				if (i === this.activeIndex) {
					return;
				}
				this.buttons[this.activeIndex].setInactive();
				this.activeIndex = i;
				this.buttons[i].setActive();
				setActiveGraph(i);
			}));
		}
		this.buttons[0].setActive();
	}

	draw(gc: CanvasRenderingContext2D, {x, y, w, h}: BottomBarOptions) {
		this.rect.draw(gc, {x, y, w, h, color: "lightgray"});
		this.line.draw(gc, {x1: x, y1: y, x2: x + w, y2: y})
		
		let buttonStart = (w - 30 * 10 - 10 * (10 - 1)) / 2;
		for (let i = 0; i < 10; i++) {
			let curX = buttonStart + (10 + 15 * 2) * i + 15;
			let curY = y + 15 + (50 - 30) / 2;
			this.buttons[i].draw(gc, {x: curX, y: curY, r: 15});
		}
	}

	changeIndex(index: number): void {
		if (this.activeIndex !== index) {
			this.buttons[this.activeIndex].setInactive();
			this.buttons[index].setActive();
			this.activeIndex = index;
		}
	}
}

class Button extends EventDrawable {
	circle = new Circle();
	labelText = new Text();
	label: string;
	hovered = false;
	animationProgress = 1;
	x?: number;
	y?: number;
	r?: number;
	active = false;
	action: () => void;

	constructor(label: string, action: () => void) {
		super();
		this.label = label;
		this.action = action;
		eventHandler.addMouseMoveEvent(this);
		eventHandler.addClickEvent(this);
	}

	draw(gc: CanvasRenderingContext2D, {x, y, r}: ButtonOptions): void {
		let animated = this.active && this.animationProgress === 1;
		let animating = this.active && this.animationProgress < 1;
		let circleColor = animated ? "dodgerblue" : "whitesmoke";
		let textColor = animated ? "white" : "black";
		this.x = x, this.y = y, this.r = r;
		if (this.hovered) {
			this.circle.draw(gc, {x, y, r: r + 4, color: "gold"})
		}
		this.circle.draw(gc, {x, y, r, color: circleColor, border: !animating});
		if (animating) {
			this.circle.draw(gc, {x, y, r: r * this.animationProgress, color: "dodgerblue"});
			this.circle.draw(gc, {x, y, r, border: true, fill: false});
		}
		this.labelText.draw(gc, {x, y, size: 18, text: this.label, color: textColor});
	}

	isHovered(x: number, y: number): boolean {
		if (!this.x || !this.y || !this.r) {
			return false;
		} else {
			return Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2) <= this.r;
		}
	}

	handleMouseEnter(): void {this.hovered = true;}
	handleMouseLeave(): void {this.hovered = false;}

	handleClick(): void {
		if (!this.active) {
			animator.cancelAnimations();
			this.animationProgress = 0;
			animator.addJob(500, progress => this.animationProgress = progress);
		}
		this.action();
	}

	setActive = () => {this.active = true;};
	setInactive = () => {
		this.active = false;
		this.animationProgress = 1;
	};
}