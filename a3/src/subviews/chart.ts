import html from "html-template-tag";
import type { ChartData, Model } from "../model";
import { getColor } from "../colorscheme";
import { View } from "../view";
import { drawLine, drawRect, drawText } from "../draw";

export class ChartArea extends View {
	private chart: Chart;
	private text: View;

	constructor(model: Model) {
		super(html`<div id="chart-area"></div>`);

		this.chart = new Chart();
		this.text = new View(html`<span id="chart-message"></span>`);
		this.addChild(this.chart);
		this.addChild(this.text);
		this.update(model);
		model.addObserver(this);
	}

	update(model: Model): void {
		const chartData = model.getFirstSelected();
		const selectCount = model.getSelectCount();
		if (selectCount === 1 && chartData) {
			this.text.root.style.display = "none";
			this.chart.setChartData(chartData);
			this.chart.root.style.display = "block";
		} else {
			this.chart.root.style.display = "none";
			this.chart.setChartData(null);
			this.text.root.innerText =
				selectCount === 0
					? "no chart selected"
					: "more than 1 chart selected";
			this.text.root.style.display = "block";
		}
	}
}

export class Chart extends View {
	private chartData: ChartData | null = null;

	constructor() {
		super(html`<canvas id="chart" width="400px" height="300px"></canvas> `);

		requestAnimationFrame(() => this.draw(this.root.getContext("2d")));
	}

	get root(): HTMLCanvasElement {
		return this._root as HTMLCanvasElement;
	}

	setChartData(chartData: ChartData | null): void {
		this.chartData = chartData;
		this.draw(this.root.getContext("2d"));
	}

	draw(gc: CanvasRenderingContext2D | null): void {
		if (!this.chartData || !gc) {
			return;
		}

		const w = this.root.width,
			h = this.root.height,
			margin = 60,
			marginRight = 30,
			tickSize = 5,
			tickCnt = 11,
			barSpace = 20,
			leftLabelCnt = 6;

		const { title, labels, values, colorScheme } = this.chartData,
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
	}
}
