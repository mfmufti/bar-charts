import type { EventDrawable } from "./drawable";

export type EventType = "click" | "mousemove" | "focus" | "key" | "flick";

class EventHandler {
	private clickObjs: EventDrawable[] = [];
	private mouseMoveObjs: EventDrawable[] = [];
	private focusObjs: EventDrawable[] = [];
	private keyObjs: EventDrawable[] = [];
	private flickObjs: EventDrawable[] = [];
	private focusedObj: EventDrawable | null = null;
	private hoveredObj: EventDrawable | null = null;
	private downKeys: string[] = [];

	private removeEvent(d: EventDrawable, objs: EventDrawable[]): void {
		let index = objs.indexOf(d);
		if (index != -1) {
			objs.splice(index, 1);
		}
	}

	addEvent(d: EventDrawable, type: EventType) {

	}
	addClickEvent = (d: EventDrawable) => {this.clickObjs.push(d);};
	addMouseMoveEvent = (d: EventDrawable) => {this.mouseMoveObjs.push(d);};
	addFocusEvent = (d: EventDrawable) => {this.focusObjs.push(d);};
	addKeyEvent = (d: EventDrawable) => {this.keyObjs.push(d);};
	addFlickEvent = (d: EventDrawable) => {this.flickObjs.push(d);};

	removeClickEvent = (d: EventDrawable) => this.removeEvent(d, this.clickObjs);
	removeMouseMoveEvent = (d: EventDrawable) => this.removeEvent(d, this.mouseMoveObjs);
	removeFocusEvent = (d: EventDrawable) => this.removeEvent(d, this.focusObjs);
	removeKeyEvent = (d: EventDrawable) => this.removeEvent(d, this.keyObjs);
	
	mouseMoved(x: number, y: number): void {
		if (this.hoveredObj && !this.hoveredObj.isHovered(x, y)) {
			this.hoveredObj.handleMouseLeave();
			this.hoveredObj = null;
		}
		
		if (!this.hoveredObj) {
			for (let obj of this.mouseMoveObjs) {
				if (obj.isHovered(x, y)) {
					this.hoveredObj = obj;
					obj.handleMouseEnter();
					break;
				}
			}
		}
	}

	clicked(x: number, y: number): void {
		for (let obj of this.clickObjs) {
			if (obj.isHovered(x, y)) {
				obj.handleClick();
				break;
			}
		}

		if (this.focusedObj && !this.focusedObj.isHovered(x, y)) {
			this.focusedObj.handleUnFocus();
			this.focusedObj = null;
		}

		if (!this.focusedObj) {
			for (let obj of this.focusObjs) {
				if (obj.isHovered(x, y)) {
					this.focusedObj = obj;
					obj.handleFocus();
					break;
				}
			}
		}
	}

	keyDown(key: string): void {
		if (this.downKeys.indexOf(key) === -1) {
			this.downKeys.push(key);
		}
		this.keyObjs.forEach(obj => obj.handleKeyPress(this.downKeys));
	}

	keyUp(key: string): void {
		this.downKeys = this.downKeys.filter(k => k != key);
	}

	flickedLeft(): void {
		this.flickObjs.forEach(obj => obj.handleFlickLeft());
	}

	flickedRight(): void {
		this.flickObjs.forEach(obj => obj.handleFlickRight());
	}
}

export const eventHandler = new EventHandler();