import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
	input: 'src/main.ts',
	output: {
		file: 'dist/hanabijs-lib.js',
		format: 'esm'
	},
	plugins: [typescript(), terser()],
};
