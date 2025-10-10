import { Layout, SKContainer, Style } from "simplekit/imperative-mode";
import type { ChartData, Model } from "../model";
import type { Observer } from "../observer";
import { drawRect } from "../draw";
import { getColor } from "../colorscheme";

export class ChartList extends SKContainer implements Observer {
	constructor(model: Model) {
		super();
		this.layoutMethod = new Layout.WrapRowLayout({ gap: 10 });
		this.padding = 10;
		this.fill = "white";

		this.addEventListener("click", () => model.deselectAllCharts());
		model.addObserver(this);
		this.update(model);
	}

	update(model: Model): void {
		this.clearChildren();
		[...Array(model.getChartCount()).keys()].forEach((i) =>
			this.addChild(
				new ChartIcon(model.getChartData(i), () =>
					model.toggleSelectChart(i)
				)
			)
		);
	}
}

export class ChartIcon extends SKContainer {
	private chartData: ChartData;
	private hovered: boolean = false;

	constructor(chartData: ChartData, onClick: () => void) {
		super();

		this.fill = "white";
		this.width = 60;
		this.height = 44;
		this.padding = 5;
		this.border = "black";
		this.chartData = chartData;

		this.addEventListener("mouseenter", () => (this.hovered = true));
		this.addEventListener("mouseexit", () => (this.hovered = false));
		this.addEventListener("click", () => {
			onClick();
			return true;
		});
	}

	draw(gc: CanvasRenderingContext2D): void {
		const w = this.width || 0,
			h = this.height || 0,
			spacing = 2,
			pad = this.padding,
			hoveredBorder = 4;
		const values = this.chartData.values,
			cnt = values.length;
		const barW = (w - pad * 2 - (cnt - 1) * spacing) / cnt;

		if (this.hovered) {
			drawRect(
				gc,
				this.x - hoveredBorder,
				this.y - hoveredBorder,
				w + hoveredBorder * 2,
				h + hoveredBorder * 2,
				Style.highlightColour,
				false
			);
		}

		super.draw(gc);

		gc.translate(this.x, this.y);

		values.forEach((val, i) => {
			drawRect(
				gc,
				pad + (barW + spacing) * i,
				h - pad,
				barW,
				-((h - pad * 2) / 100) * val,
				getColor(this.chartData.colorScheme, cnt, i),
				false
			);
		});

		if (this.chartData.selected) {
			gc.lineWidth = 3;
			gc.strokeRect(0, 0, w, h);
		}

		gc.translate(-this.x, -this.y);
	}
}
