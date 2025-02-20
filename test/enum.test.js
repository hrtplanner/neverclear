import { doesNotThrow, throws } from 'assert';
import { t, enumerable } from '../src';
import { applyTraits, EnumTrait } from '../src/traits';

import { it, describe, beforeAll } from "bun:test";
import { applyLogger } from './common';

beforeAll(applyLogger);

describe("Enumerables", () => {
    it("Should work", () => {
        const Hello = applyTraits(EnumTrait)(t(
            enumerable(
                "Hello",
                "World",
                "I",
                "Am",
                "Here"
            )
        ));

        doesNotThrow(() => Hello.new("Hello"));
        doesNotThrow(() => Hello.new("World"));
        throws(() => Hello.new("Not Here"));
    });
});