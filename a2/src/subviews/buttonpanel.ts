import { SKContainer, Layout, SKButton } from "simplekit/imperative-mode";

export class ButtonPanel extends SKContainer {
	constructor() {
		super();
		const width = 80,
			height = 28;
		const addButton = new SKButton({ text: "Add", width, height }),
			deleteButton = new SKButton({ text: "Delete", width, height }),
			noneButton = new SKButton({ text: "None", width, height }),
			allButton = new SKButton({ text: "All", width, height });
		this.addChild(addButton);
		this.addChild(deleteButton);
		this.addChild(noneButton);
		this.addChild(allButton);
		this.layoutMethod = new Layout.FillRowLayout({ gap: 10 });
		this.padding = 10;
		this.fill = "lightgrey";

		addButton.addEventListener("click", () => {
			console.log("your mom");
		});
	}
}
