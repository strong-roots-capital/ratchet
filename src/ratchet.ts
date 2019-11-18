/**
 * ratchet
 * Filter a stream of values monotonically
 */

import { Maybe, Just, Nothing } from 'purify-ts/Maybe'

/* Note: the few wonky type-assertions stem from this package, or the use thereof */
import { Pipe } from 'ts-functionaltypes'

const pipe: Pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);


interface Filterable<T> {
    filter(f: (element: T) => boolean): T[];
}

function isNotUndefined<T>(value: T | undefined): value is T {
    return value !== undefined
}

function unsafeLast<T>(list: T[]): T {
    return list[list.length-1]
}

function filterIn<T>(
    f: (element: T) => boolean
): (filterable: Filterable<T>) => T[] {
    return function filterer(filterable) {
        return filterable.filter(f)
    }
}

function sort<T>(
    comparator: (x: T, y: T) => number
): (list: unknown[]) => T[] {
    return function sorter(list) {
        return (list as T[]).sort(comparator)
    }
}


/**
 * Filter a stream of values monotonically.
 */
export default function Ratchet<T>(
    comparator: (x: T, y: T) => number,
    equality: (x: T, y: T) => boolean = (x, y) => x === y
): (element: T) => Maybe<T> {

    let seen: T | undefined

    return function ratcheter(element: T) {
        return pipe(
            (x: T) => [seen, x],
            filterIn(isNotUndefined),
            sort(comparator),
            unsafeLast,
            (next) => seen === undefined || !equality(seen, next) ? (seen = next, Just(next)) : Nothing
        ) (element)
    }
}
