import { useContext } from "preact/hooks";
import { Context } from "../context";
import styles from "../styles/statusbar.module.css";

export function StatusBar() {
	const { getChartCount, getSelectCount, shift } = useContext(Context);
	const chartCount = getChartCount();
	const selectCount = getSelectCount();
	return (
		<div class={styles["status-bar"]}>
			<span class="status-bar-left">
				{`${chartCount || "no"} chart` +
					(chartCount === 1 ? "" : "s") +
					(selectCount === 0 ? "" : ` (${selectCount} selected)`)}
			</span>
			<span class={styles["status-bar-right"]}>
				{shift ? "SHIFT" : ""}
			</span>
		</div>
	);
}
