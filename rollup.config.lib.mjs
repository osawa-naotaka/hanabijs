import typescript from '@rollup/plugin-typescript';

export default {
	input: 'src/bin.ts',
	output: {
		file: 'dist/hanabijs-bin.js',
		format: 'esm'
	},
	plugins: [typescript()],
};