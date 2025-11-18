import { App } from "./components/app";
import { render } from "preact";
import "./styles/main.css";

const el = document.getElementById("app");
if (el) {
	render(<App />, el);
}
