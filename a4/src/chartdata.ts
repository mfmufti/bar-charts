import type { ColorScheme } from "./colorscheme";

export type ChartData = {
	title: string;
	labels: string[];
	values: number[];
	colorScheme: ColorScheme;
	selected: boolean;
	id: number;
};

export type State = {
	charts: ChartData[];
	focusedElement: HTMLElement | null;
};
