'use strict'

const expect = require('chai').expect
const yaml = require('js-yaml')

describe('Join String', () => {
  let schema
  before(() => {
    const join = require('../lib/join.js')
    schema = yaml.Schema.create(yaml.DEFAULT_SAFE_SCHEMA, join)
  })

  it('should join some arrays into a string', () => {
    expect(yaml.safeLoad(
        '!join [ foobar ]',
        { schema })
    ).to.eql('foobar')

    expect(yaml.safeLoad(
        '!join [ a , b , c ]',
        { schema })
    ).to.eql('abc')
  })

  it('should join with references', () => {
    expect(yaml.safeLoad(
        'base: &base theBase\njoint: !join [ *base ]',
        { schema })
    ).to.eql({ base: 'theBase', joint: 'theBase' })

    expect(yaml.safeLoad(
        'base: &base theBase\njoint: !join [ "{" , *base , "}" ]',
        { schema })
    ).to.eql({ base: 'theBase', joint: '{theBase}' })
  })

  it('should refuse to work on objects', () => {
    expect(() => yaml.safeLoad(
        'foo: !join\n  a: b\n  c: d',
        { schema })
    ).to.throw(yaml.YAMLException, 'unknown tag !<!join>')
  })
})
