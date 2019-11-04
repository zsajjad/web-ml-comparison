import loadImage from "blueimp-load-image";

const imageLoaderConfigs = {
	maxWidth: 224,
	maxHeight: 224,
	cover: true,
	crop: true,
	canvas: true,
	crossOrigin: "Anonymous"
};

function renderImage(img) {
	if (img.type === "error") {
		return;
	}
	try {
		const canvas = document.getElementById(this.elementId);
		const ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		this.callback({ canvas, ctx });
	} catch (e) {
		console.error(e);
	}
}

export default function loadImageToCanvas({
	elementId,
	url,
	loaderConfigs = {}
}) {
	if (!url) {
		return;
	}
	return new Promise(res => {
		loadImage(url, renderImage.bind({ elementId, callback: res }), {
			...imageLoaderConfigs,
			...loaderConfigs
		});
	});
}
