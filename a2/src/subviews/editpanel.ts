import {
	Layout,
	SKContainer,
	SKLabel,
	SKTextfield,
} from "simplekit/imperative-mode";
import { Model } from "../model";
import { colorSchemes } from "../colorscheme";
import type { Observer } from "../observer";
import { SKRadioButtonGroup } from "./skradiobutton";
import { drawRect } from "../draw";

export class EditPanel extends SKContainer implements Observer {
	private buttonGroup: SKRadioButtonGroup;
	private textField: Textfield;
	private disabled: boolean = true;

	constructor(model: Model) {
		super();

		const textFieldWrapper = new SKContainer();

		this.width = 200;
		this.fillHeight = 1;
		this.fill = "whitesmoke";
		this.border = "black";
		this.padding = 10;

		this.buttonGroup = new SKRadioButtonGroup(
			colorSchemes.map((cs) => cs.name),
			(index) => model.updateChartColorScheme(colorSchemes[index])
		);
		this.buttonGroup.height = 135;

		this.textField = new Textfield();
		this.textField.fillWidth = 1;
		this.textField.addEventListener("textchanged", () =>
			model.updateChartTitle(this.textField.text)
		);

		textFieldWrapper.addChild(new SKLabel({ text: "Title:" }));
		textFieldWrapper.addChild(this.textField);
		textFieldWrapper.layoutMethod = new Layout.FillRowLayout({ gap: 10 });
		textFieldWrapper.width = this.width - 2 * this.padding;

		this.addChild(textFieldWrapper);
		this.addChild(this.buttonGroup);
		this.layoutMethod = new Layout.WrapRowLayout({ gap: 10 });
		this.update(model);
		model.addObserver(this);
	}

	draw(gc: CanvasRenderingContext2D): void {
		super.draw(gc);
		if (this.disabled) {
			drawRect(
				gc,
				this.x + 1,
				this.y + 1,
				this.layoutWidth - 2,
				this.layoutHeight - 2,
				"rgba(211,211,211,0.7)",
				false
			);
		}
	}

	update(model: Model): void {
		const selectedChart = model.getFirstSelected();
		if (!selectedChart || model.getSelectCount() !== 1) {
			this.buttonGroup.disable();
			this.textField.text = "";
			this.textField.disable();
			this.disabled = true;
		} else {
			this.buttonGroup.enable();
			this.buttonGroup.select(
				colorSchemes.indexOf(selectedChart.colorScheme)
			);
			this.textField.text = selectedChart.title;
			this.textField.enable();
			this.disabled = false;
		}
	}
}

class Textfield extends SKTextfield {
	private enabled = true;

	disable(): void {
		this.enabled = false;
	}

	enable(): void {
		this.enabled = true;
	}

	hitTest(mx: number, my: number): boolean {
		if (this.enabled) {
			return super.hitTest(mx, my);
		} else {
			return false;
		}
	}
}
