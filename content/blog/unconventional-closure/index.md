---
title: Unconventional closure
date: 2017-01-08
description: Hello world
---

When explaining JavaScript closures we usually give an example with the outer function returning the inner function.

Following example illustrates the concept by mentioning only one function and no `return` keyword.

```js
let f;

{
  let a = 1;
  f = () => a++;
}

console.log(typeof a === "undefined"); // true
console.log(f(), f(), f()); // 1, 2, 3
```

In ES6, we can create scopes by using `let` inside of a `{}` block. Function `f` has access to all the scope variables at the moment of its creation.

Exiting the block, `f` closes over `a`, thus creating a closure.
