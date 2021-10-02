---
title: Functions as seen in Smalltalk
date: 2017-04-24
description: Hello world
---

**⚠️ Warning: this is an exploration of a language and not something suitable for the production code.**

We start by defining our own `indexOf` function. It takes a string, a character, and a starting index:

```
function indexOf(s, char, startingAt) {
  // ...
}
```

Then the function call would like like

```js
indexOf("The owls are not what they seem.", "o", 5); // 14
```

It might be hard to understand what every parameter means just by looking at the call.

In JavaScript this problem is usually solved by passing an object:

```js
function indexOf({ s, char, startingAt }) {
  // ...
}

indexOf({
  s: "The owls are not what they seem.",
  char: "o",
  startingAt: 5,
}); // 14
```

Let's explore an alternative approach.

In English language you can say:

<blockquote>Give me the index of the character "o" in the string "The owls are not what they seem." starting at index 5.</blockquote>

Languages like Smalltalk and Objective-C give you an ability to encode this type of sentences in method signatures.

Here is an example Objective-C method signature:

```
- (int)changeColorToRed:(float)red green:(float)green blue:(float)blue;
```

Method call would like like this:

```
[myColor changeColorToRed:5.0 green:2.0 blue:6.0];
```

Okay, back to JavaScript.

Let's imagine we have `define` function:

```js
define("indexOf<char>in<string>startingAt<index>", (char, string, index) => {
  // reuse native JS implementation
  return string.indexOf(char, index);
});
```

The result of this is the ability to run the following expression:

```js
indexOf({ char: "o" })
  .in({ string: "The owls are not what they seem." })
  .startingAt({ index: 5 }); // 14
```

Reads like a proper english sentence, right?

I will hide the definition in case you want to try code it yourself.

```js
function define(parameterDefinitionString, handler) {
  // ...
}
```

<button onclick="document.querySelector('#definition').style.display = ''; this.style.display = 'none';">Show me the code!</button>

<div style="display: none;" id="definition">

Here is one possible implementation for `define`:

```js
function define(parameterDefinitionString, handler) {
  const parts = parameterDefinitionString
    .split("<")
    .reduce((res, part) => [...res, ...part.split(">")], [])
    .filter(Boolean);

  const args = [];

  function set(obj, index) {
    const namePart = parts[index];
    const argumentName = parts[index + 1];

    obj[namePart] = function(objArg) {
      args.push(objArg[argumentName]);

      if (index >= parts.length - 2) {
        return handler.apply(handler, args);
      } else {
        const obj = {};
        set(obj, index + 2);
        return obj;
      }
    };
  }

  const env = typeof window !== "undefined" ? window : global;

  set(env, 0);
}
```

In a real world this might be implemented as a Babel plugin which optimizes both definitions and calls to a "normal" expression like `indexOf('The owls are not what they seem.', 'o', 5)`. Optional type checks could be added to a runtime.

[Try the code on JSBin](http://jsbin.com/qirorap/4/edit?js,console).

</div>
