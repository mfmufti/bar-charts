import { useCallback } from "preact/hooks";
import styles from "../styles/options.module.css";

export type OptionsProps = {
	labels: string[];
	onSelect: (index: number) => void;
	beforeSelect: () => void;
	disabled?: boolean;
	selectedIndex: number;
};

export function Options({
	labels,
	onSelect,
	beforeSelect,
	disabled = false,
	selectedIndex,
}: OptionsProps) {
	const onChange = useCallback((ev: Event) => {
		const el = ev.currentTarget as HTMLSelectElement;
		if (el.selectedIndex !== selectedIndex) {
			beforeSelect();
			selectedIndex = el.selectedIndex;
		}
		onSelect(selectedIndex);
	}, []);

	return (
		<select
			class={styles["options"]}
			onChange={onChange}
			disabled={disabled}
			value={labels[selectedIndex]}
		>
			{labels.map((label, i) => (
				<option key={i}>{label}</option>
			))}
		</select>
	);
}
