import {
	Layout,
	SKContainer,
	SKLabel,
	SKTextfield,
} from "simplekit/imperative-mode";
import { colorSchemes, Model } from "../model";
import type { Observer } from "../observer";
import { SKRadioButtonGroup } from "../skradiobutton";

export class EditPanel extends SKContainer implements Observer {
	buttonGroup: SKRadioButtonGroup;
	textField: SKTextfield;

	constructor(model: Model) {
		super();

		const textFieldWrapper = new SKContainer();

		this.buttonGroup = new SKRadioButtonGroup(colorSchemes);
		this.textField = new SKTextfield();
		this.textField.width = 100;
		this.textField.addEventListener("keypress", () =>
			model.updateChartTitle(this.textField.text)
		);
		textFieldWrapper.addChild(new SKLabel({ text: "Title:" }));
		textFieldWrapper.addChild(this.textField);
		textFieldWrapper.layoutMethod = new Layout.FillRowLayout({ gap: 10 });

		this.fill = "whitesmoke";
		this.border = "black";
		this.padding = 10;

		this.addChild(textFieldWrapper);
		this.addChild(this.buttonGroup);
		this.layoutMethod = new Layout.WrapRowLayout({ gap: 10 });
		this.update(model);
	}

	update(model: Model) {
		const selectedChart = model.getFirstSelected();
		if (!selectedChart) {
			this.buttonGroup.deselect();
			this.textField.text = "";
		} else {
			this.buttonGroup.select(
				colorSchemes.indexOf(selectedChart.colorScheme)
			);
			this.textField.text = selectedChart.title;
		}
	}
}
