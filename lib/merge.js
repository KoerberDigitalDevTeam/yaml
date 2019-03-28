'use strict'

const yaml = require('js-yaml')

const merge = new yaml.Type('!merge', {
  kind: 'sequence',

  resolve: function resolve(data) {
    return Array.isArray(data)
  },

  construct: function construct(data) {
    /* istanbul ignore if // should never happen */
    if (! Array.isArray(data)) return data
    const array = []
    data.forEach((e) => array.push(...(Array.isArray(e) ? e : [ e ])))
    return array
  },
})

module.exports = merge
