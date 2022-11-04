import test from 'ava'
import { contramap, ordNumber } from 'fp-ts/Ord'
import { map } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'
import { randomInt } from 'fp-ts/Random'

/**
 * Library under test
 */

import { Ratchet } from '../../src/ratchet'

function isNotUndefined<T = any>(value: T | undefined): value is T {
    return value !== undefined
}

function highWaterMark() {
    let lastSeen = -Infinity
    return function comparator(x: number) {
        const next = Math.max(lastSeen, x)
        if (lastSeen === next) {
            throw new Error('Should not return same value twice')
        }
        lastSeen = next
        return lastSeen
    }
}

test('should allow convenient client-code', t => {

    const largest = highWaterMark()
    const ratchet = Ratchet(ordNumber)

    function callee(x: number) {
        pipe(
            ratchet(x),
            map(element => t.is(element, largest(element)))
        )
    }

    const input = Array(10).fill(100).map(high => randomInt(0, high)())
    input.concat(input).forEach(callee)
})
