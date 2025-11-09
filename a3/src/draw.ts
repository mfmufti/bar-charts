export function drawRect(
	gc: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	color: string,
	border: boolean
): void {
	gc.fillStyle = color;
	gc.fillRect(x, y, w, h);

	if (border) {
		gc.strokeStyle = "black";
		gc.lineWidth = 1;
		gc.strokeRect(x, y, w, h);
	}
}

export function drawText(
	gc: CanvasRenderingContext2D,
	x: number,
	y: number,
	text: string,
	size: number,
	alignX: "center" | "left" | "right",
	alignY: "middle" | "top" | "bottom"
): void {
	gc.font = size + "px sans-serif";
	gc.textAlign = alignX;
	gc.textBaseline = alignY;
	gc.fillStyle = "black";
	gc.fillText(text, x, y);
}

export function drawLine(
	gc: CanvasRenderingContext2D,
	x1: number,
	x2: number,
	y1: number,
	y2: number
): void {
	gc.strokeStyle = "black";
	gc.lineWidth = 1;
	gc.beginPath();
	gc.moveTo(x1, y1);
	gc.lineTo(x2, y2);
	gc.stroke();
}

export function drawCircle(
	gc: CanvasRenderingContext2D,
	x: number,
	y: number,
	r: number,
	color: string,
	border: boolean
): void {
	gc.beginPath();
	gc.fillStyle = color;
	gc.arc(x, y, r, 0, Math.PI * 2);
	gc.closePath();
	gc.fill();

	if (border) {
		gc.strokeStyle = "black";
		gc.lineWidth = 1;
		gc.stroke();
	}
}
