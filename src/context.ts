import { createContext } from "preact";
import type { ChartData } from "./chartdata";
import type { ColorScheme } from "./colorscheme";

export const Context = createContext({} as ContextType);

export type ContextType = {
	charts: ChartData[];
	shift: boolean;
	shiftDown: () => void;
	shiftUp: () => void;
	getSelectCount: () => number;
	getChartCount: () => number;
	getChartData: (index: number) => ChartData;
	getFirstSelected: () => ChartData | null;
	addChart: (index?: number) => void;
	removeSelectedCharts: () => void;
	toggleSelectChart: (index: number) => void;
	selectAllCharts: () => void;
	deselectAllCharts: () => void;
	updateChartTitle: (title: string) => void;
	updateChartColorScheme: (colorScheme: ColorScheme) => void;
	updateChartValue: (index: number, value: number) => void;
	saveState: () => void;
	undo: () => void;
	redo: () => void;
	hasUndo: () => boolean;
	hasRedo: () => boolean;
};
