import { doesNotThrow, throws } from 'assert';
import { t, enumerable, tuple } from '../src';
import { validator, literal, value } from '../src/types';

import { it, describe, beforeAll } from "bun:test";
import { applyLogger } from './common';

beforeAll(applyLogger);

describe("Tuples", () => {
    it("Should work with validators (throws on invalid value)", () => {
        const HelloWorld = t(
            tuple(
                2,
                value(
                    literal("Hello")
                ),
                value(
                    enumerable(
                        "Hello",
                        "World",
                        "I",
                        "Am",
                        "Here"
                    ),
                    [
                        validator(
                            (value) => value !== "I",
                            "Value must not be 'I'"
                        )
                    ]
                )
            )
        );

        throws(() => HelloWorld.new(
            ["Hello", "I"]
        ));
    });

    it("Should work without validators", () => {
        const HelloWorld = t(
            tuple(
                2,
                value(
                    literal("Hello")
                ),
                value(
                    enumerable(
                        "Hello",
                        "World",
                        "I",
                        "Am",
                        "Here"
                    )
                )
            )
        );

        doesNotThrow(() => HelloWorld.new(
            ["Hello", "World"]
        ));
    });
});