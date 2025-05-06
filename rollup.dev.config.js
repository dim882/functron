import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

export default {
  input: './src/dev/main.tsx',
  output: {
    file: 'dev/main.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    commonjs({
      include: 'node_modules/**',
      browser: true,
      preferBuiltins: false,
    }),
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.dev.json',
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
        { src: 'src/dev/index.html', dest: 'dev' },
        { src: 'src/**/*.css', dest: 'dev' },
      ],
    }),
    serve({
      open: false,
      contentBase: 'dev',
      port: 882,
    }),
    livereload({
      watch: 'dev',
    }),
  ],
};
