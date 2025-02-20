import { doesNotThrow, throws } from 'assert';
import { t } from '../src';
import { int, double, long } from '../src/types';

import { it, describe, beforeAll } from "bun:test";
import { applyLogger } from './common';

beforeAll(applyLogger);

describe("Number accuracy", () => {
    it("Should work w/ integers (throws on incorrect depth)", () => {
        throws(() => t(int()).new(5.5));
    });

    it("Should work w/ doubles (throws on incorrect depth)", () => {
        throws(() => t(double()).new(5.555));
    });

    it("Should work w/ longs (unlimited depth)", () => {
        doesNotThrow(() => t(long()).new(5.555555));
    });
});