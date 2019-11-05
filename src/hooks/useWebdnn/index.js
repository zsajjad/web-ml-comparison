import React, { useEffect, useReducer } from "react";
import * as WebDNN from "webdnn";
import useModelReducer, { actions } from "../useModelReducer";
import { getImageArray, mapOutputToClasses } from "./utils";


let runner;
const MODEL_URL = "./webdnn";

export async function getPredictions({ url, width, height }) {
	if (!runner) {
		return {
			prediction: [],
			inferenceTime: 0,
		};
	}
	const start = new Date();
	const imageArray = await getImageArray({ url, width, height });
	runner.inputs[0].set(imageArray);
	await runner.run();
	const end = new Date();

	const output = runner.outputs[0].toActual();
	const topK = WebDNN.Math.argmax(output, 5);
	console.log({ topK });
	const prediction = mapOutputToClasses(topK);
	return {
		prediction,
		inferenceTime: end.getTime() - start.getTime()
	};
} 

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

		const { prediction, inferenceTime} = await getPredictions({ url, width, height });

		dispatch({
			type: actions.PREDICTION_COMPLETE,
			payload: {
				prediction,
				inferenceTime
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
