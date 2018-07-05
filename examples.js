console.log(`/************************************************
**  Welcome to the demo for ES7 Decorators!
**  The code of the class HomoSapiens is slide 11.
**
**  To get started, create an instance:
**
**    let p = new HomoSapiens()
**
**  Then, feel free to play with the properties and methods:
**
**    p.species = 'whatever'
**    p.species
**    // => homo.sapiens
**
**    p.say('something')
**    p.walks()
**
**    p.dateOfBirth = "today"
**    p.dateOfBirth = "now"
**    // throw new Error('"dateOfBirth is frozen"')
*******************************************
`)


function readonly(target, key, descriptor) {
  descriptor.writable = false
  return descriptor
}

function frozen(target, key, descriptor) {
  let initializer = descriptor.initializer || function() {}
  let value = initializer.call(this)
  return {
    get() {
      return value
    },
    set(newValue) {
      if (value !== undefined) {
        throw new Error(`${key} is a frozen property`)
      }
      value = newValue
      return value
    }
  }
}

function canWalk(target) {
  target.prototype.walks = function() {
    console.log("I'm walking")
  }
  return target
}

function count(what) {
  let countProp = `__${what}Count`

  return function(target) {
    if (target.prototype[what]) {
      let orig = target.prototype[what]

      target.prototype[countProp] = 0

      target.prototype[what] = function(...args) {
        let count = ++this[countProp]
        console.warn(`"${what}" has been called ${count} times.`)
        return orig.apply(this, args)
      }
    }
    return target
  }
}

function sings(target, key, descriptor) {
  let orig = target[key]
  target[key] = function(what) {
    return `🎶${orig.call(this, what)}🎶`
  }
  return target
}

@count('say')
@canWalk
class HomoSapiens {
  @readonly
  species = 'homo sapiens'

  @frozen
  dateOfBirth

  @sings
  say(what) {
    return what
  }
}

window.HomoSapiens = HomoSapiens

