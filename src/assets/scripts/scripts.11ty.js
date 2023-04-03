const esbuild = require('esbuild')
//const { NODE_ENV = 'production' } = process.env

const isProduction = (process.env.NODE_ENV === 'production');

module.exports = class {
    data() {
        return {
            permalink: false,
            eleventyExcludeFromCollections: true
        }
    }

    async render() {
        await esbuild.build({
            entryPoints: ['src/assets/scripts/main.js', 'src/assets/scripts/listing.js'],
            bundle: true,
            minify: isProduction,
            outdir: 'public/assets/scripts',
            sourcemap: !isProduction,
            target: isProduction ? 'es6' : 'esnext'
        })
    }

}
