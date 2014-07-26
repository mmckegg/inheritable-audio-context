var AudioContext = (global.AudioContext || global.webkitAudioContext)

module.exports = InheritableAudioContext

function InheritableAudioContext(audioContext, copyExtendedAttributes){
  
  if (!(this instanceof InheritableAudioContext)){
    if (audioContext && audioContext instanceof InheritableAudioContext){
      return Object.create(audioContext)
    } else {
      return new InheritableAudioContext(audioContext, copyExtendedAttributes)
    }
  }
  
  this.parentContext = audioContext || InheritableAudioContext.prototype

  if (audioContext && copyExtendedAttributes){
    for (var k in audioContext){
      if (k in audioContext && !InheritableAudioContext.prototype[k]){
        this[k] = audioContext[k]
      }
    }
  }
  
}

function functionProxy(k){
  return function(){
    var result = this.parentContext[k].apply(this.parentContext, arguments)
    if (result && result.context == this.parentContext){
      result.context = this
    }
    return result
  }
}

function proxyProperty(target, k){
  Object.defineProperty(target, k, {
    get: function(){
      return this.parentContext[k]
    }
  })
}

var baseContext = new AudioContext()
var proto = InheritableAudioContext.prototype = {
  constructor : InheritableAudioContext
}

for (var k in baseContext){
  if (typeof baseContext[k] == 'function'){
    proto[k] = functionProxy(k)
  }
}

proxyProperty(proto, 'currentTime')
proxyProperty(proto, 'sampleRate')