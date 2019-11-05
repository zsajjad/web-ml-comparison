
import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";
import take from "lodash/take";
import ndarray from "ndarray";
import ops from "ndarray-ops";
import { Tensor } from "onnxjs";

import imagenetClasses from "../../data/imagenetClasses";

import * as mathUtils from "../../utils/math";

export function getTensorFromCanvasContext(ctx) {
	const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	const { data, width, height } = imageData;
	const dataTensor = ndarray(new Float32Array(data), [width, height, 4]);
	const dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [
		1,
		3,
		width,
		height
	]);
	ops.assign(
		dataProcessedTensor.pick(0, 0, null, null),
		dataTensor.pick(null, null, 2)
	);
	ops.assign(
		dataProcessedTensor.pick(0, 1, null, null),
		dataTensor.pick(null, null, 1)
	);
	ops.assign(
		dataProcessedTensor.pick(0, 2, null, null),
		dataTensor.pick(null, null, 0)
	);
	ops.divseq(dataProcessedTensor, 255);
	ops.subseq(dataProcessedTensor.pick(0, 0, null, null), 0.485);
	ops.subseq(dataProcessedTensor.pick(0, 1, null, null), 0.456);
	ops.subseq(dataProcessedTensor.pick(0, 2, null, null), 0.406);
	ops.divseq(dataProcessedTensor.pick(0, 0, null, null), 0.229);
	ops.divseq(dataProcessedTensor.pick(0, 1, null, null), 0.224);
	ops.divseq(dataProcessedTensor.pick(0, 2, null, null), 0.225);
	const tensor = new Tensor(new Float32Array(3 * width * height), "float32", [
		1,
		3,
		width,
		height
	]);
	tensor.data.set(dataProcessedTensor.data);
	return tensor;
}

export function getPredictedClass(res) {
	if (!res || res.length === 0) {
		const empty = [];
		for (let i = 0; i < 5; i++) {
			empty.push({
				name: "-",
				probability: 0,
				index: 0
			});
		}
		return empty;
	}
	const output = mathUtils.softmax(Array.prototype.slice.call(res));
	return getTopClasses({ output, classes: imagenetClasses, length: 5 });
}

/**
 * Find top k classes
 */
export function getTopClasses({ output, classes, length = 5 }) {
	const sorted = reverse(
		sortBy(
			output.map((prob, index) => [prob, index]),
			probIndex => probIndex[0]
		)
	);
	const topK = take(sorted, length).map(probIndex => {
		const iClass = classes[probIndex[1]];
		return {
			id: iClass[0],
			index: parseInt(probIndex[1], 10),
			name: iClass[1].replace(/_/g, " "),
			probability: probIndex[0]
		};
	});
	return topK;
}
