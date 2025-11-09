import html from "html-template-tag";
import { View } from "../view";

export class Options extends View {
	private static count = 0;
	private radioButtons: SKRadioButton[];
	private curIndex: number | null = null;

	constructor(labels: string[], onSelect: (index: number) => void) {
		super(`
			<div
				id="radio-group-${Options.count}"
				class="radio-group"
			></div>
		`);
		this.radioButtons = labels.map(
			(label, i) =>
				new SKRadioButton(
					label,
					`radio-group-${Options.count++}`,
					() => {
						this.select(i);
						onSelect(i);
					}
				)
		);
		this.radioButtons.forEach((el) => this.addChild(el));
	}

	select(index: number): void {
		if (this.curIndex === index) {
			return;
		}
		if (this.curIndex !== null) {
			this.radioButtons[this.curIndex].deselect();
		}
		this.radioButtons[index].select();
		this.curIndex = index;
	}

	deselect(): void {
		if (this.curIndex !== null) {
			this.radioButtons[this.curIndex].deselect();
		}
		this.curIndex = null;
	}

	enable(): void {
		this.radioButtons.forEach((el) => el.enable());
	}

	disable(): void {
		this.deselect();
		this.radioButtons.forEach((el) => el.disable());
	}
}

export class SKRadioButton extends View {
	constructor(label: string, name: string, onSelect: () => void) {
		super(html`
			<div>
				<input
					type="radio"
					id="radio-${label.toLowerCase()}"
					name="${name}"
				/>
				<label for="${label.toLowerCase()}">${label}</label>
			</div>
		`);

		this.addEventListener("click", onSelect);
	}

	private getRadio() {
		return this._root.firstElementChild as HTMLInputElement;
	}

	select(): void {
		this.getRadio().checked = true;
	}

	deselect(): void {
		this.getRadio().checked = false;
	}

	enable(): void {
		this.getRadio().disabled = false;
	}

	disable(): void {
		this.getRadio().disabled = true;
		this.deselect();
	}
}
