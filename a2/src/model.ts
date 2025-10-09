import { colorSchemes, type ColorScheme } from "./colorscheme";
import { getDataset } from "./datasets";
import { Subject } from "./observer";

export type ChartData = {
	title: string;
	labels: string[];
	values: number[];
	colorScheme: ColorScheme;
	selected: boolean;
};

export class Model extends Subject {
	private charts: ChartData[] = [];
	private shift = false;

	private cloneChart(chartData: ChartData): ChartData {
		const { title, labels, values, colorScheme, selected } = chartData;
		return {
			title,
			labels: [...labels],
			values: [...values],
			colorScheme,
			selected,
		};
	}

	constructor() {
		super();
		[...Array(8).keys()].forEach((i) => this.addChart(i));
	}

	shiftDown() {
		this.shift = true;
		this.updateObservers();
	}

	shiftUp() {
		this.shift = false;
		this.updateObservers();
	}

	isShiftDown() {
		return this.shift;
	}

	getSelectCount(): number {
		return this.charts.filter((chartData) => chartData.selected).length;
	}

	getChartCount(): number {
		return this.charts.length;
	}

	getChartData(index: number): ChartData {
		return this.cloneChart(this.charts[index]);
	}

	addChart(index?: number): void {
		if (this.charts.length === 20) {
			return;
		}
		const dataset = index === undefined ? getDataset() : getDataset(index);
		this.charts.push({
			...dataset,
			colorScheme: colorSchemes[0],
			selected: false,
		});
		this.updateObservers();
	}

	removeSelectedCharts(): void {
		this.charts = this.charts.filter((chartData) => !chartData.selected);
		this.updateObservers();
	}

	toggleSelectChart(index: number): void {
		if (this.shift) {
			this.charts[index].selected = !this.charts[index].selected;
		} else {
			const selected = this.charts[index].selected;
			this.deselectAllCharts();
			this.charts[index].selected = !selected;
		}
		this.updateObservers();
	}

	selectAllCharts(): void {
		this.charts.forEach((chartData) => (chartData.selected = true));
		this.updateObservers();
	}

	deselectAllCharts(): void {
		this.charts.forEach((chartData) => (chartData.selected = false));
		this.updateObservers();
	}

	updateChartTitle(title: string): void {
		this.charts.some((chartData) => {
			if (chartData.selected) {
				chartData.title = title;
				return true;
			}
		});
		this.updateObservers();
	}

	updateChartColorScheme(colorScheme: ColorScheme): void {
		this.charts.some((chartData) => {
			if (chartData.selected) {
				chartData.colorScheme = colorScheme;
				return true;
			}
		});
		this.updateObservers();
	}

	getFirstSelected(): ChartData | null {
		const chart = this.charts.find((chartData) => chartData.selected);
		return chart ? this.cloneChart(chart) : null;
	}
}
