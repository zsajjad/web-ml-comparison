import * as WebDNN from "webdnn";
import loadImageToCanvas from "../../utils/loadImageToCanvas";
import imagenetClasses from "../../data/imagenetClasses";

export async function getImageArray({ url, width, height }) {
	const elementId = "input-canvas";
	const { canvas } = await loadImageToCanvas({
		elementId,
		url,
		loaderConfigs: { maxWidth: width, maxHeight: height }
	});

	const imageArray = await WebDNN.Image.getImageArray(canvas, {
		dstW: 223,
		dstH: 223,
		order: WebDNN.Image.Order.HWC,
		color: WebDNN.Image.Color.BGR,
		bias: [122.679, 116.669, 104.006] // RGB mean (not BGR)
	});
	return imageArray;
}

export function mapOutputToClasses(output) {
	let iClass = {};
	return output.map((key, index) => {
		iClass = imagenetClasses[key];
		console.log(key);
		return {
			id: iClass[0],
			index: key,
			name: iClass[1].replace(/_/g, " "),
			probability: 1
		};
	});
}
