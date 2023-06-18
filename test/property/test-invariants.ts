import test from "node:test";
import { strict as assert } from "node:assert";

import fc from "fast-check";
import { pipe } from "fp-ts/function";
import { Ord as ordNumber } from "fp-ts/number";
import { Ord as ordString } from "fp-ts/string";
import { map } from "fp-ts/Option";

/**
 * Library under test
 */

import { Ratchet } from "../../src/ratchet";

test("should yield monotonically-changing values", () => {
  fc.assert(
    fc.property(fc.array(fc.integer()), (xs) => {
      const input = xs.concat(xs);
      const output: number[] = [];

      const ratchet = Ratchet(ordNumber);
      input.forEach((x) => {
        pipe(
          ratchet(x),
          map((x) => output.push(x))
        );
      });

      output.forEach((_, index, self) => {
        if (index + 1 === self.length) {
          return;
        }
        assert.ok(self[index] < self[index + 1]);
      });
      // in case output is empty
      assert.ok(true);
    }),
    {
      verbose: true,
    }
  );
});

test("should yield monotonically-changing values of any type", () => {
  fc.assert(
    fc.property(fc.array(fc.string()), (xs) => {
      const input = xs.concat(xs);
      const output: string[] = [];

      const ratchet = Ratchet(ordString);
      input.forEach((x) => {
        pipe(
          ratchet(x),
          map((x) => output.push(x))
        );
      });

      output.forEach((_, index, self) => {
        if (index + 1 === self.length) {
          return;
        }
        assert.ok(ordString.compare(self[index], self[index + 1]) < 0);
      });
      // in case output is empty
      assert.ok(true);
    }),
    {
      verbose: true,
    }
  );
});

test("should only yield values passed in", () => {
  fc.assert(
    fc.property(fc.array(fc.string()), (xs) => {
      const input = xs.concat(xs);
      const output: string[] = [];

      const ratchet = Ratchet(ordString);
      input.forEach((x) => {
        pipe(
          ratchet(x),
          map((x) => output.push(x))
        );
      });

      output.forEach((element) => {
        assert.ok(input.includes(element));
      });
      // in case output is empty
      assert.ok(true);
    }),
    {
      verbose: true,
    }
  );
});

test("should not yield duplicates", () => {
  fc.assert(
    fc.property(fc.array(fc.string()), (xs) => {
      const input = xs.concat(xs);
      const output: string[] = [];

      const ratchet = Ratchet(ordString);
      input.forEach((x) => {
        pipe(
          ratchet(x),
          map((x) => output.push(x))
        );
      });

      output.forEach((element, index, self) => {
        assert.equal(self.indexOf(element), index);
      });
      // in case output is empty
      assert.ok(true);
    }),
    {
      verbose: true,
    }
  );
});
