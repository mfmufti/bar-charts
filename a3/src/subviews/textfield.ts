import html from "html-template-tag";
import { View } from "../view";

export class TextField extends View {
	private oldValue: string = "";

	constructor(
		label: string,
		onChange: (value: string) => void,
		numeric = false
	) {
		super(html`
			<div class="text-field-wrapper">
				<label>${label}</label>
				<input type="text" class="text-field" />
			</div>
		`);

		this.input.addEventListener("input", () => {
			if (numeric) {
				this.input.value = this.input.value.replaceAll(/[^0-9]/g, "");
				if (parseInt("0" + this.input.value) > 100) {
					this.input.value = this.oldValue;
				}
				this.oldValue = this.input.value;
			}
			onChange(this.input.value);
		});
		if (numeric) {
			this.input.addEventListener("focusout", () => {
				this.input.value = parseInt("0" + this.input.value).toString();
			});
		}
	}

	private get input() {
		return this.root.firstElementChild
			?.nextElementSibling as HTMLInputElement;
	}

	get value() {
		return this.input.value;
	}

	set value(newValue: string) {
		this.input.value = newValue;
		this.oldValue = newValue;
	}

	disable(): void {
		this.input.disabled = true;
	}

	enable(): void {
		this.input.disabled = false;
	}
}
