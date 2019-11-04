import React, { useEffect, useReducer } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";

let model;

const actions = {
	RESET: "init",
	MODEL_LOADED: "modelLoaded",
	PREDICTION_START: "predicting",
	PREDICTION_COMPLETE: "predicted"
};

const initialState = {
	status: actions.RESET,
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
		case actions.PREDICTION_START:
			return {
				...state,
				status: actions.MODEL_LOADED
			};
		case actions.PREDICTION_COMPLETE:
			return {
				status: actions.PREDICTION_COMPLETE,
				prediction: action.payload.prediction,
				inferenceTime: action.payload.inferenceTime
			};
		default:
			return state;
	}
}

export default function({ imageUrl, width = 224, height = 224 }) {
	const [state, dispatch] = useReducer(stateReducer, initialState);

	const loadModel = async () => {
		if (!model) {
			model = await mobilenet.load();
		}
		dispatch({ type: actions.MODEL_LOADED });
	};

	const predict = async ({ url, width, height }) => {
		dispatch({
			type: actions.PREDICTION_START
		});
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.src = url;
		img.width = width;
		img.height = height;
		const start = new Date();
		const prediction = await model.classify(img);
		const end = new Date();
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
