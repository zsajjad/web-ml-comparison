/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { InferenceSession } from "onnxjs";

import { getTensorFromCanvasContext } from "./utils";
import loadImageToCanvas from "../../utils/loadImageToCanvas";
import { getPredictedClass } from "../../utils";

import useModelReducer, { actions } from "../useModelReducer";

// const MODEL_URL = "./mobilenetv2-1.0.onnx";
const MODEL_URL = "./squeezenet.onnx";
// const MODEL_URL = "./resnet50.onnx";

const inferenceSession = new InferenceSession({ backendHint: "cpu" });
let isModelLoaded = false;

export default function({ imageUrl, width = 224, height = 224 }) {
	const [state, dispatch] = useModelReducer();
	const loadModel = async () => {
		if (!isModelLoaded) {
			await inferenceSession.loadModel(MODEL_URL);
			isModelLoaded = true;
		}
		dispatch({ type: actions.MODEL_LOADED });
	};

	const predict = async ({ url, width, height }) => {
		if (!url) {
			return;
		}
		const elementId = "input-canvas";
		const { ctx } = await loadImageToCanvas({
			elementId,
			url,
			loaderConfigs: { maxWidth: width, maxHeight: height }
		});
		const onnxTensor = getTensorFromCanvasContext(ctx);
		const start = new Date();
		try {
			const outputData = await inferenceSession.run([onnxTensor]);
			const end = new Date();
			const inferenceTime = end.getTime() - start.getTime();
			const output = outputData.values().next().value;
			dispatch({
				type: actions.PREDICTION_COMPLETE,
				payload: {
					prediction: getPredictedClass(output.data),
					inferenceTime
				}
			});
		} catch (e) {
			console.error(e);
			throw new Error();
		}
	};

	useEffect(() => {
		if (state.status === actions.RESET) {
			loadModel();
			return () => {};
		}
		if (!state.prediction && state.status === actions.MODEL_LOADED) {
			predict({ url: imageUrl, width, height });
			return () => {};
		}
		return () => {};
	}, [state.status]);

	useEffect(() => {
		if (imageUrl && state.status !== actions.RESET) {
			dispatch({ type: actions.RESET });
		}
	}, [imageUrl]);

	return state;
}
