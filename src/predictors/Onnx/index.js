/**
 *
 * ONNX Predictor
 *
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import * as BACKENDS from "data/backends";
import useOnnx from "./useOnnx";
import PredictionCard from "components/PredictionCard";

const SUPPORTED_BACKENDS = [BACKENDS.CPU, BACKENDS.WEB_GL];

function OnnxPredictor({
	selectedBackend,
	imageUrl,
	isPredicting,
	onPredictionStatusChange
}) {
	const onnx = useOnnx({
		backend: selectedBackend,
		imageUrl
	});

	useEffect(() => {
		onPredictionStatusChange(onnx.status);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onnx.status]);

	if (!SUPPORTED_BACKENDS.includes(selectedBackend) || !imageUrl) {
		return null;
	}

	return (
		<PredictionCard
			title="ONNX.js"
			{...onnx}
			isPredicting={isPredicting}
			onStartPress={() => {
				onnx.startPrediction();
			}}
		/>
	);
}

OnnxPredictor.propTypes = {
	selectedBackend: PropTypes.oneOf(BACKENDS.ALL),
	imageUrl: PropTypes.string,
	isPredicting: PropTypes.bool,
	onPredictionStatusChange: PropTypes.func.isRequired
};

export default OnnxPredictor;
