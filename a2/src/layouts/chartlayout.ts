import { type LayoutMethod, SKElement } from "simplekit/imperative-mode";

const minPadding = 10;
const ratio = 4 / 3;

export class ChartLayout implements LayoutMethod {
	constructor() {}

	measure(elements: SKElement[]) {
		elements.forEach((el) => el.measure());
		return {
			width: elements[0].intrinsicWidth + minPadding * 2,
			height: elements[0].intrinsicWidth + minPadding * 2,
		};
	}

	layout(width: number, height: number, elements: SKElement[]) {
		let chartWidth = Math.max(width - minPadding * 2, 0);
		let chartHeight = Math.max(height - minPadding * 2, 0);
		chartWidth = Math.min(chartWidth, chartHeight * ratio);
		chartHeight = Math.min(chartHeight, chartWidth / ratio);

		const chart = elements[0];
		chart.x = (width - chartWidth) / 2;
		chart.y = (height - chartHeight) / 2;
		chart.layout(chartWidth, chartHeight);

		return { width, height };
	}
}
