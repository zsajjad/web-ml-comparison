/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback, useRef } from "react";
import * as WebDNN from "webdnn";
import useModelReducer, { actions } from "hooks/useModelReducer";
import { getPredictedClass } from "utils";
import { getImageArray } from "./utils";

let runner;

const MODEL_URL = "./squeezenet-webdnn";
const IMAGE_SIZE = 224;

async function getPredictions({ url }) {
	if (!runner) {
		return {
			prediction: [],
			inferenceTime: 0
		};
	}
	const start = new Date();
	const imageArray = await getImageArray({
		url,
		width: IMAGE_SIZE,
		height: IMAGE_SIZE
	});
	runner.inputs[0].set(imageArray);
	await runner.run();
	const end = new Date();
	const output = await runner.outputs[0].toActual();
	// const topK = WebDNN.Math.argmax(output, 5);
	// console.log(runner.outputs);
	// prediction: mapOutputToClasses(topK),
	return {
		prediction: getPredictedClass(output),
		inferenceTime: end.getTime() - start.getTime()
	};
}

export default function useWebdnn({ imageUrl, backend }) {
	const [state, dispatch] = useModelReducer();
	const currentBackend = useRef();

	const loadModel = async () => {
		if (!runner || currentBackend.current !== backend) {
			runner = await WebDNN.load(MODEL_URL, {
				backendOrder: backend
			});
			currentBackend.current = backend;
		}
		dispatch({ type: actions.MODEL_LOADED });
	};

	const predict = async () => {
		const { prediction, inferenceTime } = await getPredictions({
			url: imageUrl
		});

		dispatch({
			type: actions.PREDICTION_COMPLETE,
			payload: {
				prediction,
				inferenceTime
			}
		});
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
