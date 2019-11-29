/**
 *
 * PredictionCard
 *
 */
import startCase from "lodash/startCase";
import React from "react";
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from "react-intl";
// import messages from "./messages";
import * as Styled from "./Styled";
import Chart from "components/Chart";
import Button from "components/Button";

function PredictionCard({
	title,
	prediction,
	inferenceTime,
	status,
	onStartPress,
	isPredicting
}) {
	return (
		<Styled.Container>
			<Styled.Heading>{title}</Styled.Heading>
			{!status || (status === "init" && !isPredicting) ? (
				<Button label="Classify" onClick={onStartPress} />
			) : null}
			{status && status !== "init" ? (
				<>
					<Styled.Status>{startCase(status)}</Styled.Status>
					{inferenceTime ? (
						<Styled.Status>{inferenceTime} ms</Styled.Status>
					) : null}
					{prediction ? (
						<Chart
							data={prediction.map(item => ({
								label: startCase(item.name),
								probability: item.probability
							}))}
						/>
					) : null}
				</>
			) : null}
		</Styled.Container>
	);
}

PredictionCard.propTypes = {};

export default PredictionCard;
