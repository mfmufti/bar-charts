import { Layout, SKContainer, Style } from "simplekit/imperative-mode";
import { drawCircle, drawText } from "../draw";

export class SKRadioButtonGroup extends SKContainer {
	radioButtons: SKRadioButton[];
	curIndex: number | null = null;

	constructor(labels: string[], onSelect: (index: number) => void) {
		super();
		this.radioButtons = labels.map(
			(label, i) =>
				new SKRadioButton(label, () => {
					this.select(i);
					onSelect(i);
				})
		);
		this.radioButtons.forEach((el) => this.addChild(el));
		this.layoutMethod = new Layout.WrapRowLayout({ gap: 15 });
	}

	select(index: number) {
		if (this.curIndex === index) {
			return;
		}
		if (this.curIndex !== null) {
			this.radioButtons[this.curIndex].deselect();
		}
		this.radioButtons[index].select();
		this.curIndex = index;
	}

	deselect() {
		if (this.curIndex !== null) {
			this.radioButtons[this.curIndex].deselect();
		}
		this.curIndex = null;
	}

	enable() {
		this.radioButtons.forEach((el) => el.enable());
	}

	disable() {
		this.deselect();
		this.radioButtons.forEach((el) => el.disable());
	}
}

export class SKRadioButton extends SKContainer {
	private selected = false;
	private hovered = false;
	private enabled = true;
	private label: string;

	constructor(label: string, onSelect: () => void) {
		super();

		this.width = 150;
		this.height = 20;
		this.label = label;

		this.addEventListener("click", () => {
			this.select();
			onSelect();
		});

		this.addEventListener("mouseenter", () => (this.hovered = true));
		this.addEventListener("mouseexit", () => (this.hovered = false));
	}

	hitTest(mx: number, my: number): boolean {
		if (!this.enabled) {
			return false;
		}
		const r = (this.height || 0) / 2 + 1,
			cx = this.x + r,
			cy = this.y + r;
		return (mx - cx) ** 2 + (my - cy) ** 2 <= r ** 2;
	}

	select() {
		this.selected = true;
	}

	deselect() {
		this.selected = false;
	}

	enable() {
		this.enabled = true;
	}

	disable() {
		this.enabled = false;
	}

	draw(gc: CanvasRenderingContext2D) {
		const r = (this.height || 0) / 2;
		gc.translate(this.x, this.y);

		if (this.hovered) {
			drawCircle(gc, r, r, r + 4, Style.highlightColour, false);
		}

		drawCircle(gc, r, r, r, "white", true);

		if (this.selected) {
			drawCircle(gc, r, r, r - 4, "black", false);
		}

		drawText(gc, 30, r, this.label, 14, "left", "middle");

		gc.translate(-this.x, -this.y);
	}
}
