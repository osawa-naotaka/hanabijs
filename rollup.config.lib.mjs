import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
	input: 'src/bin.ts',
	output: {
		file: 'dist/hanabijs-bin.js',
		format: 'esm'
	},
	plugins: [typescript(), terser()],
};
