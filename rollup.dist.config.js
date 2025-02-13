import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';

export default {
  input: './src/main.ts',
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
      tsconfig: './tsconfig.dist.json',
    }),
    babel({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      babelHelpers: 'bundled',
      include: ['src/**/*.ts'],
      exclude: 'node_modules/**',
    }),
  ],
};
