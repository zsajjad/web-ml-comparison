import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";
import take from "lodash/take";

import imagenetClasses from "../data/imagenetClasses";

import * as mathUtils from "./math";

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
			probability: probIndex[0] * 100
		};
	});
	return topK;
}
