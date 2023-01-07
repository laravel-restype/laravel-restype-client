import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: './src/index.ts',
        plugins: [typescript()],
        output: {
            file: './dist/index.js',
            format: 'es',
        },
    },
    {
        input: './src/index.ts',
        plugins: [typescript()],
        output: {
            file: './dist/index-es5.js',
            format: 'cjs',
        },
    },
];
