'use strict';

const Hoek = require('@hapi/hoek');
const { join, dirname } = require('path');
const { readFile } = require('fs/promises')
const build = require('./rollup-runtime');

exports.compile = function compile(template, compileOpts) {
  return async function runtime(context, renderOpts) {
    renderOpts = Hoek.applyToDefaults(compileOpts, renderOpts)

    const template = await readFile(join(dirname(renderOpts.filename), 'template.html'), 'utf8')
    const ssr = new Function(await build(renderOpts.filename, context, true) + ';return app')
    const { css, html, head } = ssr().render()

    const js = await build(renderOpts.filename, context, false)

    const output = template
      .replace('%SSR_HEAD%', head)
      .replace('%SSR_CSS%', css.code)
      .replace('%SSR_HTML%', html)
      .replace('%SCRIPTS%', `<script async defer>${js}</script>`)

    return output
  }
}
