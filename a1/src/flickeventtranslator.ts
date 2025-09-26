import { SKEvent, SKMouseEvent, type EventTranslator, type FundamentalEvent } from "simplekit/canvas-mode";

let startTime = 0, mouseDown = false, startX = 0, startY = 0;

export const flickEventTranslator: EventTranslator = {
	update(fe: FundamentalEvent): SKEvent | undefined {
		if (fe.type === "mousedown") {
			mouseDown = true;
			startTime = fe.timeStamp;
			startX = fe.x || 0;
			startY = fe.y || 0;
		} else if (fe.type === "mouseup") {
			let x = fe.x || 0, y = fe.y || 0;
			let dist = (x - startX) ** 2 + (y - startY) ** 2;
			dist = dist ** 0.5;
			let dotProduct = (x - startX) / dist;
			if (dist >= 50 && fe.timeStamp - startTime <= 300 && Math.abs(dotProduct) >= Math.cos(Math.PI / 6)) {
				return new SKMouseEvent(dotProduct > 0 ? "flickright" : "flickleft", fe.timeStamp, x, y);
			}
			mouseDown = false;
		}
		return
	}
};