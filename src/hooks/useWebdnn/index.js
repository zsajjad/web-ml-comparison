import React, { useEffect, useReducer } from "react";
import * as WebDNN from "webdnn";
import useModelReducer, { actions } from "../useModelReducer";

import loadImageToCanvas from "../../utils/loadImageToCanvas";

let runner;
const MODEL_URL = "./squeezenet1_1.onnx";

export default function useWebdnn({ imageUrl, width = 224, height = 224 }) {
	const [state, dispatch] = useModelReducer();

	const loadModel = async () => {
		if (!runner) {
			runner = await WebDNN.load(MODEL_URL);
		}
		dispatch({ type: actions.MODEL_LOADED });
	};

	const predict = async ({ url, width, height }) => {
		dispatch({
			type: actions.PREDICTION_START
		});
		const elementId = "input-canvas";
		const { canvas } = await loadImageToCanvas({
			elementId,
			url,
			loaderConfigs: { maxWidth: width, maxHeight: height }
		});

		const imageArray = await WebDNN.Image.getImageArray(canvas, {
			dstW: 223,
			dstH: 223,
			order: WebDNN.Image.Order.HWC,
			color: WebDNN.Image.Color.BGR,
			bias: [122.679, 116.669, 104.006] // RGB mean (not BGR)
		});
		const start = new Date();
		runner.inputs[0].set(imageArray);
		await runner.run();
		const end = new Date();

		const output = runner.outputs[0].toActual();
		const prediction = WebDNN.Math.argmax(output, 5);
		dispatch({
			type: actions.PREDICTION_COMPLETE,
			payload: {
				prediction,
				inferenceTime: end.getTime() - start.getTime()
			}
		});
	};

	useEffect(() => {
		if (state.status === actions.RESET) {
			loadModel();
			return () => {};
		}
		if (
			state.status !== actions.PREDICTION_START &&
			!state.prediction &&
			state.status === actions.MODEL_LOADED
		) {
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
