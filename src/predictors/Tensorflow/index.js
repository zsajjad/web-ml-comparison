/**
 *
 * Tensorflow Predictor
 *
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import * as BACKENDS from "data/backends";
import useTensorflow from "./useTensorflow";
import PredictionCard from "components/PredictionCard";

const SUPPORTED_BACKENDS = {
	[BACKENDS.CPU]: "cpu",
	[BACKENDS.WASM]: "cpu",
	[BACKENDS.WEB_GL]: "webgl",
	[BACKENDS.WEB_METAL]: "webgl"
};
function TensorflowPredictor({
	selectedBackend,
	imageUrl,
	isPredicting,
	onPredictionStatusChange
}) {
	const tfjs = useTensorflow({
		backend: SUPPORTED_BACKENDS[selectedBackend],
		imageUrl
	});

	useEffect(() => {
		onPredictionStatusChange(tfjs.status);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tfjs.status]);

	if (!SUPPORTED_BACKENDS[selectedBackend] || !imageUrl) {
		return null;
	}

	return (
		<PredictionCard
			title="Tensorflow.js"
			{...tfjs}
			isPredicting={isPredicting}
			onStartPress={() => {
				tfjs.startPrediction();
			}}
		/>
	);
}

TensorflowPredictor.propTypes = {
	selectedBackend: PropTypes.oneOf(BACKENDS.ALL),
	imageUrl: PropTypes.string,
	isPredicting: PropTypes.bool,
	onPredictionStatusChange: PropTypes.func.isRequired
};

export default TensorflowPredictor;
