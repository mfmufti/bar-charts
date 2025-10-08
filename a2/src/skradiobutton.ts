import { Layout, SKContainer, SKLabel } from "simplekit/imperative-mode";

export class SKRadioButtonGroup extends SKContainer {
	radioButtons: SKRadioButton[];
	curIndex: number | null = null;

	constructor(labels: string[]) {
		super();
		this.radioButtons = labels.map(
			(label, i) =>
				new SKRadioButton(label, () => {
					this.select(i);
				})
		);
		this.radioButtons.forEach((el) => this.addChild(el));
		this.layoutMethod = new Layout.WrapRowLayout();
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
}

export class SKRadioButton extends SKContainer {
	// private selected = false;
	private tmp = new SKLabel();

	constructor(label: string, onSelect: () => void) {
		super();

		this.tmp.text = "no";
		this.addChild(this.tmp);
		this.addChild(new SKLabel({ text: label }));
		this.layoutMethod = new Layout.FillRowLayout({ gap: 20 });

		this.addEventListener("click", () => {
			this.select();
			onSelect();
		});
	}

	select() {
		// this.selected = true;
		this.tmp.text = "no";
	}

	deselect() {
		// this.selected = false;
		this.tmp.text = "yes";
	}
}
