export type DrawableOptions = {x: number, y: number};

export abstract class Drawable {
	abstract draw(gc: CanvasRenderingContext2D, options: {}): void;
}

export abstract class EventDrawable extends Drawable {
	isHovered(x: number, y: number) { return false; }
	handleClick(): void {}
	handleMouseEnter(): void {}
	handleMouseLeave(): void {}
	handleFocus(): void {}
	handleUnFocus(): void {}
	handleKeyPress(keys: string[]): void {}
	handleFlickLeft(): void {}
	handleFlickRight(): void {}
}