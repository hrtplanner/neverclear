import { doesNotThrow, throws } from 'assert';

import { t } from '../src';
import { double } from '../src/types';
import { Range } from '../src/validators';

import { it, describe, beforeAll } from "bun:test";
import { applyLogger } from './common';

beforeAll(applyLogger);

describe("Enumerables", () => {
    it("Should work w/ Range (throws on invalid value)", () => {
        const Double = t(double([
            Range(0.5, 1.5)
        ]));

        doesNotThrow(() => Double.new(1.25));
        throws(() => Double.new(1.75));
    });
});