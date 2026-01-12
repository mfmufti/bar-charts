import { getColor } from "../colorscheme";
import { drawRect } from "../draw";
import { Context } from "../context";
import { useCallback, useContext, useRef } from "preact/hooks";
import type { ChartData } from "../chartdata";
import styles from "../styles/chartlist.module.css";

type ChartIconProps = {
	chartData: ChartData;
	onClick: () => void;
};

export function ChartList() {
	const {
		deselectAllCharts,
		getChartCount,
		getChartData,
		toggleSelectChart,
	} = useContext(Context);

	return (
		<div class={styles["chart-list"]} onMouseDown={deselectAllCharts}>
			{[...Array(getChartCount()).keys()].map((i) => (
				<ChartIcon
					chartData={getChartData(i)}
					onClick={() => toggleSelectChart(i)}
				></ChartIcon>
			))}
		</div>
	);
}

function ChartIcon({ chartData, onClick }: ChartIconProps) {
	const canvas = useRef<HTMLCanvasElement>(null);

	const draw = useCallback(() => {
		const gc = canvas.current?.getContext("2d");

		if (!gc || !canvas.current) {
			return;
		}

		const w = canvas.current.width || 0,
			h = canvas.current.height || 0,
			spacing = 2,
			values = chartData.values,
			cnt = values.length,
			barW = (w - (cnt - 1) * spacing) / cnt;

		values.forEach((val, i) => {
			drawRect(
				gc,
				(barW + spacing) * i,
				h,
				barW,
				-(h / 100) * val,
				getColor(chartData.colorScheme, cnt, i),
				false
			);
		});
	}, [chartData]);

	const onMouseDown = useCallback(
		(ev: Event) => {
			console.log("performed ze click");
			onClick();
			ev.stopPropagation();
		},
		[onClick]
	);

	requestAnimationFrame(draw);

	return (
		<div
			class={
				styles["chart-icon-wrapper"] +
				(chartData.selected ? " " + styles["selected"] : "")
			}
		>
			<canvas
				ref={canvas}
				class={styles["chart-icon"]}
				width="60px"
				height="44px"
				onMouseDown={onMouseDown}
			></canvas>
		</div>
	);
}
