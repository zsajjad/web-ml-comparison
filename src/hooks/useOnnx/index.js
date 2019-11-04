import React, { useEffect, useReducer } from "react";
import { InferenceSession } from "onnxjs";

import { getTensorFromCanvasContext, getPredictedClass } from "./utils";
import loadImageToCanvas from "../../utils/loadImageToCanvas";

// const MODEL_URL = "./mobilenetv2-1.0.onnx";
const MODEL_URL = "./squeezenet1_1.onnx";
const inferenceSession = new InferenceSession({ backendHint: "webgl" });
let isModelLoaded = false;

const actions = {
	RESET: "init",
	MODEL_LOADED: "modelLoaded",
	PREDICTION_COMPLETE: "predicted"
};

const initialState = {
	status: "init",
	prediction: null,
	inferenceTime: 0
};

function stateReducer(state, action) {
	switch (action.type) {
		case actions.RESET:
			return initialState;
		case actions.MODEL_LOADED:
			return {
				...initialState,
				status: actions.MODEL_LOADED
			};
		case actions.PREDICTION_COMPLETE:
			return {
				status: actions.PREDICTION_COMPLETE,
				prediction: action.payload.prediction,
				inferenceTime: action.payload.inferenceTime
			};
		default:
	}
}

export default function({ imageUrl, width = 224, height = 224 }) {
	const [state, dispatch] = useReducer(stateReducer, initialState);

	const loadModel = async () => {
		if (!isModelLoaded) {
			await inferenceSession.loadModel(MODEL_URL);
			isModelLoaded = true;
		}
		dispatch({ type: actions.MODEL_LOADED });
	};

	const predict = async ({ url, width, height }) => {
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
		if (state !== "init") {
			dispatch({ type: actions.RESET });
		}
	}, [imageUrl]);

	return state;
}
