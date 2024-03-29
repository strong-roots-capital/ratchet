# ratchet

[![Build Status]](https://github.com/strong-roots-capital/ratchet/actions/workflows/release.yml)

[build status]: https://github.com/strong-roots-capital/ratchet/actions/workflows/release.yml/badge.svg?event=push

> Filter a stream of values monotonically

Use the [Option] monad to "ratchet" a stream of values, guaranteeing
processing over monotonically-changing values.

This function obeys the following invariants:

- only yields monotonically-changing values
- does not yield duplicates
- does not yield any value that was not passed in

## Install

```shell
npm install @strong-roots-capital/ratchet
```

## Use

```typescript
import * as N from 'fp-ts/number'
import { pipe } from 'fp-ts/function'
import { map } from 'fp-ts/Option'
import { randomInt } from 'fp-ts/Random'

import { Ratchet } from '../src/ratchet'

const ratchet = Ratchet(N.Ord)

function doTheThing(x: number) {
    pipe(
        ratchet(x),
        map((value: number) => {
            /* safely do something here with value */
            console.log(value)
        })
    )
    // `map` will only run when `x` is a value that would be
    // sorted after all previously-seen values
}

const input = Array(10).fill(100).map(randomInt)
console.log(input)
//=>[ 69, 33, 65, 12, 91, 34, 95, 91, 80, 12 ]

input.forEach(doTheThing)
//=>69
//=>91
//=>95
```

In this example, we use the ratchet to ensure each value processed is
numerically higher than all previously-processed values.

**Note**: the ratchet will never emit a duplicate value.

## Resources

- [Getting started with fp-ts: Ord](https://dev.to/gcanti/getting-started-with-fp-ts-ord-5f1e)

## Acknowledgments

- [fp-ts](https://github.com/gcanti/fp-ts)
- [fast-check](https://github.com/dubzzz/fast-check)

[Option]: https://gcanti.github.io/fp-ts/modules/Option.ts.html

## Index

### Functions

* [Ratchet](README.md#ratchet)

## Functions

###  Ratchet

▸ **Ratchet**‹**T**›(`ordering`: Ord‹T›): *function*

*Defined in [src/ratchet.ts:20](https://github.com/strong-roots-capital/ratchet/blob/b381197/src/ratchet.ts#L20)*

Filter a stream of values monotonically.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`ordering` | Ord‹T› |

**Returns:** *function*

▸ (`value`: T): *Option‹T›*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |
