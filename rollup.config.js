import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/main.js',
    format: 'esm',
    sourcemap: true,
  },
  external: ['snabbdom'],
  plugins: [
    commonjs({
      include: 'node_modules/**',
    }),
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    babel({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      babelHelpers: 'bundled',
      include: ['src/**/*.ts'],
      exclude: 'node_modules/**',
    }),
    postcss({
      modules: true,
      extract: 'bundle.css',
      minimize: true,
      sourceMap: true,
    }),
    copy({
      targets: [
        { src: 'src/demo/index.html', dest: 'dist' },
        { src: 'src/**/*.css', dest: 'dist' },
      ],
    }),
    serve({
      open: false,
      contentBase: 'dist',
      port: 4000,
    }),
    livereload({
      watch: 'dist',
    }),
  ],
};
