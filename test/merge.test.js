'use strict'

const expect = require('chai').expect
const yaml = require('js-yaml')

describe('Merge Arrays', () => {
  let schema
  before(() => {
    const merge = require('../lib/merge.js')
    schema = yaml.Schema.create(yaml.DEFAULT_SAFE_SCHEMA, merge)
  })

  it('should merge some arrays', () => {
    expect(yaml.safeLoad(
        '!merge\n- - a\n  - b\n- c\n- - d\n  - e',
        { schema })
    ).to.eql([ 'a', 'b', 'c', 'd', 'e' ])

    expect(yaml.safeLoad(
        'foo: !merge\n- - a\n  - b\n- c\n- - d\n  - e',
        { schema })
    ).to.eql({ foo: [ 'a', 'b', 'c', 'd', 'e' ] })
  })

  it('should merge with references', () => {
    expect(yaml.safeLoad(
        'base: &base\n- a\n- b\nmerged: !merge\n- *base\n- c',
        { schema })
    ).to.eql({ base: [ 'a', 'b' ], merged: [ 'a', 'b', 'c' ] })
  })

  it('should refuse to work on objects', () => {
    expect(() => yaml.safeLoad(
        'foo: !merge\n  a: b\n  c: d',
        { schema })
    ).to.throw(yaml.YAMLException, 'unknown tag !<!merge>')
  })
})
