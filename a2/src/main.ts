import { setSKRoot, startSimpleKit } from "simplekit/imperative-mode";
import { MainView } from "./mainview";
import { MainLayout } from "./layouts/mainlayout";
import { Model } from "./model";

const model = new Model();
const mainView = new MainView(model);
mainView.layoutMethod = new MainLayout();

setSKRoot(mainView);

startSimpleKit();
