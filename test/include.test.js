'use strict'

const fs = require('fs')
const { expect, AssertionError } = require('chai')
const YAMLException = require('js-yaml').YAMLException

describe('Include files', () => {
  let include
  before(() => include = require('../lib/include.js'))

  it('should include a basic file', () => {
    expect(include.parse('test/yaml/basic1.yml')).eql({
      foo: 'bar',
    })
  })

  it('should include a basic file through a number of links', () => {
    expect(include.parse('test/yaml/link1.yml')).eql({
      foo: 'bar',
    })
  })

  it('should transitively include variables', () => {
    expect(include.parse('test/yaml/variables1.yml')).eql({
      variables: { foo: 'bar' },
      references: { foo: 'bar' },
      included: { foo: 'bar', baz: null },
    })
  })

  it('should not parse a bad YML file', () => {
    expect(() => include.parse('test/yaml/badyml.yml'))
        .to.throw(YAMLException, 'bad indentation of a mapping entry in "test/yaml/badyml.yml"')
  })

  it('should not include a bad YML file', () => {
    expect(() => include.parse('test/yaml/badinclude.yml'))
        .to.throw(YAMLException, 'bad indentation of a mapping entry in "test/yaml/badyml.yml"')
  })

  it('should not parse a non-existant file', () => {
    expect(() => include.parse('test/yaml/nonexistant.yml'))
        .to.throw(YAMLException, 'file "test/yaml/nonexistant.yml" not found')
  })

  it('should fail including a non-existant file', () => {
    expect(() => include.parse('test/yaml/notfound.yml'))
        .to.throw(YAMLException, 'file "test/yaml/nonexistant.yml" to include not found in "test/yaml/notfound.yml"')
  })

  it('should fail including self', () => {
    expect(() => include.parse('test/yaml/loop0.yml'))
        .to.throw(YAMLException, 'file "test/yaml/loop0.yml" attempts to include itself in "test/yaml/loop0.yml"')
  })

  it('should fail including self via symlinks', () => {
    expect(() => include.parse('test/yaml/loopX.yml'))
        .to.throw(YAMLException, 'file "test/yaml/loopY.yml" attempts to include itself in "test/yaml/loopX.yml"')
  })

  it('should fail including files in a loop', () => {
    try {
      include.parse('test/yaml/loop1.yml')
      expect.fail('Parsing successful')
    } catch (error) {
      if (error instanceof AssertionError) throw error
      expect(error).to.be.instanceOf(YAMLException)
      expect(error.message).to.have.string('loop detected including "test/yaml/loop1.yml" in "test/yaml/loop3.yml"')
      expect(error.files).to.be.an('array')
      expect(error.files.length).to.equal(3)
      expect(error.files[0]).to.equal(fs.realpathSync('test/yaml/loop1.yml'))
      expect(error.files[1]).to.equal(fs.realpathSync('test/yaml/loop2.yml'))
      expect(error.files[2]).to.equal(fs.realpathSync('test/yaml/loop3.yml'))
    }
  })
})
