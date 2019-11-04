export function softmax(arr) {
	const C = Math.max(...arr);
	const d = arr.map(y => Math.exp(y - C)).reduce((a, b) => a + b);
	const o = arr.map((value, index) => {
		return Math.exp(value - C) / d;
	});
	return o;
}
