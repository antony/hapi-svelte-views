'use strict'

const rollup = require('rollup')
const svelte = require('rollup-plugin-svelte')
const { default: resolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const virtual = require('@rollup/plugin-virtual')

const production = process.env.NODE_ENV === 'production'

module.exports = async function build (filename, props, ssr) {
  try {
    const bundle = await rollup.rollup({
      input: ssr ? filename : '~entry',
      plugins: [
        virtual({
          '~entry': `
          import App from '${filename}'

          const app = new App({
            target: document.body,
            props: ${JSON.stringify(props)},
            hydrate: true
          });
          `
        }),
        svelte({
          dev: !production,
          generate: ssr ? 'ssr' : 'csr',
          hydratable: true
        }),
        resolve({
          browser: true,
          dedupe: ['svelte']
        }),
        commonjs()
      ]
    })

    const { output } = await bundle.generate({
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/build/bundle.js'
    })

    return output[0].code
  } catch (e) {
    console.error(e)
  }
}
