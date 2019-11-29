/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useCallback } from "react";
import { InferenceSession } from "onnxjs";

import useModelReducer, { actions } from "hooks/useModelReducer";

import loadImageToCanvas from "utils/loadImageToCanvas";
import { getPredictedClass } from "utils";
import { getTensorFromCanvasContext } from "./utils";

// const MODEL_URL = "./mobilenetv2-1.0.onnx";
const MODEL_URL = "./squeezenet.onnx";
// const MODEL_URL = "./resnet50.onnx";

const IMAGE_SIZE = 224;
let inferenceSession;

export default function useOnnx({ imageUrl, backend }) {
	const [state, dispatch] = useModelReducer();
	const currentBackend = useRef();

	const loadModel = async () => {
		inferenceSession = await new InferenceSession({
			backendHint: backend
		});
		await inferenceSession.loadModel(MODEL_URL);
		currentBackend.current = backend;
		dispatch({ type: actions.MODEL_LOADED });
	};

	const predict = async () => {
		if (!imageUrl) {
			return;
		}
		const elementId = "input-canvas";
		const { ctx } = await loadImageToCanvas({
			elementId,
			url: imageUrl,
			loaderConfigs: { maxWidth: IMAGE_SIZE, maxHeight: IMAGE_SIZE }
		});
		const onnxTensor = getTensorFromCanvasContext(ctx);
		try {
			const start = new Date();
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
		if (state.status === actions.INIT) {
			loadModel();
			return () => {};
		}
		if (!state.prediction && state.status === actions.MODEL_LOADED) {
			predict();
			return () => {};
		}
		return () => {};
	}, [state.status]);

	useEffect(() => {
		dispatch({ type: actions.RESET });
	}, [imageUrl, backend]);

	const startPrediction = useCallback(() => {
		if (imageUrl && backend) {
			if (backend === currentBackend.current) {
				dispatch({ type: actions.MODEL_LOADED });
			} else {
				dispatch({ type: actions.INIT });
			}
		}
	}, [imageUrl, backend]);

	return { ...state, startPrediction };
}
