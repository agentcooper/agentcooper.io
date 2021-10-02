---
title: Scala
date: 2017-02-12
description: Hello world
---

I finished ["Functional Programming Principles in Scala"](https://www.coursera.org/learn/progfun1) and for the first time in a long time I am excited about a new programming language.

I did not pick up any compiled typed language for a while. I landed my first job doing JavaScript and it felt like a breath of fresh air after studying C++ at the university.

JavaScript community accepted static analysis through linters (JSLint &rarr; JSHint &rarr; ESLint), later came type checking with Flow and TypeScript. Flow codebase introduced me to the OCaml language. I was fascinated to learn about the powerful type system and pattern matching. And though the language seems to have a great community of very smart people, lack of toolchain and libraries held me back from learning it deeper.

Scala continues the ideas of OCaml: you can successfully combine object oriented and functional features in a language, mutable and immutable collections.

Here is a short summary about the language and the course.

#### What I liked about Scala

- No statements, only expressions
- Operators are method calls
- Inferred types
- Powerful pattern matching
- Structural equality
- Rich built-in collections library
- Maps and sequences are functions (key => value or index => value), brilliant!

#### What I learned from the course

##### Programming language ideas

- Implicit Parameters
- Partial functions (not to be confused with partial application!)
- Call-by-name as a syntax (`f: => T`)
- Covariance and contravariance

##### Computer science ideas

- Huffman encoding
- how to think about fold left and fold right as a trees:

<table>
<tr>
<td style="border: none">
<img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Right-fold-transformation.png">
</td>
<td style="border: none">
<img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Left-fold-transformation.png">
</td>
</tr>
</table>

##### What surprised me

- Coming from Flow, I expected union and intersection types, but they are scheduled only for [Dotty](http://dotty.epfl.ch/)
- In Scala community (at least in the FP part of it) it seems that the notions of Monoid and Semigroup are common knowledge

##### Links

- ["Scala exercises"](https://www.scala-exercises.org) to learn basic language and features
- ["Scala with style"](https://www.youtube.com/watch?v=kkTFx3-duc8) talk by Martin Odersky where he explains design decisions he made about the language
