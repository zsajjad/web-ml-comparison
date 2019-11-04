import sortBy from "lodash/sortBy";
import reverse from "lodash/reverse";
import take from "lodash/take";

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
