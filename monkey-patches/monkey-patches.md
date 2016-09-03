Three most ridiculous monkey patches we've seen
=================

> A monkey patch is a way for a program to extend or modify supporting system software locally.
> The term monkey patch seems to have come from an earlier term, guerrilla patch, which referred to changing code sneakily – and possibly incompatibly with other such patches
[Wikipedia](https://en.wikipedia.org/wiki/Monkey_patch)

As a third party Javascript software provider, our code runs in the Wild Wide Web. Sites that try to support IE 6, shady Wordpress themes, site that were built in Dreamweaver and many other horrors as such.

This is indeed a foreign environment. An unknown browser, unknown OS, and unknown developers who
race to create the most bizarre monkey patches you can think of. Bugs can be introduces indirectly in such a discreet way that you'll question whether this whole Internet thing is really worth it.

Here are some of the more strange modifications we've seen:

### 1. JSON
  JSON is a universal standard. well defined and vastly popular. A fact that doesn't hold some developers from monkey patching it.

  How was JSON changed you ask? Lets examine the following output:

  ```javascript
  JSON.stringify({a: undefined})
  // {"a":undefined}
  ```

  See anything strange? Yep, the correct output should be ```{}```. As mentioned in the [docs](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) stringify omits undefined values. Unfortunately this version did not do so. Faulty JSON was sent to our servers, our JSON.parse failed, and stared in that days logs highscores.

  But why? Probably a sloppy attempt to support older browsers. IE 6 strikes from the grave.

### 2. Function.prototype.bind
  ```Function.prototype.bind``` is an important method, fundamental to Javascripts functional nature. An unnamed Wordpress theme devs took upon themselves to re-implement it:

  ```javascript
  Function.prototype.bind = function(scope) {
    var self = this;
    return function() {
      return self.apply(scope, arguments);
    };
  }
  ```

  Can you spot the bug? Well, this implementation lack an important feature of bind - currying. This will not work:

  ```javascript
    function add(a, b) {
      return a + b;
    }

    var add10 = add.bind(null, 10);
    add10(1); // Should be 11, returns NaN
  ```

### 3. Array.prototype.map
Who doesn't love ```Array.prototype.map```? Such an elegant functional programming technique. Who isn't shocked when it fails to run? This time the culprit will be named as it's non other than Prototype.js. A pretty old version of it but still.

Lets look at their code:

```javascript
  // map made into an alias of collect later
  collect: function(iterator, context) {
    iterator = iterator || Prototype.K;
    var results = [];
    this.each(function(value, index) {
      results.push(iterator.call(context, value, index));
    });
    return results;
  }
```
Professional as we can expect. They even added *Array.prototype.each* for us. Unfortunately an important property of *map* was lost. We can no longer do this trick:

```javascript
Array.prototype.map.call(arguments, fn);
```
All the Array-like objects tricks goes out the window.

Prototype.js have long since changed the implementation. But in the Wild Wide Web your sins stay forever.

Protection
-----------
How should a responsible third party developer response to such shenanigans? You might do nothing, just declare you don't support or handle such cases. This is not the path we'll suggest you take. It is possible to protect your code, at least to some degree, from the harsh reality of the Internet.

### IIFE
A common misconception is to enclose your code with a [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression) - immediately invoked function expression. The function will receive a reference to the global variables you want to protect.

For example, in order to ensure you have the original window, jquery, and undefined variables you can

```javascript
function(window, $, undefined) {
  // your code
}(window, $)
```
Now your code will continue working even if the user will do something like
```javascript
window.$ = { ajax: function() {} };
```

This method provides a very partial protection. Lets say that after your code is loaded the user adds the following code:
```javascript
  $.ajax = function() {}
```

Since you only kept a *reference* to the jquery variable, you are still vulnerable to modification on the object itself.

In reality this method has other benefits, such as shortening the list of scopes JS needs to look in to find your variable, or enabling js obfuscators to rename common variables such as window or document.

### More IIFE

We can utilize a similar construct to [UMDs](https://github.com/umdjs/umd) module pattern. Here we clone the objects we want to protect, and then pass it to our IIFE:

```javascript
function(factory) {
  var $ = clone($);

  factory(window, $)
}(function(window, $){
  // your code
})
```

Of course we have to ask ourselves - where is the limit? Should we just clone window and be done with it? Should take the burden of managing a list of all language function we use and clone them by an individual basis?


Alas, even this method would not provide real guarantee for native function integrity, as the user might override them before loading our code. It is in fact impossible to create such security.

### Detecting a monkey patched method?
Wouldn't it be nice to just be able to test whether a function have been monkey patched? If we'll be able to do that, we'll at least be able to fail gracefully. JavaScript won't make our life easy in this task as well. A property that might come in handy is the output of the ```toString```
 method for native functions:

```javascript
  Function.prototype.bind.toString();
  // function bind() { [native code] }
```

Utilizing this we can create a monkey patch detection method:
```javascript
  function isMonkeyPatched(fn) {
    return !Function.prototype.toString.call(fn).match(/native code/);
  }
```

Unfortunately this will only work for native functions, and will fail if our beloved users monkey patch toString.


In conclusion
--------------
Javascript, as wonderful language that it is allows everyone to override almost everything. We have encountered some very bizarre bugs that resulted from strange monkey patches. Even though it's always nice to find out that a bug was not caused by your code, you need to ask yourself what's next? Do you approach the client and tell them their code breaks our code? Or do you handle it yourself?
