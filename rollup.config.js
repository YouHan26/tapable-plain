import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
	{
		input: 'src/index.js',
		output: [
			{ file: pkg.browser, format: 'umd', name: pkg.name },
			{ file: pkg.cjs, format: 'cjs', name: pkg.name },
			{ file: pkg.module, format: 'module', name: pkg.name },
		],
		sourceMap: true,
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
			babel({
				exclude: 'node_modules/**' // only transpile our source code
			}),
		]
	}
];
