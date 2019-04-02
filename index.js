'use strict'

const yaml = require('js-yaml')

const include = require('./lib/include.js')
const join = require('./lib/join.js')
const merge = require('./lib/merge.js')

function parse(file, baseSchema = yaml.DEFAULT_SAFE_SCHEMA) {
  const schema = yaml.Schema.create(baseSchema, [ merge, join ])
  return include.parse(file, schema)
}

module.exports = { parse, dump: yaml.safeDump }
