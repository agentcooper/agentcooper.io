---
title: Iterate partial results of Promise.all
date: 2019-02-03
description: Hello world
---

<p><small>
⚠️ This post uses latest JavaScript features. You'll need a modern browser or Node.js version 10 or higher to run examples.
</small></p>

I've stumbled upon this task while playing around with async iterators and `for await...of` statement.

From MDN about `Promise.all`:

> The Promise.all() method returns a single Promise that resolves when all of the promises passed as an iterable have resolved or when the iterable contains no promises.

What if we want to still run promises in parallel, but also output **partial results** along the way? This is useful for example in showing the status of asynchronous tasks in the UI.

Our new function will be called `partialAll`. What should it return? Since there would be multiple values over time, we can't use a promise as a return value. And we're too modern to use callbacks. Async iterators to the rescue:

```js
function resolveWithDelay(value, ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), ms);
  });
}

const p1 = resolveWithDelay(1, 500);
const p2 = resolveWithDelay(2, 100);
const p3 = resolveWithDelay(3, 400);

(async function() {
  for await (const partialResult of partialAll([p1, p2, p3])) {
    console.log(partialResult);
  }
  /**
   * Should output in sequence
   * At t = 100: [undefined, 2, undefined]
   * At t = 400: [undefined, 2, 3]
   * At t = 500: [1, 2, 3]
   */

  function partialAll(promises) {
    /** Implement here */
  }
})();
```

Pause reading here if you want to try implementing this yourself.

\*

\*

\*

---

Implementation took me a while. My first approach looked like this:

```js
function* partialAll(promises) {
  let output = [];

  for (let i = 0; i < promises.length; i++) {
    promises[i].then(result => {
      output[i] = result;
      yield output;
      // ❌ does not work,
      // inner function is not a generator
    });
  }
}
```

Introducing an inner function breaks the `yield`. I've spent some time trying to turn the inner function into the generator, but nothing seemed to work right with `then`.

I had to revisit how generators work under the hood. To create an iterable, we need a function with the name of `Symbol.iterator`. This function should return an object with the `next` property:

```js
function range(start, end) {
  let i = start - 1;

  const iterable = {
    [Symbol.iterator]: () => {
      return {
        next: () => {
          i = i + 1;
          return { value: i, done: i > end };
        },
      };
    },
  };

  return iterable;
}

for (const n of range(1, 10)) {
  console.log(n); // log 1, 2, ..., 10
}
```

Async iterators use `Symbol.asyncIterator` and their `next` method returns a promise:

```js
function asyncRange(start, end, ms = 100) {
  let i = start - 1;

  const iterable = {
    [Symbol.asyncIterator]: () => {
      return {
        next: () =>
          new Promise(resolve => {
            i = i + 1;
            setTimeout(() => {
              resolve({ value: i, done: i > end });
            }, ms);
          }),
      };
    },
  };

  return iterable;
}

(async function() {
  for await (n of asyncRange(0, 10)) {
    console.log(n); // log 1, 2, ..., 10 with a 100 ms delay
  }
})();
```

My first attempt at implementing `partialAll` iterator involved juggling around promises and their callbacks:

```js
function partialAll(promises) {
  let resolvedCounter = 0;
  const output = [];

  let globalResolve;
  let globalPromise;

  function setGlobal() {
    globalPromise = new Promise(resolve => {
      globalResolve = resolve;
    });
  }

  setGlobal();

  for (let i = 0; i < promises.length; i++) {
    const promise = promises[i];
    promise.then(value => {
      output[i] = value;
      if (resolvedCounter !== promises.length) {
        globalResolve({ value: output, done: false });
        setGlobal();
      } else {
        globalResolve({ done: true });
      }
      resolvedCounter++;
    });
  }

  return {
    [Symbol.asyncIterator]: () => {
      return {
        next: () => globalPromise,
      };
    },
  };
}
```

After more thinking, the generator version came out much more concise:

```js
async function* partialAll(promises) {
  const output = [];
  const pool = new Set(promises);

  promises.forEach((promise, i) => {
    promise.then(value => {
      output[i] = value;
      pool.delete(promise);
    });
  });

  while (pool.size !== 0) {
    await Promise.race([...pool]);
    yield output;
  }
}
```

We keep a pool of unresolved promises and `Promise.race` helps us to wait until the first one is done. Once done, it is removed from the pool. Since we don't care about execution order we can use `Set` to track unresolved promises.

That's all!

Links:

- [MDN: Iteration protocols
  ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- [MDN: for await...of
  ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)

Thanks to my friend [Valerii](https://valeriivasin.com/) for the idea on the final generator version.
