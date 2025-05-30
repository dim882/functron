import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get all component directories
const componentsDir = path.join(__dirname, 'src/components');
const components = fs
  .readdirSync(componentsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

// Create input configuration for each component
const input = components.reduce((acc, component) => {
  acc[component] = `src/components/${component}/index.tsx`;
  return acc;
}, {});

export default {
  input,
  output: {
    dir: 'dev',
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
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: 'node_modules/**',
    }),
    postcss({
      modules: true,
      extract: 'bundle.css',
      minimize: true,
      sourceMap: true,
    }),
    copy({
      targets: [{ src: 'src/**/*.css', dest: 'dev' }],
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
