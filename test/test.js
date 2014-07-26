var test = require('tape')
var InheritableAudioContext = require('../')

var AudioContext = (window.AudioContext || window.webkitAudioContext)

test(function(t){
  var rootContext = new AudioContext()
  var subContext = InheritableAudioContext(rootContext)
  var subContext2 = Object.create(subContext)

  t.doesNotThrow(function(){
    var rootGain = rootContext.createGain()
    var subGain = subContext.createGain()
    subGain.connect(rootGain)
  })

  subContext.someValue = { test: 123 }
  t.ok(rootContext.someValue === undefined)
  t.equal(subContext.someValue, subContext2.someValue)

  subContext2.anotherValue = { value: 456 }
  t.ok(subContext.anotherValue === undefined, 'value not tranlated up prototype tree')

  var originalObject = { foo: 'bar' }
  var anotherObject = { foo: 'another value' }

  subContext.somethingElse = originalObject
  t.equal(subContext.somethingElse, originalObject)
  t.equal(subContext2.somethingElse, originalObject)

  subContext2.somethingElse = anotherObject
  t.equal(subContext.somethingElse, originalObject)
  t.equal(subContext2.somethingElse, anotherObject)

  t.ok(subContext instanceof InheritableAudioContext, 'instanceof InheritableAudioContext')
  t.notOk(subContext instanceof AudioContext, 'not instanceof InheritableAudioContext')

  t.end()
})