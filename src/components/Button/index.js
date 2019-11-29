/**
 *
 * Button
 *
 */

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledButton = styled.button`
	padding: 12px 24px;
	margin: 6px 12px;
	border-radius: 6px;
	transition: all 0.3s ease;
	border: 1px solid #f7f6f3;
	background: #161d32;
	color: #f7f6f3;
	font-size: 14px;
	cursor: pointer;
	transform: scale(0.96);

	&:hover {
		box-shadow: 2px 4px 0px rgba(0, 0, 0, 0.8);
	}
	${({ isActive }) =>
		isActive
			? `
			background: #f7f6f3;
			color: #161d32;
			box-shadow: 2px 4px 0px rgba(0, 0, 0, 0.8);
			font-weight: bold;
			transform: scale(1);

	`
			: `
	`};
`;

function Button({ label, onClick, disabled, isActive, ...props }) {
	return (
		<StyledButton
			disabled={disabled}
			onClick={onClick}
			isActive={isActive}
			{...props}
		>
			{label}
		</StyledButton>
	);
}

Button.propTypes = {
	label: PropTypes.any.isRequired,
	onClick: PropTypes.func.isRequired,
	isActive: PropTypes.bool,
	disable: PropTypes.bool
};

export default React.memo(Button);
