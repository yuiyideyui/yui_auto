/** @type {import('rollup').RollupOptions} */
// ---cut---
module.exports={
    input: 'src/main.js',
    output: {
        file: 'bundle.js',
        format: 'cjs'
    },
};