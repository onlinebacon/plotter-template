import * as Canvas from './canvas.js';
import * as Vars from './vars.js';

const vals = Vars.vals;

Vars.add({ label: 'Radius',     name: 'r',         val: 100, min: 1, max: 500 });
Vars.add({ label: 'Line width', name: 'lineWidth', val: 1,   min: 1, max: 10 });

Vars.setUpdateListener(() => {
	Canvas.render();
});

Canvas.setRender((ctx, width, height) => {
	ctx.setTransform(1, 0, 0, 1, width*0.5, height*0.5);
	ctx.fillStyle = '#f70';
	ctx.strokeStyle = '#fff';
	ctx.lineWidth = vals.lineWidth;
	ctx.beginPath();
	ctx.arc(0, 0, vals.r, 0, Math.PI*2);
	ctx.fill();
	ctx.stroke();
});

Vars.update();
