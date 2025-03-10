import typescript from '@rollup/plugin-typescript';

export default {
	input: 'src/main.ts',
	output: {
		file: 'dist/hanabijs-lib.js',
		format: 'esm'
	},
	plugins: [typescript()],
};