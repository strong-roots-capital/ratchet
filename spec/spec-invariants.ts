import { testProp, fc } from 'ava-fast-check'
import { expect } from 'chai'


/**
 * Library under test
 */

import Ratchet from '../src/ratchet'

testProp(
    'Should yield monotonically-changing values',
    [fc.array(fc.integer())],
    (xs) => {
        const input = xs.concat(xs)
        let output: number[] = []

        const ratchet = Ratchet((x: number, y: number) => x - y)
        input.forEach(x => {
            ratchet(x).map((x: number) => output.push(x))
        })

        output.forEach((_, index, self) => {
            if (index + 1 === self.length) { return }
            expect(self[index]).to.be.below(self[index+1])
        })
    }
)

testProp(
    'Should yield monotonically-changing values of any type',
    [fc.array(fc.string())],
    (xs) => {
        const input = xs.concat(xs)
        let output: string[] = []

        const ratchet = Ratchet((x: string, y: string) => x.localeCompare(y))
        input.forEach(x => {
            ratchet(x).map((x: string) => output.push(x))
        })

        output.forEach((_, index, self) => {
            if (index + 1 === self.length) { return }
            expect(self[index].localeCompare(self[index+1])).to.be.below(0)
        })
    }
)

testProp(
    'Should only yield values passed in',
    [fc.array(fc.string())],
    (xs) => {
        const input = xs.concat(xs)
        let output: string[] = []

        const ratchet = Ratchet((x: string, y: string) => x.localeCompare(y))
        input.forEach(x => {
            ratchet(x).map((x: string) => output.push(x))
        })

        output.forEach((element) => {
            expect(input).to.include(element)
        })
    }
)

testProp(
    'Should not yield duplicates',
    [fc.array(fc.string())],
    (xs) => {
        const input = xs.concat(xs)
        let output: string[] = []

        const ratchet = Ratchet((x: string, y: string) => x.localeCompare(y))
        input.forEach(x => {
            ratchet(x).map((x: string) => output.push(x))
        })

        output.forEach((element, index, self) => {
            expect(self.indexOf(element)).to.equal(index)
        })
    }
)
