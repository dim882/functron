import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import del from 'rollup-plugin-delete';

export default {
  input: './src/demo/demo.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'module',
    sourcemap: true,
  },
  plugins: [
    del({ targets: 'dist' }),
    nodeResolve(),
    typescript(),
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
