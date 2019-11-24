import React, { useState } from "react";
import { IntlProvider } from "react-intl";

// import logo from "./logo.svg";
import "./App.css";

import useTensorflow from "./hooks/useTensorflow";
import useOnnx from "./hooks/useOnnx";
import useWebdnn from "./hooks/useWebdnn";
import ImageSelection from "./components/ImageSelection";

const STAGE = ["tensorflow", "onnx", "webdnn"];
const initialState = {
	selectedImage: null,
	stage: STAGE[0]
};
function App() {
	const [state, setState] = useState(initialState);
	// const tensorflow = useTensorflow({
	// 	imageUrl: state.selectedImage
	// });
	// console.log(tensorflow);
	const onnx = useOnnx({
		imageUrl: state.selectedImage
	});
	console.log(onnx);
	// const webdnn = useWebdnn({
	// 	imageUrl: state.selectedImage
	// });
	// console.log(webdnn);
	return (
		<IntlProvider locale="en">
			<div className="App">
				<div className="backdrop" />
				<header className="App-header">
					<h1>Web ML Comparison</h1>
					<ImageSelection
						selectedUrl={state.selectedImage}
						onSelect={url => setState({ ...initialState, selectedImage: url })}
					/>
				</header>
				<canvas
					id="input-canvas"
					width="224"
					height="224"
					style={{ display: "none" }}
				/>
			</div>
		</IntlProvider>
	);
}

export default App;
