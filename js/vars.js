const vars = [];
export const vals = {};

let selected = null;
let updateListener = () => {};

const easeArr = [{
	name: 'lin',
	toNormal: (v) => {
		const { val, min, max } = v;
		return (val - min)/(max - min);
	},
	toValue: (v, normal) => {
		const { min, max } = v;
		return normal*(max - min) + min;
	},
}, {
	name: 'exp',
	toNormal: (v) => {
		const { val, min, max } = v;
		const t = Math.log(max/min);
		const p = Math.log(val/min);
		return p/t;
	},
	toValue: (v, normal) => {
		const { min, max } = v;
		const t = Math.log(max/min);
		return Math.exp(normal*t)*min;
	},
}];

let ease = easeArr[0];

const round = (val) => {
	return Number(val.toPrecision(8));
};

const inputs = Object.fromEntries(
	[...document.querySelectorAll('input')].map(
		input => [ input.getAttribute('name'), input ]
	)
);

const select = (v) => {
	selected = v;
	document.querySelector('.var-name').innerText = v.label;
	inputs.val.value = round(v.val);
	inputs.min.value = round(v.min);
	inputs.max.value = round(v.max);
	updateInputRange();
};

const updateInputRange = () => {
	const input = inputs.range;
	const v = selected;
	const normal = ease.toNormal(v);
	input.value = normal*input.getAttribute('max');
};

const scaleRange = (factor) => {
	const v = selected;
	const range = (v.max - v.min)*factor;
	v.min = v.val - range/2;
	v.max = v.val + range/2;
	inputs.min.value = round(v.min);
	inputs.max.value = round(v.max);
	updateInputRange();
};

const incVarIndex = (val) => {
	const l = vars.length;
	const i = (vars.indexOf(selected) + val + l)%l;
	select(vars[i]);
};

const incEaseIndex = (val) => {
	const l = easeArr.length;
	const i = (easeArr.indexOf(ease) + val + l)%l;
	ease = easeArr[i];
	document.querySelector('#ease').innerText = ease.name;
	updateInputRange();
};

inputs.range.addEventListener('input', () => {
	const input = inputs.range;
	const normal = input.value/input.getAttribute('max');
	const v = selected;
	const val = ease.toValue(v, normal);
	v.val = val;
	inputs.val.value = round(val);
	vals[v.name] = val;
	updateListener(vals);
});

inputs.val.addEventListener('change', () => {
	const input = inputs.val;
	const v = selected;
	const val = Number(input.value);
	v.min = Math.min(v.min, val);
	v.max = Math.max(v.max, val);
	inputs.min.value = round(v.min);
	inputs.max.value = round(v.max);
	v.val = val;
	vals[v.name] = val;
	updateInputRange();
	updateListener(vals);
});

[ 'min', 'max' ].forEach(name => {
	const input = inputs[name];
	input.addEventListener('change', () => {
		selected[name] = Number(input.value);
		updateInputRange();
	});
});

document.querySelector('#ease').addEventListener('click', () => {
	incEaseIndex(1);
});

window.addEventListener('keydown', e => {
	const { key } = e;
	if (/^(arrow)?right$/i.test(key)) {
		incVarIndex(+1);
	}
	if (/^(arrow)?left$/i.test(key)) {
		incVarIndex(-1);
	}
});

document.querySelector('#divRange').addEventListener('click', () => {
	scaleRange(0.1);
});

document.querySelector('#mulRange').addEventListener('click', () => {
	scaleRange(10);
});

export const add = ({ label, name, val, min, max, fn }) => {
	const v = { label, name, val, min, max, fn };
	vars.push(v);
	vals[name] = val;
	if (selected === null) {
		select(v);
	}
};

export const set = (name, val) => {
	const v = vars.find(v => v.name === name);
	v.val = val;
	v.min = Math.min(v.min, val);
	v.max = Math.max(v.max, val);
	if (v === selected) {
		select(v);
	}
};

export const setUpdateListener = (listener) => {
	updateListener = listener;
};

export const update = () => {
	updateListener(vals);
};
