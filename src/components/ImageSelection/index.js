/**
 *
 * ImageSelection
 *
 */

import React from "react";
// import PropTypes from 'prop-types';
import styled from "styled-components";

import data from "../../data/images";

const Container = styled.div.attrs({
	"data-layout": "row",
	"data-layout-wrap": "wrap",
	"data-layout-align": "center center"
})`
	max-width: 1080px;
	padding: 12px;
`;

const Image = styled.img`
	width: 100px;
	height: 100px;
	object-fit: contain;
	border-radius: 4px;
	margin: 12px;
	background-color: rgba(0, 0, 0, 0.75);
	border: 1px solid black;
	cursor: pointer;
	transition: all 0.3s ease;

	${({ selected }) =>
		selected
			? `
  	transform: scale(1.1);
    box-shadow: 2px 4px 8px -4px rgba(0, 0, 0, 0.8);
    background-color: rgba(255, 255, 255, 0.75);
    border-color: white;
  `
			: ``}

	&:hover {
		${({ selected }) =>
			selected
				? `
      transform: scale(1.1);
    `
				: `
      transform: scale(1.03);
    `}
	}
`;

function ImageSelection({ selectedUrl, onSelect }) {
	return (
		<Container>
			{data.map(img => (
				<Image
					selected={selectedUrl === img.value}
					key={img.value}
					src={img.value}
					alt={img.text}
					onClick={() => onSelect(img.value)}
				/>
			))}
		</Container>
	);
}

ImageSelection.propTypes = {};

export default ImageSelection;
