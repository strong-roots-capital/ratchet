/**
 * ratchet
 * Filter a stream of values monotonically
 */

import { Maybe, Just, Nothing } from 'purify-ts/Maybe'

interface Filterable<T = any> {
    filter(f: (element: T) => boolean): T[];
}

function isNotUndefined<T = any>(value: T | undefined): value is T {
    return value !== undefined
}

function unsafeLast<T = any>(list: T[]): T {
    return list[list.length-1]
}

function filterIn<T = any>(f: (element: T) => boolean) {
    return function filterer(filterable: Filterable<T>) {
        return filterable.filter(f)
    }
}

function sort<T = any>(comparator: (x: T, y: T) => number) {
    return function sorter(list: T[]) {
        return list.sort(comparator)
    }
}

function reverseArgs(fn: Function) {
    return function argsReversed(...args: any[]) {
        return fn(...args.reverse())
    }
}

function compose(...fns: Function[]) {
    return fns.reduceRight(
        function reducer(fn1,fn2) {
            return function composed(...args: any[]) {
                return fn2(fn1(...args))
            }
        }
    )
}

const pipe = reverseArgs(compose)

/**
 * Filter a stream of values monotonically.
 */
export default function Ratchet<T = any>(
    comparator: (x: T, y: T) => number
): (element: T) => Maybe<T> {

    let seen: T | undefined

    return function ratcheter(element: T) {
        return pipe(
            (x: T) => [seen, x],
            filterIn(isNotUndefined),
            sort(comparator),
            unsafeLast,
            (next: T) => next !== seen ? (seen = next, Just(next)) : Nothing
        ) (element)
    }
}
