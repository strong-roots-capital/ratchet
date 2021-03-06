import { Ratchet } from '../src/ratchet'
import { ordNumber } from 'fp-ts/lib/Ord'
import { pipe } from 'fp-ts/lib/pipeable'
import { map } from 'fp-ts/lib/Option'
import randomInt from 'random-int'

const ratchet = Ratchet(ordNumber)

function doTheThing(x: number) {
    pipe(
        ratchet(x),
        map((value: number) => {
            /* safely do something here with element */
            console.log(x)
        })
    )
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
