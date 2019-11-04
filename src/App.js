import React from "react";
// import logo from "./logo.svg";
import "./App.css";
import useTensorflow from "./hooks/useTensorflow";
import useOnnx from "./hooks/useOnnx";
import useWebdnn from "./hooks/useWebdnn";

const imageUrl =
	"https://farm2.staticflickr.com/1533/26541536141_41abe98db3_z_d.jpg";

function App() {
	// const tensorflow = useTensorflow({
	// 	imageUrl
	// });
	// console.log(tensorflow);
	// const onnx = useOnnx({
	// 	imageUrl
	// });
	// console.log(onnx);
	const webdnn = useWebdnn({
		imageUrl
	});
	console.log(webdnn);
	return (
		<div className="App">
			<header className="App-header">
				<img src={imageUrl} />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
			<canvas
				id="input-canvas"
				width="224"
				height="224"
				style={{ display: "none" }}
			/>
		</div>
	);
}

export default App;
