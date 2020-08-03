var basex = require('../')
var tape = require('tape')
var fixtures = require('./fixtures.json')
var uint8ArrayFromString = require('uint8arrays/from-string')
var uint8ArrayToString = require('uint8arrays/to-string')

var bases = Object.keys(fixtures.alphabets).reduce(function (bases, alphabetName) {
  bases[alphabetName] = basex(fixtures.alphabets[alphabetName])
  return bases
}, {})

fixtures.valid.forEach(function (f) {
  tape.test('can encode ' + f.alphabet + ': ' + f.hex, function (t) {
    var base = bases[f.alphabet]
    var actual = base.encode(uint8ArrayFromString(f.hex, 'base16'))

    t.plan(1)
    t.same(actual, f.string)
  })
})

fixtures.valid.forEach(function (f) {
  tape.test('can decode ' + f.alphabet + ': ' + f.string, function (t) {
    var base = bases[f.alphabet]
    var actual = uint8ArrayToString(base.decode(f.string), 'base16')

    t.plan(1)
    t.same(actual, f.hex)
  })
})

fixtures.invalid.forEach(function (f) {
  tape.test('decode throws on ' + f.description, function (t) {
    var base = bases[f.alphabet]

    t.plan(1)
    t.throws(function () {
      if (!base) base = basex(f.alphabet)

      base.decode(f.string)
    }, new RegExp(f.exception))
  })
})

tape.test('decode should return Uint8Array', function (t) {
  t.plan(2)
  t.true(bases.base2.decode('') instanceof Uint8Array)
  t.true(bases.base2.decode('01') instanceof Uint8Array)
})

tape.test('encode throws on string', function (t) {
  var base = bases.base58

  t.plan(1)
  t.throws(function () {
    base.encode('a')
  }, new RegExp('^TypeError: Expected Uint8Array$'))
})

tape.test('encode not throw on Array or Uint8Array', function (t) {
  var base = bases.base58

  t.plan(2)
  t.same(base.encode([42, 12, 34]), 'F89f')
  t.same(base.encode(new Uint8Array([42, 12, 34])), 'F89f')
})
