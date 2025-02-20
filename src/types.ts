import { InternalType, Type, Validator, ValidatorBuilt } from "./types/types.d";

export function int(validators: Validator[] = []): Type {
    return {
        internal: [InternalType.integer, validators]
    };
}

export function double(validators: Validator[] = []): Type {
    return {
        internal: [InternalType.double, validators]
    };
}

export function long(validators: Validator[] = []): Type {
    return {
        internal: [InternalType.long, validators]
    };
}

export function string(validators: Validator[] = []): Type {
    return {
        internal: [InternalType.string, validators]
    };
}

export function bool(validators: Validator[] = []): Type {
    return {
        internal: [InternalType.boolean, validators]
    };
}

export function nil(validators: Validator[] = []): Type {
    return {
        internal: [InternalType.null, validators]
    };
}

export function undef(validators: Validator[] = []): Type {
    return {
        internal: [InternalType.undefined, validators]
    };
}

export function literal<T>(value: T): Type {
    return {
        literal: value,

    };
}

// Helpers

export function property(name: string, type: Type, validators: Validator[] = []): [string, Type, Validator[]] {
    return [name, type, validators];
}

export function value(type: Type, validators: Validator[] = []): [Type, Validator[]] {
    return [type, validators];
}

// Syntactical sugar that extends oneOf.
export function opt(type: Type, validators: Validator[] = []): Type {
    return {
        oneOf: {
            types: [type, undef()],
            validators
        }
    };
}

export function validator(val: ValidatorBuilt, error: string): Validator {
    return [val, error];
}