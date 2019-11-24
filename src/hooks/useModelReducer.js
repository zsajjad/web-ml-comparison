import { useReducer } from "react";

export const actions = {
	RESET: "init",
	MODEL_LOADED: "modelLoaded",
	PREDICTION_START: "predicting",
	PREDICTION_COMPLETE: "predicted"
};

const initialState = {
	status: null,
	prediction: null,
	inferenceTime: 0
};

function stateReducer(state, action) {
	switch (action.type) {
		case actions.RESET:
			return { ...initialState, status: actions.RESET };
		case actions.MODEL_LOADED:
			return {
				...initialState,
				status: actions.MODEL_LOADED
			};
		case actions.PREDICTION_START:
			return {
				...state,
				status: actions.PREDICTION_START
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

export default function useModelReducer() {
	return useReducer(stateReducer, initialState);
}
