import { MainView } from "./mainview";
import { Model } from "./model";

const model = new Model();
const mainView = new MainView(model);

document.addEventListener("keydown", (ev) => {
	if (ev.key === "Shift") {
		model.shiftDown();
	}
});

document.addEventListener("keyup", (ev) => {
	if (ev.key === "Shift") {
		model.shiftUp();
	}
});

document.getElementById("app")?.appendChild(mainView.root);
