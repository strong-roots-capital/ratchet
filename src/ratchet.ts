/**
 * ratchet
 * Filter a stream of values monotonically
 */

import { Ord } from 'fp-ts/lib/Ord'
import { Option, some, none, getOrd } from 'fp-ts/lib/Option'

/**
 * Filter a stream of values monotonically.
 */
export function Ratchet<T>(
    ordering: Ord<T>
): (value: T) => Option<T> {

    let seen: Option<T> = none
    const O = getOrd(ordering)

    return function ratcheter(value: T) {
        const current = some(value)
        return O.compare(current, seen) === 1
            ? (seen = current, current)
            : none
    }
}
