'use strict'

const Mark = require('js-yaml/lib/js-yaml/mark')
const yaml = require('js-yaml')
const path = require('path')
const fs = require('fs')

function include(filename, baseSchema, files = [], anchors = {}) {
  let state = null

  function exception(message) {
    /* istanbul ignore if // should never happen */
    if (state == null) return new yaml.YAMLException(message)

    const mark = new Mark(state.filename, state.input, state.position, state.line, (state.position - state.lineStart))
    return new yaml.YAMLException(message, mark)
  }

  function listener(event, currentState) {
    Object.assign(currentState.anchorMap, anchors)
    state = currentState
  }

  const type = new yaml.Type('!include', {
    kind: 'scalar',

    construct: function construct(data) {
      const directory = path.dirname(filename)
      const resolved = path.resolve(directory, data)
      const relative = path.relative(process.cwd(), resolved)

      try {
        const realpath = fs.realpathSync(resolved)

        if (realpath == filename) {
          throw exception(`file "${relative}" attempts to include itself`)
        }

        if (files.indexOf(realpath) >= 0) {
          const x = exception(`loop detected including "${relative}"`)
          x.files = [ ...files, filename ]
          throw x
        }

        const includer = include(realpath, baseSchema, [ ...files, filename ], state && state.anchorMap)
        const schema = yaml.Schema.create(baseSchema, includer.type)

        const contents = fs.readFileSync(realpath)
        return yaml.load(contents, { schema, listener: includer.listener, filename: relative })
      } catch (error) {
        if (error.code === 'ENOENT') {
          throw exception(`file "${relative}" to include not found`)
        } else {
          throw error
        }
      }
    },
  })

  return { listener, type }
}

include.parse = function parse(filename, baseSchema = yaml.DEFAULT_SAFE_SCHEMA) {
  const directory = process.cwd()
  const resolved = path.resolve(directory, filename)
  const relative = path.relative(process.cwd(), resolved)

  try {
    const realpath = fs.realpathSync(resolved)
    const contents = fs.readFileSync(realpath)

    const includer = include(realpath, baseSchema)
    const schema = yaml.Schema.create(baseSchema, includer.type)

    return yaml.load(contents, { schema, listener: includer.listener, filename: relative })
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new yaml.YAMLException(`file "${filename}" not found`)
    } else {
      throw error
    }
  }
}

module.exports = include
