import type { ChartData } from "../chartdata";
import { getColor } from "../colorscheme";
import { Context } from "../context";
import { drawLine, drawRect, drawText } from "../draw";
import { useCallback, useContext, useEffect, useRef } from "preact/hooks";
import styles from "../styles/chart.module.css";

type ChartProps = {
	chartData: ChartData | null;
	style: {};
};

export function ChartArea() {
	const { getFirstSelected, getSelectCount } = useContext(Context);
	const el = useRef<HTMLDivElement>(null);

	const resizer = useCallback(() => {
		const root = el.current;
		if (!root) {
			return;
		}
		const canvas = root.firstElementChild as HTMLCanvasElement;
		const ratio = canvas.width / canvas.height;
		const padding = 20;
		const availableW = root.clientWidth - padding;
		const availableH = root.clientHeight - padding;
		canvas.style.width = `${Math.min(availableW, availableH * ratio)}px`;
		canvas.style.height = `${Math.min(availableH, availableW / ratio)}px`;
	}, []);

	useEffect(() => {
		window.addEventListener("load", resizer);
		window.addEventListener("resize", resizer);
	}, [resizer]);

	const chartData = getFirstSelected();
	const selectCount = getSelectCount();
	const showChart = selectCount === 1 && chartData;

	return (
		<div ref={el} class={styles["chart-area"]}>
			<Chart
				chartData={chartData}
				style={{ display: showChart ? "block" : "none" }}
			/>
			<span
				class={styles["chart-message"]}
				style={{ display: showChart ? "none" : "block" }}
			>
				{selectCount === 0
					? "no chart selected"
					: "more than 1 chart selected"}
			</span>
		</div>
	);
}

function Chart({ chartData, style }: ChartProps) {
	const el = useRef<HTMLCanvasElement>(null);

	const draw = useCallback(() => {
		const gc = el.current?.getContext("2d");

		if (!chartData || !gc || !el.current) {
			return;
		}

		const w = el.current.width,
			h = el.current.height,
			margin = 60,
			marginRight = 30,
			tickSize = 5,
			tickCnt = 11,
			barSpace = 20,
			leftLabelCnt = 6;

		const { title, labels, values, colorScheme } = chartData,
			valueCnt = labels.length,
			barW =
				(w - marginRight - margin - barSpace * (valueCnt + 1)) /
				valueCnt;

		drawRect(gc, 0, 0, w, h, "white", false);

		drawLine(gc, margin, w - marginRight, h - margin, h - margin);
		drawLine(gc, margin, margin, margin, h - margin);

		for (let i = 0; i < tickCnt; i++) {
			let tickY = ((h - margin * 2) / (tickCnt - 1)) * i + margin;
			drawLine(gc, margin - tickSize, margin, tickY, tickY);
		}

		for (let i = 0; i < leftLabelCnt; i++) {
			let labelY = ((h - margin * 2) / (leftLabelCnt - 1)) * i + margin;
			drawText(
				gc,
				margin - tickSize * 2,
				labelY,
				`${100 - i * barSpace}`,
				14,
				"right",
				"middle"
			);
		}

		drawText(gc, w / 2, margin / 2, title, 18, "center", "middle");

		labels.forEach((label, i) => {
			const labelX = margin + (barW + barSpace) * i + barSpace + barW / 2;
			drawText(gc, labelX, h - margin + 10, label, 14, "center", "top");
		});

		values.forEach((value, i) => {
			const barX = margin + (barW + barSpace) * i + barSpace;
			const barH = ((h - margin * 2) / 100) * value;
			const color = getColor(colorScheme, valueCnt, i);
			drawRect(gc, barX, h - margin, barW, -barH, color, true);
		});
	}, [chartData]);

	requestAnimationFrame(draw);

	return (
		<canvas
			ref={el}
			class={styles["chart"]}
			width="400px"
			height="300px"
			style={style}
		></canvas>
	);
}
