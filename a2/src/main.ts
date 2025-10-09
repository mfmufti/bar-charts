import {
	setSKEventListener,
	setSKRoot,
	startSimpleKit,
} from "simplekit/imperative-mode";
import { MainView } from "./mainview";
import { MainLayout } from "./layouts/mainlayout";
import { Model } from "./model";

const model = new Model();
const mainView = new MainView(model);
mainView.layoutMethod = new MainLayout();

setSKEventListener((ev) => {
	if (ev.type === "keydown") {
		if ((ev as KeyboardEvent).key === "Shift") {
			model.shiftDown();
		}
	} else if (ev.type === "keyup") {
		if ((ev as KeyboardEvent).key === "Shift") {
			model.shiftUp();
		}
	}
});

setSKRoot(mainView);
startSimpleKit();
