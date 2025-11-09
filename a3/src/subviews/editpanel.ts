import html from "html-template-tag";
import { Model } from "../model";
import { colorSchemes } from "../colorscheme";
import { Options } from "./options";
import { View } from "../view";
import { TextField } from "./textfield";

export class EditPanel extends View {
	private titleField: TextField;
	private valuesLabel: View;
	private options: Options;
	private valuesWrapper: View;
	private textFields: TextField[] = [];
	private ignoreUpdate: boolean = false;

	constructor(model: Model) {
		super(html`<div id="edit-panel"></div>`);

		this.titleField = new TextField(
			"Title:",
			(value) => {
				model.updateChartTitle(value);
			},
			() => this.saveState(model),
			false,
			0
		);

		this.valuesLabel = new View(html`
			<div class="text-field-wrapper">
				<label>Values:</label>
			</div>
		`);

		this.options = new Options(
			colorSchemes.map((cs) => cs.name),
			(index) => model.updateChartColorScheme(colorSchemes[index]),
			() => this.saveState(model)
		);

		this.valuesWrapper = new View(html`<div id="values-wrapper"></div>`);

		this.addChild(this.titleField);
		this.addChild(this.options);
		this.addChild(this.valuesLabel);
		this.addChild(this.valuesWrapper);
		this.update(model);
		model.addObserver(this);
	}

	private saveState(model: Model) {
		this.ignoreUpdate = true;
		model.saveState();
		this.ignoreUpdate = false;
	}

	update(model: Model): void {
		if (this.ignoreUpdate) {
			return;
		}
		const selectedChart = model.getFirstSelected();
		if (!selectedChart || model.getSelectCount() !== 1) {
			this.options.disable();
			this.titleField.value = "";
			this.titleField.disable();
			this.valuesLabel.root.style.display = "none";
			this.textFields.forEach((textField) => textField.removeListeners());
			this.textFields = [];
			this.valuesWrapper.root.innerHTML = "";
		} else {
			this.options.enable();
			this.options.select(
				colorSchemes.indexOf(selectedChart.colorScheme)
			);
			this.titleField.value = selectedChart.title;
			this.titleField.enable();
			this.valuesLabel.root.style.display = "block";
			this.textFields.forEach((textField) => textField.removeListeners());
			this.textFields = [];
			this.valuesWrapper.root.innerHTML = "";
			selectedChart.labels.forEach((label, i) => {
				const textField = new TextField(
					`${label}: `,
					(value) => {
						this.ignoreUpdate = true;
						model.updateChartValue(i, parseInt("0" + value));
						this.ignoreUpdate = false;
					},
					() => this.saveState(model),
					true,
					i + 1
				);
				textField.value = selectedChart.values[i].toString();
				this.valuesWrapper.addChild(textField);
				this.textFields.push(textField);
			});
		}
	}
}
