import { Drawable } from "./drawable";

export type RectOptions = {x: number, y: number, w: number, h: number, color: string, border?: boolean};
export type LineOptions = {x1: number, y1: number, x2: number, y2: number};
export type CircleOptions = {
	x: number, y: number, r: number, color?: string, border?: boolean,
	fill?: boolean, borderWidth?: number, borderColor?: string
};
export type TextOptions = {
	x: number, y: number, size: number, text: string, color?: string,
	alignX?: "center" | "left" | "right", alignY?: "middle" | "top" | "bottom"
};

export class Rect extends Drawable {
	draw(gc: CanvasRenderingContext2D, {x, y, w, h, color, border = false}: RectOptions) {
		gc.fillStyle = color;
		gc.fillRect(x, y, w, h);
		if (border) {
			gc.strokeStyle = "black";
			gc.strokeRect(x, y, w, h);
		}
	}
}

export class Line extends Drawable {
	draw(gc: CanvasRenderingContext2D, {x1, y1, x2, y2}: LineOptions) {
		gc.strokeStyle = "black";
		gc.lineWidth = 1;
		gc.beginPath();
		gc.moveTo(x1, y1);
		gc.lineTo(x2, y2);
		gc.stroke();
	}
}

export class Circle extends Drawable {
	draw(gc: CanvasRenderingContext2D, {x, y, r, color = "white", border = false, fill = true, borderWidth = 2, borderColor = "black"}: CircleOptions) {
		gc.beginPath();
		gc.arc(x, y, r, 0, Math.PI * 2);
		gc.closePath();
		if (fill) {
			gc.fillStyle = color;
			gc.fill();
		}
		if (border) {
			gc.strokeStyle = borderColor;
			gc.lineWidth = borderWidth;
			gc.stroke();
		}
	}
}

export class Text extends Drawable {
	draw(gc: CanvasRenderingContext2D, {x, y, size, text, alignX = "center", alignY = "middle", color = "black"}: TextOptions) {
		gc.font = size + "px sans-serif";
		gc.textAlign = alignX;
		gc.textBaseline = alignY;
		gc.fillStyle = color;
		gc.fillText(text, x, y);
	}
}