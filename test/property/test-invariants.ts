import { testProp, fc } from 'ava-fast-check'
import { expect } from 'chai'
import { pipe } from 'fp-ts/lib/pipeable'
import { ordNumber, ordString } from 'fp-ts/lib/Ord'
import { map } from 'fp-ts/lib/Option'

/**
 * Library under test
 */

import { Ratchet } from '../../src/ratchet'

testProp(
    'should yield monotonically-changing values',
    [fc.array(fc.integer())],
    (xs) => {
        const input = xs.concat(xs)
        let output: number[] = []

        const ratchet = Ratchet(ordNumber)
        input.forEach(x => {
            pipe(
                ratchet(x),
                map(x => output.push(x))
            )
        })

        output.forEach((_, index, self) => {
            if (index + 1 === self.length) { return }
            expect(self[index]).to.be.below(self[index+1])
        })
    }, {
        verbose: true
    }
)

testProp(
    'should yield monotonically-changing values of any type',
    [fc.array(fc.string())],
    (xs) => {
        const input = xs.concat(xs)
        let output: string[] = []

        const ratchet = Ratchet(ordString)
        input.forEach(x => {
            pipe(
                ratchet(x),
                map(x => output.push(x))
            )
        })

        output.forEach((_, index, self) => {
            if (index + 1 === self.length) { return }
            expect(ordString.compare(self[index], self[index+1])).to.be.below(0)
        })
    }, {
        verbose: true
    }
)

testProp(
    'should only yield values passed in',
    [fc.array(fc.string())],
    (xs) => {
        const input = xs.concat(xs)
        let output: string[] = []

        const ratchet = Ratchet(ordString)
        input.forEach(x => {
            pipe(
                ratchet(x),
                map(x => output.push(x))
            )
        })

        output.forEach((element) => {
            expect(input).to.include(element)
        })
    }, {
        verbose: true
    }
)

testProp(
    'should not yield duplicates',
    [fc.array(fc.string())],
    (xs) => {
        const input = xs.concat(xs)
        let output: string[] = []

        const ratchet = Ratchet(ordString)
        input.forEach(x => {
            pipe(
                ratchet(x),
                map(x => output.push(x))
            )
        })

        output.forEach((element, index, self) => {
            expect(self.indexOf(element)).to.equal(index)
        })
    }, {
        verbose: true
    }
)
