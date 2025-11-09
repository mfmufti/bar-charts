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

type State = {
	charts: ChartData[];
	focusedElement: HTMLElement | null;
};

function randomInt(a: number, b: number): number {
	return Math.floor(Math.random() * (b - a * 1) + a);
}

export class Model extends Subject {
	private charts: ChartData[] = [];
	private shift = false;
	private undoStates: State[] = [];
	private redoStates: State[] = [];
	private focusedElement: HTMLElement | null = null;

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

	private cloneCharts(charts: ChartData[]): ChartData[] {
		return charts.map((chartData) => this.cloneChart(chartData));
	}

	constructor() {
		super();
		[...Array(8).keys()].forEach((i) => this.addChart(i));
	}

	private getState(newState: boolean): State {
		return {
			charts: this.cloneCharts(this.charts),
			focusedElement: (newState
				? document.activeElement
				: this.focusedElement) as HTMLElement | null,
		};
	}

	private restoreState(state: State): void {
		this.charts = state.charts;
		this.focusedElement = state.focusedElement;
		this.updateObservers();
		if (state.focusedElement) {
			state.focusedElement.focus();
		}
	}

	saveState(): void {
		this.undoStates.push(this.getState(true));
		this.redoStates = [];
		this.updateObservers();
	}

	undo(): void {
		const state = this.undoStates.pop();
		if (!state) {
			return;
		}
		this.redoStates.push(this.getState(false));
		this.restoreState(state);
	}

	redo(): void {
		const state = this.redoStates.pop();
		if (!state) {
			return;
		}
		this.undoStates.push(this.getState(false));
		this.restoreState(state);
	}

	hasUndo(): boolean {
		return this.undoStates.length !== 0;
	}

	hasRedo(): boolean {
		return this.redoStates.length !== 0;
	}

	shiftDown(): void {
		this.shift = true;
		this.updateObservers();
	}

	shiftUp(): void {
		this.shift = false;
		this.updateObservers();
	}

	isShiftDown(): boolean {
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
		const colorScheme =
			colorSchemes[
				index === undefined ? randomInt(0, colorSchemes.length) : 0
			];
		this.charts.push({
			...dataset,
			colorScheme,
			selected: false,
		});
		this.updateObservers();
	}

	removeSelectedCharts(): void {
		this.charts = this.charts.filter((chartData) => !chartData.selected);
		this.updateObservers();
	}

	toggleSelectChart(index: number): void {
		const selected = this.charts[index].selected;
		if (this.shift) {
			this.charts[index].selected = !selected;
		} else {
			const selectCount = this.getSelectCount();
			this.deselectAllCharts();
			if (selectCount !== 1 && selected) {
				this.charts[index].selected = true;
			} else {
				this.charts[index].selected = !selected;
			}
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

	updateChartValue(index: number, value: number): void {
		this.charts.some((chartData) => {
			if (chartData.selected) {
				chartData.values[index] = value;
				return true;
			}
		});
		this.updateObservers();
	}
}
