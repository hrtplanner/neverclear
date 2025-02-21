import { doesNotThrow, throws } from 'assert';
import { t, enumerable, tuple, oneOf } from '../src';
import { validator, literal, value } from '../src/types';
import { Seq } from '../src/validators';

import { it, describe, beforeAll } from "bun:test";
import { applyLogger } from './common';

beforeAll(applyLogger);

describe("Tuples", () => {
    it("Should work with validators (throws on invalid value)", () => {
        console.trace();

        const HelloWorld = t(
            tuple(
                [
                    value(
                        literal("Hello1")
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
                ],
                []
            )
        );

        throws(() => HelloWorld.new([
            ["Hello1", "I"]
        ]));
    });

    it("Should work without validators", () => {
        const HelloWorld = t(
            tuple(
                [
                    value(
                        literal("Hello2")
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
                ],
                []
            )
        );

        doesNotThrow(() => HelloWorld.new([
            ["Hello2", "World"]
        ]));
    });

    it("Should work with Tuple Seq validators", () => {
        const of = [
            value(
                literal("Hello3")
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
        ];

        const Sequence = t(
            tuple(
                [
                    value(
                        oneOf(...of)
                    )
                ],
                [
                    Seq(...of)
                ]
            )
        );

        doesNotThrow(() => Sequence.new([
            ["Hello3"],
            ["World"]
        ]));

        throws(() => Sequence.new([
            ["Hello3"],
            ["World", "Hello3"]
        ]));
    });
});