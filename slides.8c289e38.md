class: center, middle

# ES7 Decorators

---

# Agenda

1. Definitions
1. Use cases
1. Code

---

# Warning

## Decorators are still a proposal!

1. They're stage 3, so reasonably stable.
1. Your browser won't parse it natively
1. Use ~~your favourite transpiler~~ Babel

---

# What do decorators look like?

> Open the DevTools console to run the code

```js
   @canWalk
   @count('say')
   class HomoSapiens {
     @readonly
     species = 'homo sapiens'

     @frozen
     dateOfBirth

     @sings
     speak(what) {
       return what
     }
   }
```

---

# What is a Class anyway?

Put simply, a class is a template for instances.

It defines the properties and methods that will be available
to the instances created from it.

### How about instances?

An instance is
* a state with initial value (the default values of the properties)
* a behaviour (the methods defined in the class)

The state of the instances can be modified as the behaviour is expressed (_ie_, methods are called).

---

# What is a Decorator then?

A decorator allows you to change a class.

It is a semantic helper that hooks functions and properties in the definition of a class.

They allow the developers to modify the definition of a class/method/property
and change it on the fly.

** They can only be applied on ES6 classes, not to object literals. **

---

# The 2 types of decorators

---

# The 2 types of decorators
## Class decorators

> They allow to change the definition of the class they decorate
> for properties and methods.
>
> **They MUST return a class**.

---

# The 2 types of decorators

## Property Decorator

> They allow to redefine the behaviour of a property.
>
> **They MUST return a Property Descriptor**.

---

## What is a property descriptor?

If you're not familiar with the concept of "Property descriptor",
see the beloved MDN:

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

###**tl;dr;** Property descriptors allow to define how a property is bound to and behaves within an object.

read: It's a very hairy topic.


---

# Our example code

```js
   @canWalk
   @count('say')
   class HomoSapiens {
     @readonly
     species = 'homo sapiens'

     @frozen
     dateOfBirth

     @sings
     speak(what) {
       return what
     }
   }
```

---

# Let's dive in

---

# The `readonly` decorator

```js
function readonly(target, key, descriptor) {
  descriptor.writable = false
  return descriptor
}
```

---

# The `frozen` decorator

```js
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
```

---

# The `canWalk` decorator

```js
function canWalk(target) {
  target.prototype.walks = function() {
    console.log("I'm walking")
  }
  return target
}
```

---

# The `sings` decorator

```js
function sings(target, key, descriptor) {
  let orig = target[key]
  target[key] = function(what) {
    return `🎶${orig.call(this, what)}🎶`
  }
  return target
}
```

---

# The `count` decorator

```js
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
```
---

# Why would we want them?

* It's a finer composition pattern
* They do not interfere with business logic
* It works down to the property level
* Your classes definitions are less cluttered
* They are called "decorator" because they (somehow) wrap behaviour

---

# When to use them?

* Typically, Mixins: behaviour that can neither be inherited nor composed (Animal, Person, FlyAbility)
* To strip non-business critical code
* Most of the time, they'll be provided by a 3rd party lib


---

# How about Ember?

Ember can haz decorators, too!

---

# Ember, without decorators

```js
Component.extend(Mixin1, Mixin2, {
  myCounter: service(),

  myProp1: computed('myCounter.currentValue', function() {
    return this.myCounter.currentValue * 2
  }),

  actions: {
    didClickSubmitButton() {
      // ...
    }
  }
})
```

---

# Ember, with decorators

```js
class MyComponent extends Component.extend(Mixin1, Mixin2) {
  @service
  myCounter

  @computed('myCounter.currentValue')
  get myProp1() {
    return this.myCounter.currentValue * 2
  }

  @action
  didClickSubmitButton() {
    // ...
  }
})
```

---

# Going further

## The spec
* https://github.com/tc39/proposal-decorators

## Some "real-life" decorators
* https://github.com/jayphelps/core-decorators
* https://github.com/ember-decorators/ember-decorators
* https://github.com/peopledoc/doc-splitter/tree/ember-decorators

---

class: center, middle

# That's all, folks!
Thanks for participating!
