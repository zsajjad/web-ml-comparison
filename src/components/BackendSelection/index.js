/**
 *
 * BackendSelection
 *
 */

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "components/Button";

const Heading = styled.h3`
	color: #efefef;
	font-size: 18px;
	margin: 6px;
`;

const Container = styled.div.attrs({
	"data-layout-wrap": "wrap",
	"data-layout-align": "center center"
})`
	max-width: 1080px;
	padding: 12px;
`;

const ButtonsRow = styled.div.attrs({
	"data-layout": "row",
	"data-layout-wrap": "wrap",
	"data-layout-align": "center center"
})`
	max-width: 1080px;
	padding: 12px;
`;

const backends = [
	{
		id: "cpu",
		label: "CPU",
		disabled: false
	},
	{
		id: "webgl",
		label: "WebGL",
		disabled: false
	},
	{
		id: "webgpu",
		label: "WebMetal",
		disabled: false
	}
];

function BackendSelection({ onSelect, selected }) {
	return (
		<Container>
			<Heading>Select Backend</Heading>
			<ButtonsRow>
				{backends.map(backend => (
					<Button
						key={backend.id}
						onClick={() => onSelect(backend.id)}
						label={backend.label}
						isActive={selected === backend.id}
						disabled={backend.disabled}
					/>
				))}
			</ButtonsRow>
		</Container>
	);
}

BackendSelection.propTypes = {
	selected: PropTypes.oneOf(backends.map(({ id }) => id)),
	onSelect: PropTypes.func.isRequired
};

export default BackendSelection;
