import html from "html-template-tag";
import { View } from "../view";

export class TextField extends View {
	private static savedInputs: { [k: number]: View } = {};
	private oldValue: string = "";
	private firstSinceFocus = false;
	private eventListeners: [string, () => void][];

	constructor(
		label: string,
		onChange: (value: string) => void,
		onFirstFocusChange: () => void = () => {},
		numeric = false,
		id = -1
	) {
		super(html`
			<div class="text-field-wrapper">
				<label name=${label.toLowerCase()}>${label}</label>
			</div>
		`);

		const fieldTemplate = html`
			<input
				type="text"
				class="text-field"
				name="${label.toLowerCase()}"
			/>
		`;

		// Restore an input (for the purpose of restoring focus)
		if (id === -1) {
			this.addChild(new View(fieldTemplate));
		} else {
			if (!(id in TextField.savedInputs)) {
				TextField.savedInputs[id] = new View(fieldTemplate);
			}
			this.addChild(TextField.savedInputs[id]);
		}

		this.eventListeners = [
			[
				"input",
				() => {
					if (numeric) {
						this.input.value = this.input.value.replaceAll(
							/[^0-9]/g,
							""
						);
						if (parseInt("0" + this.input.value) > 100) {
							this.input.value = this.oldValue;
						}
					}
					if (this.firstSinceFocus) {
						if (this.input.value !== this.oldValue) {
							onFirstFocusChange();
						}
						this.firstSinceFocus = false;
					}
					this.oldValue = this.input.value;
					onChange(this.input.value);
				},
			],
			[
				"focusout",
				() => {
					this.input.value = parseInt(
						"0" + this.input.value
					).toString();
				},
			],
			["focusin", () => (this.firstSinceFocus = true)],
		];

		this.eventListeners.forEach((cur) => {
			const [type, callback] = cur;
			this.input.addEventListener(type, callback);
		});
	}

	private get input() {
		return this.root.firstElementChild
			?.nextElementSibling as HTMLInputElement;
	}

	removeListeners() {
		this.eventListeners.forEach((cur) => {
			const [type, callback] = cur;
			this.input.removeEventListener(type, callback);
		});
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
