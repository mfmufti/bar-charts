import html from "html-template-tag";
import { Model } from "../model";
import { colorSchemes } from "../colorscheme";
import { Options } from "./options";
import { View } from "../view";

export class EditPanel extends View {
	private buttonGroup: Options;
	private textField: Textfield;
	private overlay: View;

	constructor(model: Model) {
		super(html`<div id="edit-panel"></div>`);

		const textFieldWrapper = new View(
			html`<div id="text-field-wrapper"></div>`
		);

		this.buttonGroup = new Options(
			colorSchemes.map((cs) => cs.name),
			(index) => model.updateChartColorScheme(colorSchemes[index])
		);

		this.textField = new Textfield();
		this.textField.addEventListener("input", () =>
			model.updateChartTitle(this.textField.root.value)
		);
		this.textField.root.id = "text-field";

		this.overlay = new View(html`<div id="edit-panel-overlay"></div>`);
		this.overlay.root.style.display = "none";

		textFieldWrapper.addChild(new View(html`<label>Title: </label>`));
		textFieldWrapper.addChild(this.textField);

		this.addChild(textFieldWrapper);
		this.addChild(this.buttonGroup);
		this.addChild(this.overlay);
		this.update(model);
		model.addObserver(this);
	}

	update(model: Model): void {
		const selectedChart = model.getFirstSelected();
		if (!selectedChart || model.getSelectCount() !== 1) {
			this.buttonGroup.disable();
			this.textField.root.value = "";
			this.textField.disable();
			this.overlay.root.style.display = "block";
		} else {
			this.buttonGroup.enable();
			this.buttonGroup.select(
				colorSchemes.indexOf(selectedChart.colorScheme)
			);
			this.textField.root.value = selectedChart.title;
			this.textField.enable();
			this.overlay.root.style.display = "none";
		}
	}
}

class Textfield extends View {
	constructor() {
		super(html`<input type="text" />`);
	}

	get root() {
		return this._root as HTMLInputElement;
	}

	disable(): void {
		this.root.disabled = true;
	}

	enable(): void {
		this.root.disabled = false;
	}
}
