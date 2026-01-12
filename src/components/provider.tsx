import { type ComponentChildren } from "preact";
import { colorSchemes, type ColorScheme } from "../colorscheme";
import { getDataset } from "../datasets";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "preact/hooks";
import type { ChartData } from "../chartdata";
import { Context } from "../context";

type SaveState = {
	charts: ChartData[];
	focusedElement: HTMLElement | null;
};

function randomInt(a: number, b: number): number {
	return Math.floor(Math.random() * (b - a * 1) + a);
}

export function Provider({ children }: { children: ComponentChildren }) {
	const [state, setState] = useState({
		charts: [] as ChartData[],
		shift: false,
	});
	const charts = state.charts,
		shift = state.shift;
	const setCharts = (transform: (charts: ChartData[]) => ChartData[]) =>
		setState((state) => ({ ...state, charts: transform(state.charts) }));
	const setShift = (shift: boolean) =>
		setState((state) => ({ ...state, shift }));

	const undoStates = useRef([] as SaveState[]);
	const redoStates = useRef([] as SaveState[]);
	const curState = useRef(null as SaveState | null);
	const chartId = useRef(0);

	const shiftDown = useCallback(() => setShift(true), [setShift]);
	const shiftUp = useCallback(() => setShift(false), [setShift]);
	const getSelectCount = useCallback(
		() => charts.filter((chartData) => chartData.selected).length,
		[charts]
	);
	const getChartCount = useCallback(() => charts.length, [charts]);
	const getChartData = useCallback((index: number) => charts[index], charts);
	const getFirstSelected = useCallback(
		() => charts.find((chartData) => chartData.selected) || null,
		charts
	);

	const addChart = useCallback(
		(index?: number) => {
			if (charts.length === 20) {
				return;
			}
			const dataset =
				index === undefined ? getDataset() : getDataset(index);
			const colorScheme =
				colorSchemes[
					index === undefined ? randomInt(0, colorSchemes.length) : 0
				];
			setCharts((charts) => [
				...charts,
				{
					...dataset,
					colorScheme,
					selected: false,
					id: chartId.current++,
				},
			]);
		},
		[charts, setCharts]
	);

	const removeSelectedCharts = useCallback(
		() =>
			setCharts((charts) =>
				charts.filter((chartData) => !chartData.selected)
			),
		[charts, setCharts]
	);

	const toggleSelectChart = useCallback(
		(index: number) => {
			setState((state) => {
				const selected = charts[index].selected;
				if (state.shift) {
					return {
						...state,
						charts: state.charts.map((chartData, i) =>
							i === index
								? {
										...chartData,
										selected: !chartData.selected,
								  }
								: chartData
						),
					};
				} else {
					const setTrue = getSelectCount() !== 1 && selected;
					return {
						...state,
						charts: state.charts.map((chartData, i) =>
							i === index
								? {
										...chartData,
										selected: setTrue
											? true
											: !chartData.selected,
								  }
								: { ...chartData, selected: false }
						),
					};
				}
			});
		},
		[setState, charts, getSelectCount]
	);

	const selectAllCharts = useCallback(
		() =>
			setCharts((charts) =>
				charts.map((chartData) => ({ ...chartData, selected: true }))
			),
		[setCharts, charts]
	);
	const deselectAllCharts = useCallback(
		() =>
			setCharts((charts) =>
				charts.map((chartData) => ({ ...chartData, selected: false }))
			),
		[setCharts, charts]
	);

	const updateChartTitle = useCallback(
		(title: string) => {
			setCharts((charts) =>
				charts.map((chartData) =>
					chartData.selected ? { ...chartData, title } : chartData
				)
			);
		},
		[setCharts, charts]
	);

	const updateChartColorScheme = useCallback(
		(colorScheme: ColorScheme) => {
			setCharts((charts) =>
				charts.map((chartData) =>
					chartData.selected
						? { ...chartData, colorScheme }
						: chartData
				)
			);
		},
		[setCharts, charts]
	);

	const updateChartValue = useCallback(
		(index: number, value: number) => {
			setCharts((charts) =>
				charts.map((chartData) =>
					chartData.selected
						? {
								...chartData,
								values: chartData.values.map((val, i) =>
									i === index ? value : val
								),
						  }
						: chartData
				)
			);
		},
		[setCharts, charts]
	);

	const getState = useCallback(
		(newState: boolean) => {
			return newState || !curState.current
				? {
						charts: structuredClone(charts),
						focusedElement:
							document.activeElement as HTMLElement | null,
				  }
				: curState.current;
		},
		[charts]
	);

	const restoreState = useCallback(
		(state: SaveState) => {
			setCharts((_) => state.charts);
			curState.current = state;
			if (state.focusedElement) {
				state.focusedElement.focus();
			}
		},
		[setCharts]
	);

	const saveState = useCallback(() => {
		undoStates.current.push(getState(true));
		redoStates.current = [];
	}, [getState]);

	const undo = useCallback(() => {
		const state = undoStates.current.pop();
		if (!state) {
			return;
		}
		redoStates.current.push(getState(false));
		restoreState(state);
	}, [getState, restoreState]);

	const redo = useCallback(() => {
		const state = redoStates.current.pop();
		if (!state) {
			return;
		}
		undoStates.current.push(getState(false));
		restoreState(state);
	}, [getState, restoreState]);

	const hasUndo = useCallback(() => undoStates.current.length !== 0, []);
	const hasRedo = useCallback(() => redoStates.current.length !== 0, []);

	useEffect(() => {
		document.addEventListener("keydown", (ev) => {
			if (ev.key === "Shift") {
				shiftDown();
			}
		});

		document.addEventListener("keyup", (ev) => {
			if (ev.key === "Shift") {
				shiftUp();
			}
		});

		[...Array(8).keys()].forEach((i) => addChart(i));
	}, []);

	const actions = {
		charts,
		shift,
		shiftDown,
		shiftUp,
		getSelectCount,
		getChartCount,
		getChartData,
		getFirstSelected,
		addChart,
		removeSelectedCharts,
		toggleSelectChart,
		selectAllCharts,
		deselectAllCharts,
		updateChartTitle,
		updateChartColorScheme,
		updateChartValue,
		saveState,
		undo,
		redo,
		hasUndo,
		hasRedo,
	};

	const value = useMemo(() => actions, Object.values(actions));

	return <Context value={value}>{children}</Context>;
}
