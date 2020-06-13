'use strict'

const rollup = require('rollup')
const svelte = require('rollup-plugin-svelte')
const { default: resolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const alias = require('@rollup/plugin-alias')
const replace = require('@rollup/plugin-replace')
const { join } = require('path')

const production = process.env.NODE_ENV === 'production'

module.exports = async function build (layout, page, props, ssr) {
  try {
    const bundle = await rollup.rollup({
      input: join(__dirname, ssr ? 'App.svelte' : 'csr.js'),
      plugins: [
        alias({
          entries: [
            { find: '~page', replacement: page },
            { find: '~layout', replacement: layout }
          ]
        }),
        replace({
          __props__attrs__: Object.entries(props).map(([ key, value ]) => `${key}=${JSON.stringify(value)}`).join(' '),
          __props__hash__: JSON.stringify(props)
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
