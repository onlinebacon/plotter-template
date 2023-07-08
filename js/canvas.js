const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let { width, height } = canvas;
let fnRender = (ctx = new WebGL2RenderingContext(), width = 0, height = 0) => {};

const resizeCanvas = () => {
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
};

export const setRender = (fn = fnRender) => {
	fnRender = fn;
};

export const render = () => {
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, width, height);
	fnRender(ctx, width, height);
};

window.addEventListener('resize', () => {
	resizeCanvas();
	render();
});

resizeCanvas();
