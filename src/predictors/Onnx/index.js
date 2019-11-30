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

const SUPPORTED_BACKENDS = {
	[BACKENDS.CPU]: "cpu",
	[BACKENDS.WASM]: "wasm",
	[BACKENDS.WEB_GL]: "webgl",
	[BACKENDS.WEB_METAL]: "webgpu"
};

function OnnxPredictor({
	selectedBackend,
	imageUrl,
	isPredicting,
	onPredictionStatusChange
}) {
	const onnx = useOnnx({
		backend: SUPPORTED_BACKENDS[selectedBackend],
		imageUrl
	});

	useEffect(() => {
		onPredictionStatusChange(onnx.status);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onnx.status]);

	if (!SUPPORTED_BACKENDS[selectedBackend] || !imageUrl) {
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
