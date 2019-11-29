import React, { useState } from "react";
import { IntlProvider } from "react-intl";

// import logo from "./logo.svg";
import "./App.css";

// import useTensorflow from "./hooks/useTensorflow";
// import useOnnx from "./hooks/useOnnx";
// import useWebdnn from "./hooks/useWebdnn";
import ImageSelection from "components/ImageSelection";
import BackendSelection from "components/BackendSelection";
import OnnxPredictor from "predictors/Onnx";
import TensorflowPredictor from "predictors/Tensorflow";
import WebdnnPredictor from "predictors/Webdnn";

const STAGE = ["tensorflow", "onnx", "webdnn"];
const initialState = {
	selectedImage:
		"https://farm4.staticflickr.com/3827/11349066413_99c32dee4a_z_d.jpg",
	selectedBackend: "cpu",
	isPredicting: false
};

function App() {
	const [state, set] = useState(initialState);
	const setState = nextState => set({ ...state, ...nextState });
	const predictorProps = {
		selectedBackend: state.selectedBackend,
		imageUrl: state.selectedImage,
		isPredicting: state.isPredicting,
		onPredictionStatusChange: status => {
			if (status === "predicted") {
				setState({ isPredicting: true });
			} else {
				setState({ isPredicting: false });
			}
		}
	};
	return (
		<IntlProvider locale="en">
			<div className="App">
				<div className="backdrop" />
				<div className="content">
					<h1>Web ML Comparison</h1>
					<ImageSelection
						selectedUrl={state.selectedImage}
						onSelect={url => setState({ selectedImage: url })}
					/>
					<BackendSelection
						selected={state.selectedBackend}
						onSelect={selectedBackend => setState({ selectedBackend })}
					/>
					<div className="predictions-container">
						<TensorflowPredictor {...predictorProps} />
						<OnnxPredictor {...predictorProps} />
						<WebdnnPredictor {...predictorProps} />
					</div>
				</div>
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
