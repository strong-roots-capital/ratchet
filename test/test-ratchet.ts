import test from 'ava'
import randomInt from 'random-int'
import randomRecord from 'random-record'
import TimeseriesRecord from 'timeseries-record'

/**
 * Library under test
 */

import Ratchet from '../src/ratchet'

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

function latestRecord() {
    let lastSeen: TimeseriesRecord | undefined
    return function comparator(x: TimeseriesRecord) {
        const next = [lastSeen, x].filter(isNotUndefined).sort((x, y) => x.Time - y.Time).slice(-1)[0]
        if (lastSeen === next) {
            console.log(lastSeen)
            console.log(next)
            throw new Error('Should not return same value twice')
        }
        lastSeen = next
        return lastSeen
    }
}

test('should allow convenient client-code', t => {

    const largest = highWaterMark()
    const ratchet = Ratchet((x: number, y: number) => x - y)

    function callee(x: number) {
        ratchet(x)
            .map(element => t.is(element, largest(element)))
    }

    const input = Array(10).fill(100).map(randomInt)
    input.concat(input).forEach(callee)
})

test('should work with object references', t => {

    const latest = latestRecord()
    const ratchet = Ratchet((x: TimeseriesRecord, y: TimeseriesRecord) => x.Time - y.Time)

    function callee(x: TimeseriesRecord) {
        ratchet(x)
            .map(record => t.is(record, latest(record)))
    }

    const input = Array(10).fill(100).map(randomRecord)
    input.concat(input).forEach(callee)
})
