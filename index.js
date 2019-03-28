'use strict'

const yaml = require('js-yaml')

const merge = require('./lib/merge.js')
const include = require('./lib/include.js')

function parse(file, baseSchema = yaml.DEFAULT_SAFE_SCHEMA) {
  const schema = yaml.Schema.create(baseSchema, merge)
  return include.parse(file, schema)
}

module.exports = { parse }
