'use strict'

const Hoek = require('@hapi/hoek')
const { join, dirname } = require('path')
const { readFile } = require('fs/promises')
const build = require('./rollup-runtime')

exports.compile = function compile (t, compileOpts) {
  return async function runtime (context, renderOpts) {
    renderOpts = Hoek.applyToDefaults(compileOpts, renderOpts)

    const baseViewDir = dirname(renderOpts.filename)
    const template = await readFile(join(baseViewDir, 'template.html'), 'utf8')
    const page = renderOpts.filename
    const layout = join(baseViewDir, `${context.layout}.svelte`)

    const ssr = new Function(await build(layout, page, context.props, true) + ';return app') // eslint-disable-line no-new-func
    const { css, html, head } = ssr().render()

    const js = await build(layout, page, context.props, false)

    const output = template
      .replace('%SSR_HEAD%', head)
      .replace('%SSR_CSS%', css.code)
      .replace('%SSR_HTML%', html)
      .replace('%SCRIPTS%', `<script async defer>${js}</script>`)

    return output
  }
}
