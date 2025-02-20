import { doesNotThrow, throws } from 'assert';
import { t, struct } from '../src';
import { string, property, validator } from '../src/types';

import { it, describe, beforeAll } from "bun:test";
import { applyLogger } from './common';

beforeAll(applyLogger);

describe("Structures", () => {
    it("Should work with validators (throws on invalid property)", () => {
        const Hello = t(
            struct(
                property("test", string(), [
                    validator(
                        (value) => value === "hello",
                        "Value must be 'hello'"
                    )
                ])
            )
        );

        throws(() => Hello.new({
            test: "world"
        }));

        doesNotThrow(() => Hello.new({
            test: "hello"
        }));
    });

    it("Should work without validators", () => {
        const Hello = t(
            struct(
                property("test", string())
            )
        );

        doesNotThrow(() => Hello.new({
            test: "hello"
        }));
    });
});