import { babel } from '@rollup/plugin-babel';

const config = {
    input: 'lib/index.js',
    output: {
        file: 'lib/bundle.js',
        format: 'cjs',
    },
    plugins: [babel({ babelHelpers: 'bundled' })],
};

export default config;
