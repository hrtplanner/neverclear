import { InternalType } from "./types/types.d";
export function int(validators = []) {
    return {
        internal: [InternalType.integer, validators]
    };
}
export function double(validators = []) {
    return {
        internal: [InternalType.double, validators]
    };
}
export function long(validators = []) {
    return {
        internal: [InternalType.long, validators]
    };
}
export function string(validators = []) {
    return {
        internal: [InternalType.string, validators]
    };
}
export function bool(validators = []) {
    return {
        internal: [InternalType.boolean, validators]
    };
}
export function nil(validators = []) {
    return {
        internal: [InternalType.null, validators]
    };
}
export function undef(validators = []) {
    return {
        internal: [InternalType.undefined, validators]
    };
}
export function literal(value) {
    return {
        literal: value,
    };
}
// Helpers
export function property(name, type, validators = []) {
    return [name, type, validators];
}
export function value(type, validators = []) {
    return [type, validators];
}
// Syntactical sugar that extends oneOf.
export function opt(type, validators = []) {
    return {
        oneOf: {
            types: [type, undef()],
            validators
        }
    };
}
export function validator(val, error) {
    return [val, error];
}
