
ratchet [![Build status](https://travis-ci.org/strong-roots-capital/ratchet.svg?branch=master)](https://travis-ci.org/strong-roots-capital/ratchet) [![npm version](https://img.shields.io/npm/v/@strong-roots-capital/ratchet.svg)](https://npmjs.org/package/@strong-roots-capital/ratchet) [![codecov](https://codecov.io/gh/strong-roots-capital/ratchet/branch/master/graph/badge.svg)](https://codecov.io/gh/strong-roots-capital/ratchet)
================================================================================================================================================================================================================================================================================================================================================================================================================================================

> Filter a stream of values monotonically

Use the [Maybe](https://gigobyte.github.io/purify/adts/Maybe/) monad to "ratchet" a stream of values, guaranteeing processing over monotonically-changing values.

This function obeys the following invariants:

*   only yields monotonically-changing values
*   does not yield duplicates
*   does not yield any value that was not passed in

Install
-------

```shell
npm install @strong-roots-capital/ratchet
```

Use
---

```typescript
import Ratchet from '@strong-roots-capital/ratchet'
import randomInt from 'random-int'

const comparator = (x: number, y: number) => x - y
const ratchet = Ratchet(comparator)

function doTheThing(x: number) {
    ratchet(x)
        .map((element: number) => {
            /* safely do something here with element */
            console.log(x)
        })
    // `map` will only run when `x` is an element that would be
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

In this example, we use the ratchet to ensure each value processed is numerically higher than all previously-processed values.

**Note**: the ratchet will never emit a duplicate value.

To define a custom definition of equality (e.g. `deepEqual`) pass a comparison function as the second argument.

Related
-------

*   [purify-ts](https://github.com/gigobyte/purify)

Acknowledgments
---------------

*   [fast-check](https://github.com/dubzzz/fast-check)

## Index

### Functions

* [Ratchet](#ratchet)

---

## Functions

<a id="ratchet"></a>

###  Ratchet

▸ **Ratchet**<`T`>(comparator: *`function`*, equality?: *`function`*): `function`

*Defined in [ratchet.ts:46](https://github.com/strong-roots-capital/ratchet/blob/2a520e9/src/ratchet.ts#L46)*

Filter a stream of values monotonically.

**Type parameters:**

#### T 
**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| comparator | `function` | - |
| `Default value` equality | `function` |  (x, y) &#x3D;&gt; x &#x3D;&#x3D;&#x3D; y |

**Returns:** `function`

___

