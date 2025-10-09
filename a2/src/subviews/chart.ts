import { Layout, SKContainer, SKLabel } from "simplekit/imperative-mode";
import { ChartLayout } from "../layouts/chartlayout";
import type { ChartData, Model } from "../model";
import { drawRect, drawLine, drawText } from "../draw";
import type { Observer } from "../observer";
import { getColor } from "../colorscheme";

export class ChartArea extends SKContainer implements Observer {
	private chart: Chart = new Chart();
	private text: SKLabel = new SKLabel();

	constructor(model: Model) {
		super();
		this.fill = "grey";
		this.update(model);
		model.addObserver(this);
	}

	update(model: Model) {
		const chartData = model.getFirstSelected();
		const selectCount = model.getSelectCount();
		if (selectCount === 1 && chartData) {
			this.clearChildren();
			this.text.text = "";
			this.layoutMethod = new ChartLayout();
			this.chart.setChartData(chartData);
			this.addChild(this.chart);
		} else {
			this.clearChildren();
			this.chart.setChartData(null);
			this.layoutMethod = new Layout.CentredLayout();
			this.text.text =
				selectCount === 0
					? "no chart selected"
					: "more than 1 chart selected";
			this.addChild(this.text);
		}
	}
}

export class Chart extends SKContainer {
	chartData: ChartData | null = null;

	constructor() {
		super();
	}

	setChartData(chartData: ChartData | null) {
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
			tickCnt = 11,
			leftLabelCnt = 6;

		const { title, labels, values, colorScheme } = this.chartData,
			valueCnt = labels.length,
			barW =
				(w - marginRight - margin - barSpace * (valueCnt + 1)) /
				valueCnt;

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

		gc.translate(-this.x, -this.y);
	}
}
