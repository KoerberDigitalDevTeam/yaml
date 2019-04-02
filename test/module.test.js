'use strict'

const expect = require('chai').expect

describe('Module Test', () => {
  let parse
  before(() => {
    parse = require('..').parse
  })

  it('should handle a complex case', () => {
    expect(parse('test/yaml/complex.yml')).to.eql({
      /* Defined atop */
      variables: {
        foo: 'bar',
      },

      /* Included straight with merge */
      foo_reference: 'bar',
      joint_string: 'foobar',
      other: 'value',
      extended: false,

      /* Nested object with inclusion */
      nested_object: {
        foo_reference: 'bar',
        other: 'value',
        extended: true,
      },

      /* Array with merge */
      array: [
        'extra1',
        /* From complex2 */
        'included_first',
        { 'included_second': 'bar' },
        'included_third',
        'extra2a',
        'extra2b',
        'extra3a',
        'extra3b',
        {
          foo_reference: 'bar',
          other: 'value',
          extended: false,
        },
      ],
    })
  })

  it('should handle a complex case without default schema', () => {
    /* Just check that we honor the "base schema" */
    expect(parse('test/yaml/complex.yml', null)).to.eql({
      /* Defined atop */
      'variables': {
        foo: 'bar',
      },

      /* Included straight with merge */
      '<<': {
        foo_reference: 'bar',
        other: 'value',
        extended: 'false',
      },

      /* Joint string */
      'joint_string': 'foobar',

      /* Nested object with inclusion */
      'nested_object': {
        '<<': {
          foo_reference: 'bar',
          other: 'value',
          extended: 'false',
        },
        'extended': 'true',
      },

      /* Array with merge */
      'array': [
        'extra1',
        /* From complex2 */
        'included_first',
        { 'included_second': 'bar' },
        'included_third',
        'extra2a',
        'extra2b',
        'extra3a',
        'extra3b',
        {
          foo_reference: 'bar',
          other: 'value',
          extended: 'false',
        },
      ],
    })
  })
})
