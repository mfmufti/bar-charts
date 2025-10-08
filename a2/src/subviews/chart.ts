import { SKContainer } from "simplekit/imperative-mode";
import { ChartLayout } from "../layouts/chartlayout";
import type { ChartData, Model } from "../model";
import { drawRect, drawLine, drawText } from "../draw";
import type { Observer } from "../observer";

export class ChartArea extends SKContainer implements Observer {
	private chart: Chart;

	constructor(model: Model) {
		super();
		this.layoutMethod = new ChartLayout();
		this.chart = new Chart();
		this.addChild(this.chart);
		this.update(model);
	}

	update(model: Model) {
		const chartData = model.getFirstSelected();
		console.log("received update");
		if (chartData) {
			this.chart.setChartData(chartData);
		} else {
			// ...
		}
	}
}

export class Chart extends SKContainer {
	chartData?: ChartData;

	constructor() {
		super();
	}

	setChartData(chartData: ChartData) {
		this.chartData = chartData;
	}

	draw(gc: CanvasRenderingContext2D) {
		if (!this.chartData) {
			return;
		}
		this.fill = "white";
		super.draw(gc);

		gc.translate(this.x, this.y);

		const w = this.layoutWidth,
			h = this.layoutHeight,
			margin = 60,
			marginRight = 30,
			tickSize = 5,
			barSpace = 20,
			tickCnt = 11;

		const { title, labels, values } = this.chartData,
			labelCnt = labels.length,
			barW =
				(w - marginRight - margin - barSpace * (labelCnt + 1)) /
				labelCnt;

		drawLine(gc, margin, w - marginRight, h - margin, h - margin);
		drawLine(gc, margin, margin, margin, h - margin);

		for (let i = 0; i < tickCnt; i++) {
			let tickY = ((h - margin * 2) / (tickCnt - 1)) * i + margin;
			drawLine(gc, margin - tickSize, margin, tickY, tickY);
		}

		for (let i = 0; i < labelCnt; i++) {
			let labelY = ((h - margin * 2) / (labelCnt - 1)) * i + margin;
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
			let labelX = margin + (barW + barSpace) * i + barSpace + barW / 2;
			drawText(gc, labelX, h - margin + 10, label, 14, "center", "top");
		});

		values.forEach((value, i) => {
			let barX = margin + (barW + barSpace) * i + barSpace;
			let barH = ((h - margin * 2) / 100) * value;
			drawRect(gc, barX, h - margin, barW, -barH, "red");
		});

		gc.translate(-this.x, -this.y);
	}
}
