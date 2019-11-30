import styled from "styled-components";

export const Container = styled.div.attrs({
	"data-layout-align": "start center",
	"data-flex": "33"
})`
	background: rgba(0, 0, 0, 0.8);
	border-radius: 8px;
	padding: 12px;
	margin: 12px;
	max-width: 33%;
`;

export const Heading = styled.h4`
	color: #fff;
	font-size: 18px;
	margin: 6px;
	text-align: center;
`;

export const Status = styled.h4`
	color: #efefef;
	font-size: 12px;
	margin: 6px;
	text-align: center;
	font-weight: bold;
`;
