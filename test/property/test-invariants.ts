import { testProp, fc } from 'ava-fast-check'
import { pipe } from 'fp-ts/function'
import { ordNumber, ordString } from 'fp-ts/Ord'
import { map } from 'fp-ts/Option'

/**
 * Library under test
 */

import { Ratchet } from '../../src/ratchet'

testProp(
    'should yield monotonically-changing values',
    [fc.array(fc.integer())],
    (t, xs) => {
        const input = xs.concat(xs)
        const output: number[] = []

        const ratchet = Ratchet(ordNumber)
        input.forEach(x => {
            pipe(
                ratchet(x),
                map(x => output.push(x))
            )
        })

        output.forEach((_, index, self) => {
            if (index + 1 === self.length) { return }
            t.true(self[index] < self[index + 1])
        })
        // in case output is empty
        t.pass()
    }, {
        verbose: true
    }
)

testProp(
    'should yield monotonically-changing values of any type',
    [fc.array(fc.string())],
    (t, xs) => {
        const input = xs.concat(xs)
        const output: string[] = []

        const ratchet = Ratchet(ordString)
        input.forEach(x => {
            pipe(
                ratchet(x),
                map(x => output.push(x))
            )
        })

        output.forEach((_, index, self) => {
            if (index + 1 === self.length) { return }
            t.true(ordString.compare(self[index], self[index+1]) < 0)
        })
        // in case output is empty
        t.pass()
    }, {
        verbose: true
    }
)

testProp(
    'should only yield values passed in',
    [fc.array(fc.string())],
    (t, xs) => {
        const input = xs.concat(xs)
        const output: string[] = []

        const ratchet = Ratchet(ordString)
        input.forEach(x => {
            pipe(
                ratchet(x),
                map(x => output.push(x))
            )
        })

        output.forEach((element) => {
            t.true(input.includes(element))
        })
        // in case output is empty
        t.pass()
    }, {
        verbose: true
    }
)

testProp(
    'should not yield duplicates',
    [fc.array(fc.string())],
    (t, xs) => {
        const input = xs.concat(xs)
        const output: string[] = []

        const ratchet = Ratchet(ordString)
        input.forEach(x => {
            pipe(
                ratchet(x),
                map(x => output.push(x))
            )
        })

        output.forEach((element, index, self) => {
            t.is(self.indexOf(element),  index)
        })
        // in case output is empty
        t.pass()
    }, {
        verbose: true
    }
)
