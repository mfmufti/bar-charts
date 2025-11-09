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
	private overlay: View;
	private valuesWrapper: View;
	private ignoreUpdate: boolean = false;

	constructor(model: Model) {
		super(html`<div id="edit-panel"></div>`);

		this.titleField = new TextField("Title:", (value) => {
			model.updateChartTitle(value);
		});

		this.valuesLabel = new View(html`
			<div class="text-field-wrapper">
				<label>Values:</label>
			</div>
		`);

		this.options = new Options(
			colorSchemes.map((cs) => cs.name),
			(index) => model.updateChartColorScheme(colorSchemes[index])
		);

		this.valuesWrapper = new View(html`<div id="values-wrapper"></div>`);

		this.overlay = new View(html`<div id="edit-panel-overlay"></div>`);
		this.overlay.root.style.display = "none";

		this.addChild(this.titleField);
		this.addChild(this.options);
		this.addChild(this.valuesLabel);
		this.addChild(this.overlay);
		this.addChild(this.valuesWrapper);
		this.update(model);
		model.addObserver(this);
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
			this.overlay.root.style.display = "block";
			this.valuesLabel.root.style.display = "none";
			this.valuesWrapper.root.innerHTML = "";
		} else {
			this.options.enable();
			this.options.select(
				colorSchemes.indexOf(selectedChart.colorScheme)
			);
			this.titleField.value = selectedChart.title;
			this.titleField.enable();
			this.overlay.root.style.display = "none";
			this.valuesLabel.root.style.display = "block";
			this.valuesWrapper.root.innerHTML = "";
			selectedChart.labels.forEach((label, i) => {
				const textField = new TextField(
					`${label}: `,
					(value) => {
						this.ignoreUpdate = true;
						model.updateChartValue(i, parseInt("0" + value));
						this.ignoreUpdate = false;
					},
					true
				);
				textField.value = selectedChart.values[i].toString();
				this.valuesWrapper.addChild(textField);
			});
		}
	}
}
