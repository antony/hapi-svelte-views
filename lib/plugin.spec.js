'use strict'

const plugin = require('./plugin')
const { expect } = require('@hapi/code')

describe('plugin', () => {
  it('Returns compiler', () => {
    expect(
      plugin.compile()
    ).to.be.a.function()
  })
})
