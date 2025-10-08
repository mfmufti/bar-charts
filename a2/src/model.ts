import { getDataset } from "./datasets";
import { Subject } from "./observer";

export const colorSchemes = ["rainbow", "hot", "cool", "earthy"];
export type ColorScheme = "rainbow" | "hot" | "cool" | "earthy";

export type ChartData = {
	title: string;
	labels: string[];
	values: number[];
	colorScheme: ColorScheme;
	selected: boolean;
};

export class Model extends Subject {
	private charts: ChartData[] = [];

	constructor() {
		super();
		[...Array(8).keys()].forEach((i) => this.addChart(i));
	}

	getSelectCount() {
		return this.charts.filter((chartData) => chartData.selected).length;
	}

	getChartCount() {
		return this.charts.length;
	}

	getChartData(index: number) {
		const { title, labels, values, colorScheme, selected } =
			this.charts[index];
		return {
			title,
			labels: [...labels],
			values: [...values],
			colorScheme,
			selected,
		};
	}

	addChart(index?: number) {
		const dataset = index === undefined ? getDataset() : getDataset(index);
		this.charts.push({
			...dataset,
			colorScheme: "rainbow",
			selected: true,
		});
		this.updateObservers();
	}

	removeSelectedCharts() {
		this.charts = this.charts.filter((chartData) => !chartData.selected);
		this.updateObservers();
	}

	toggleSelectChart(index: number) {
		this.charts[index].selected = !this.charts[index].selected;
		this.updateObservers();
	}

	selectAllCharts() {
		this.charts.forEach((chartData) => (chartData.selected = true));
		this.updateObservers();
	}

	deselectAllChart() {
		this.charts.forEach((chartData) => (chartData.selected = false));
		this.updateObservers();
	}

	updateChartTitle(title: string) {
		const chart = this.getFirstSelected();
		if (chart) {
			chart.title = title;
		}
		this.updateObservers();
	}

	updateChartColorScheme(colorScheme: ColorScheme) {
		const chart = this.getFirstSelected();
		if (chart) {
			chart.colorScheme = colorScheme;
		}
		this.updateObservers();
	}

	getFirstSelected() {
		return this.charts.find((chartData) => chartData.selected) || null;
	}
}
