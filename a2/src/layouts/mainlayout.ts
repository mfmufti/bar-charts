import { type LayoutMethod, SKElement } from "simplekit/imperative-mode";

export class MainLayout implements LayoutMethod {
	constructor() {}

	measure(elements: SKElement[]) {
		elements.forEach((el) => el.measure());
		return {
			width: elements.reduce(
				(acc, cur) => Math.max(acc, cur.intrinsicWidth || 0),
				0
			),
			height: elements.reduce(
				(acc, cur) => acc + (cur.intrinsicHeight || 0),
				0
			),
		};
	}

	layout(width: number, height: number, elements: SKElement[]) {
		const panel1Height = 48,
			panel2Height = 48;
		const heights = [
			height * 0.6,
			panel1Height,
			height * 0.4 - panel1Height - panel2Height,
			panel2Height,
		];
		let y = 0;

		elements.forEach((el, i) => {
			el.x = 0;
			el.y = y;
			y += heights[i];
			el.layout(width, heights[i]);
		});
		return { width, height };
	}
}
