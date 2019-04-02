'use strict'

const yaml = require('js-yaml')

const join = new yaml.Type('!join', {
  kind: 'sequence',

  resolve: function resolve(data) {
    return Array.isArray(data)
  },

  construct: function construct(data) {
    /* istanbul ignore if // should never happen */
    if (! Array.isArray(data)) return data
    return data.join('')
  },
})

module.exports = join
