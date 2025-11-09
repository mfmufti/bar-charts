import html from "html-template-tag";
import type { ChartData, Model } from "../model";
import { getColor } from "../colorscheme";
import { View } from "../view";
import { drawRect } from "../draw";

export class ChartList extends View {
	constructor(model: Model) {
		super(html`<div id="chart-list"></div>`);

		this.addEventListener("click", () => model.deselectAllCharts());
		model.addObserver(this);
		this.update(model);
	}

	update(model: Model): void {
		this.root.innerHTML = "";
		[...Array(model.getChartCount()).keys()].forEach((i) =>
			this.addChild(
				new ChartIcon(model.getChartData(i), () =>
					model.toggleSelectChart(i)
				)
			)
		);
	}
}

export class ChartIcon extends View {
	private chartData: ChartData;
	// private hovered: boolean = false;

	constructor(chartData: ChartData, onClick: () => void) {
		super(html`
			<div class="chart-icon-wrapper">
				<canvas class="chart-icon" width="60px" height="44px"></canvas>
				<div class="chart-icon-hovered"></div>
				<div class="chart-icon-selected"></div>
			</div>
		`);

		this.chartData = chartData;
		this.canvas.addEventListener("mousedown", (ev) => {
			onClick();
			ev.stopPropagation();
		});
		if (this.chartData.selected) {
			this._root.classList.add("selected");
		}
		requestAnimationFrame(() => this.draw(this.canvas.getContext("2d")));
	}

	private get canvas() {
		return this.root.firstElementChild as HTMLCanvasElement;
	}

	draw(gc: CanvasRenderingContext2D | null): void {
		if (!gc) {
			return;
		}

		const w = this.canvas.width || 0,
			h = this.canvas.height || 0,
			spacing = 2;
		const values = this.chartData.values,
			cnt = values.length;
		const barW = (w - (cnt - 1) * spacing) / cnt;

		values.forEach((val, i) => {
			drawRect(
				gc,
				(barW + spacing) * i,
				h,
				barW,
				-(h / 100) * val,
				getColor(this.chartData.colorScheme, cnt, i),
				false
			);
		});
	}
}
