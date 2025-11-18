import { ButtonPanel } from "./buttonpanel";
import { StatusBar } from "./statusbar";
import { ChartList } from "./chartlist";
import { EditPanel } from "./editpanel";
import { ChartArea } from "./chart";
import { Provider } from "./provider";
import styles from "../styles/app.module.css";

export function App() {
	return (
		<Provider>
			<div class={styles["main-view"]}>
				<div class={styles["top-wrapper"]}>
					<ChartArea />
					<EditPanel />
				</div>
				<div class={styles["bottom-wrapper"]}>
					<ButtonPanel />
					<ChartList />
					<StatusBar />
				</div>
			</div>
		</Provider>
	);
}
