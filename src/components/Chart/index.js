/**
 *
 * Chart
 *
 */

import React from "react";
import { Doughnut } from "react-chartjs-2";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
	width: 360px;
	height: 360px;
`;
function Chart({ data }) {
	return (
		<Container>
			<Doughnut
				data={{
					datasets: [
						{
							data: data.map(({ probability }) => probability),
							backgroundColor: [
								"rgba(205,123,116, 1)",
								"rgba(205,123,116, 0.9)",
								"rgba(205,123,116, 0.8)",
								"rgba(205,123,116, 0.7)",
								"rgba(205,123,116, 0.6)"
							]
						}
					],
					labels: data.map(({ label }) => label)
				}}
				height={320}
				width={320}
				showLabels
			/>
		</Container>
	);
}

Chart.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			probability: PropTypes.number
		})
	)
};

export default Chart;
