Simple YAML parser wrapper with extensions
==========================================

This simply wraps the `js-yaml` package providing a `parse(...)` convenience
method to parse files *synchronously*, and adding a couple of useful tags.

Usage
-----

Very simply:

```javascript
const { parse } = require('@koerber/yaml')
let parsed = parse('my_file.yml')
```

An optional *second argument* to the `parse(...)` function allows to specify
the base schema for parsing (defaulting to `DEFAULT_SAFE_SCHEMA)`.

The module also exposes `dump(...)` as an alias to `js-yaml`'s `safeDump(...)`.


The `!include` tag
------------------

The `!include` tag will include another YAML file in the current one. For example:

```yaml
object:
  <<: !include other.yml
```

Given the contents of `other.yml` as:

```yaml
foo: bar
```

And noting the use of the `<<:` merging tag in this example, the resulting
parsed JSON will be:

```json
"object" {
  "foo": "bar"
}
```

The `!include` tag can be used also in included documents, and will resolve
file names relative to the _real path_ of the document where the tag is
specified (in other words, symlinks are followed).


The `!merge` tag
----------------

The `!merge` tag merges arrays of arrays into one single array. For example:

```yaml
array: !merge
  -
    - one
    - two
  -
    - three
    - four
  - five
  -
    - six
    - seven
```

Will be parsed as the following JSON:

```json
{
  "array": [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven"
  ]
}
```

This is quite useful when used with references where a file like the following:

```yaml
base: &base
  - a
  - b
merged: !merge
  - *base
  - c
```

Will be parsed as the following JSON:

```json
{
  "base": [ "a", "b" ],
  "merged": [ "a", "b", "c" ]
}
```

Ultimately, this can also be used in conjunction with `!include` whereas:

```yaml
!merge
- !include other.yml
- baz
```

Given the following contents for `other.yml`:

```yaml
- foo
- bar
```

Will be parsed as the following JSON:

```json
[ "foo", "bar", "baz" ]
```

The `!join` tag
----------------

The `!join` tag joins array members into a string. For example:

```yaml
joined: !join
  - One
  - Two
  - Three
```

Will be parsed as the following JSON:

```json
{ "joined": "OneTwoThree" }
```

The same output can be expected for the following YAML syntax:

```yaml
joined: !join [ One, Two, Three ]
```

License
-------

This work is licensed under the [MIT License Agreement](LICENSE.md)


