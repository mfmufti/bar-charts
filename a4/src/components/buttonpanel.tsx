import { useCallback, useContext } from "preact/hooks";
import { Context } from "../context";
import styles from "../styles/buttonpanel.module.css";

export function ButtonPanel() {
	const {
		saveState,
		addChart,
		removeSelectedCharts,
		deselectAllCharts,
		selectAllCharts,
		undo,
		redo,
		getSelectCount,
		getChartCount,
		hasUndo,
		hasRedo,
	} = useContext(Context);

	const onAdd = useCallback(() => {
		saveState();
		addChart();
	}, [saveState, addChart]);

	const onDelete = useCallback(() => {
		saveState();
		removeSelectedCharts();
	}, [saveState, addChart]);

	const selectCount = getSelectCount();
	const chartCount = getChartCount();

	return (
		<div class={styles["button-panel"]}>
			<button
				class={styles["button"]}
				onClick={onAdd}
				disabled={chartCount === 20}
			>
				Add
			</button>
			<button
				class={styles["button"]}
				onClick={onDelete}
				disabled={selectCount === 0}
			>
				Delete
			</button>
			<button
				class={styles["button"]}
				onClick={deselectAllCharts}
				disabled={selectCount === 0}
			>
				None
			</button>
			<button
				class={styles["button"]}
				onClick={selectAllCharts}
				disabled={selectCount === chartCount}
			>
				All
			</button>
			<div class={styles["right-buttons"]}>
				<button
					class={styles["button"]}
					onClick={undo}
					disabled={!hasUndo()}
				>
					Undo
				</button>
				<button
					class={styles["button"]}
					onClick={redo}
					disabled={!hasRedo()}
				>
					Redo
				</button>
			</div>
		</div>
	);
}
