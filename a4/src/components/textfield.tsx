import { useCallback, useEffect, useRef } from "preact/hooks";
import styles from "../styles/textfield.module.css";

export type TextFieldProps = {
	label: string;
	onChange: (value: string) => void;
	onFirstFocusChange: () => void;
	numeric?: boolean;
	disabled?: boolean;
	initialValue?: string;
};

export function TextField({
	label,
	onChange,
	onFirstFocusChange,
	numeric = false,
	disabled = false,
	initialValue = "",
}: TextFieldProps) {
	const oldValue = useRef(""),
		value = useRef(initialValue),
		input = useRef<HTMLInputElement>(null);
	const firstSinceFocus = useRef(false);

	useEffect(() => {
		if (input.current) {
			input.current.value = value.current;
		}
	}, []);

	const onInput = useCallback(
		(ev: Event) => {
			const input = ev.currentTarget as HTMLInputElement;
			if (numeric) {
				input.value = input.value.replaceAll(/[^0-9]/g, "");
				if (parseInt("0" + input.value) > 100) {
					input.value = oldValue.current;
				}
			}
			if (firstSinceFocus.current) {
				if (input.value !== oldValue.current) {
					onFirstFocusChange();
				}
				firstSinceFocus.current = false;
			}
			oldValue.current = input.value;
			onChange(input.value);
		},
		[numeric]
	);

	return (
		<div class={styles["text-field-wrapper"]}>
			<label>{label}</label>
			<input
				ref={input}
				type="text"
				class={styles["text-field"]}
				name={label.toLowerCase()}
				disabled={disabled}
				onInput={onInput}
			/>
		</div>
	);
}
