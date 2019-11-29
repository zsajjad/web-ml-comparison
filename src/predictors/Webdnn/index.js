/**
 *
 * WebDNN Predictor
 *
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import * as BACKENDS from "data/backends";
import useWebdnn from "./useWebdnn";
import PredictionCard from "components/PredictionCard";

const SUPPORTED_BACKENDS = {
	[BACKENDS.CPU]: "fallback",
	[BACKENDS.WEB_GL]: "webgl",
	[BACKENDS.WEB_METAL]: "webgpu"
};

function WebdnnPredictor({
	selectedBackend,
	imageUrl,
	isPredicting,
	onPredictionStatusChange
}) {
	const webdnn = useWebdnn({
		backend: SUPPORTED_BACKENDS[selectedBackend],
		imageUrl
	});

	console.log(webdnn);

	useEffect(() => {
		onPredictionStatusChange(webdnn.status);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [webdnn.status]);

	if (!SUPPORTED_BACKENDS[selectedBackend] || !imageUrl) {
		return null;
	}

	return (
		<PredictionCard
			title="WebDNN"
			{...webdnn}
			isPredicting={isPredicting}
			onStartPress={() => {
				webdnn.startPrediction();
			}}
		/>
	);
}

WebdnnPredictor.propTypes = {
	selectedBackend: PropTypes.oneOf(BACKENDS.ALL),
	imageUrl: PropTypes.string,
	isPredicting: PropTypes.bool,
	onPredictionStatusChange: PropTypes.func.isRequired
};

export default WebdnnPredictor;
