import { useCallback, useContext, useMemo } from "preact/hooks";
import { colorSchemes } from "../colorscheme";
import { Options } from "./options";
import { TextField } from "./textfield";
import { Context } from "../context";
import styles from "../styles/editpanel.module.css";

export function EditPanel() {
	const {
		updateChartTitle,
		saveState,
		updateChartColorScheme,
		getFirstSelected,
		getSelectCount,
		updateChartValue,
	} = useContext(Context);

	const onChange = useCallback(
		(value: string) => {
			updateChartTitle(value);
		},
		[updateChartTitle]
	);

	const labels = useMemo(
		() => colorSchemes.map((cs) => cs.name),
		[colorSchemes]
	);
	const onSelect = useCallback(
		(index: number) => updateChartColorScheme(colorSchemes[index]),
		[updateChartColorScheme]
	);

	const selectedChart = getFirstSelected();
	const oneChart = selectedChart && getSelectCount() === 1;

	return (
		<div class={styles["edit-panel"]}>
			<TextField
				key={selectedChart?.id}
				label="Title:"
				onChange={onChange}
				onFirstFocusChange={saveState}
				disabled={!oneChart}
				initialValue={oneChart ? selectedChart.title : ""}
			/>
			<Options
				labels={labels}
				onSelect={onSelect}
				beforeSelect={saveState}
				disabled={!oneChart}
				selectedIndex={
					oneChart
						? colorSchemes.indexOf(selectedChart.colorScheme)
						: 0
				}
			/>
			<div
				class={styles["text-field-wrapper"]}
				style={{ display: oneChart ? "block" : "none" }}
			>
				<label>Values:</label>
			</div>
			<div class="values-wrapper">
				{oneChart
					? selectedChart.labels.map((label, i) => (
							<TextField
								key={selectedChart.id + " " + i}
								label={`${label}: `}
								onChange={(value) => {
									updateChartValue(i, parseInt("0" + value));
								}}
								onFirstFocusChange={saveState}
								initialValue={selectedChart.values[
									i
								].toString()}
								numeric
							/>
					  ))
					: []}
			</div>
		</div>
	);
}
