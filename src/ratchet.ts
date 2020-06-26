/**
 * ratchet
 * Filter a stream of values monotonically
 */

import { Ord } from 'fp-ts/lib/Ord'
import { sort } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/pipeable'
import { Option, some, none } from 'fp-ts/lib/Option'

function isNotUndefined<T>(value: T | undefined): value is T {
    return value !== undefined
}

const unsafeLast = <T>(list: T[]): T => list[list.length-1]

/**
 * Filter a stream of values monotonically.
 */
export function Ratchet<T>(
    ordering: Ord<T>
): (value: T) => Option<T> {

    let seen: T | undefined

    return function ratcheter(value: T) {
        return pipe(
            [seen, value],
            values => values.filter(isNotUndefined),
            sort(ordering),
            unsafeLast,
            (next) => seen === undefined || !ordering.equals(seen, next)
                ? (seen = next, some(next))
                : none
        )
    }
}
