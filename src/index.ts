import { ArrayOf, Enum, InternalType, OneOf, Struct, Tuple, Type, Validator } from './types/types.d';

enum TypeLabel {
    InternalType = 'InternalType',
    Struct = 'Struct',
    ArrayOf = 'ArrayOf',
    Enum = 'Enum',
    OneOf = 'OneOf',
    Tuple = 'Tuple',
    Literal = 'Literal'
}

const typeLabelMap: { [key: string]: any } = {
    internal: TypeLabel.InternalType,
    struct: TypeLabel.Struct,
    array: TypeLabel.ArrayOf,
    enum: TypeLabel.Enum,
    oneOf: TypeLabel.OneOf,
    tuple: TypeLabel.Tuple,
    literal: TypeLabel.Literal
};

function isValidType(value: Type & { [key: string]: any }): boolean {
    return Object.keys(typeLabelMap).some(key => value[key] !== undefined);
}

function typeObtainValue(value: Type & { [key: string]: any }): { type: string, value: any } {
    if (!isValidType(value)) {
        const invalidProperties = Object.keys(value).filter(key => !Object.keys(typeLabelMap).includes(key));
        consoleApplied.error('Invalid type', typeof value, invalidProperties);
        throw new Error('Invalid type');
    }

    for (const key of Object.keys(typeLabelMap)) {
        if (value[key] !== undefined) {
            return {
                type: typeLabelMap[key],
                value: value[key]
            };
        }
    }

    throw new Error('Invalid type');
}

export function oneOf(...types: [Type, Validator[]][]): Type {
    if (types.length === 0) {
        consoleApplied.error('Empty oneOf');
        throw new Error('Empty oneOf');
    }
    
    return {
        oneOf: {
            types: types.map(([type]) => type),
            validators: types.flatMap(([, validators]) => validators || [])
        }
    };
}

export function enumerable(...values: string[]): Type {
    if (values.length === 0) {
        consoleApplied.error('Empty enum');
        throw new Error('Empty enum');
    }

    const uniqueValues = new Set(values);
    if (uniqueValues.size !== values.length) {
        consoleApplied.error('Duplicate enum value');
        throw new Error('Duplicate enum value');
    }

    return {
        enum: {
            values
        }
    };
}

export function struct(...properties: [string, Type, Validator[]][]): Type {
    if (properties.length === 0) {
        consoleApplied.error('Empty struct');
        throw new Error('Empty struct');
    }

    const uniqueProperties = new Set(properties.map(([name]) => name));
    if (uniqueProperties.size !== properties.length) {
        consoleApplied.error('Duplicate struct property');
        throw new Error('Duplicate struct property');
    }

    return {
        struct: {
            properties: properties.map(([name, type]) => [name, type]),
            validators: properties.map(([name, , validators]) => [name, validators || []])
        }
    };
}

export function array(type: Type, validators: Validator[] = []): Type {
    return {
        array: {
            type,
            validators
        }
    };
}

export function tuple(types: [Type, Validator[]][], validators: Validator[]): Type {
    return {
        tuple: {
            values: types,
            length: types.length,
            validators: validators || []
        }
    }
}

function numberAccuracy(value: number, accuracy: number): boolean {
    const accuracyDecimal = Math.pow(10, accuracy);
    return Math.round(value * accuracyDecimal) / accuracyDecimal <= value;
}

function throwIfFalse(condition: boolean, message: string) {
    if (!condition) {
        consoleApplied.error(message);
        throw new Error(message);
    }
}

let consoleApplied: { [K in keyof Console]: Console[K] } = console;

export const logger = {
    extend: <T extends Partial<Console>>(logger: T): void => {
        consoleApplied = logger as { [K in keyof Console]: Console[K] };
    },
    reset: (): void => {
        consoleApplied = console;
    }
};

export function t(arg: Type): { new: <T>(value: T) => T, type: Type } {
    const ty = typeObtainValue(arg);

    const fnValue: <T>(value: T) => T = <T>(value: T) => {
        switch (ty.type) {
            case TypeLabel.InternalType:
                return validateInternalType(value, ty.value);
            case TypeLabel.Tuple:
                if (!Array.isArray(value)) {
                    consoleApplied.error('Invalid tuple', value);
                    throw new Error('Invalid tuple');
                }
                return validateTuple(value, ty.value);
            case TypeLabel.Struct:
                return validateStruct(value, ty.value);
            case TypeLabel.ArrayOf:
                return validateArray(value, ty.value);
            case TypeLabel.Enum:
                return validateEnum(value, ty.value);
            case TypeLabel.OneOf:
                return validateOneOf(value, ty.value);
            case TypeLabel.Literal:
                return validateLiteral(value, ty.value);
            default:
                consoleApplied.error("Invalid type", ty.type);
                throw new Error('Invalid type');
        }
    };

    return {
        new: fnValue,
        type: arg
    };
}

function validateInternalType<T>(value: T, [internalType, validators]: [InternalType, Validator[]]): T {
    for (const [type, error] of validators) {
        if (!type(value)) {
            consoleApplied.error(error, value);
            throw new Error(error);
        }
    }

    switch (internalType) {
        case 'String':
            throwIfFalse(typeof value === 'string', 'Invalid string');
            break;
        case 'Integer':
            throwIfFalse(typeof value === 'number' && Number.isInteger(value), "Invalid integer");
            break;
        case 'Double':
            throwIfFalse(typeof value === 'number' && !Number.isInteger(value) && numberAccuracy(value, 2), "Invalid double");
            break;
        case 'Long':
            throwIfFalse(typeof value === 'number' && !Number.isInteger(value), "Invalid long");
            break;
        case 'Null':
            throwIfFalse(value === null, "Invalid null");
            break;
        case 'Undefined':
            throwIfFalse(typeof value === 'undefined', "Invalid undefined");
            break;
        case 'Boolean':
            throwIfFalse(typeof value === 'boolean', "Invalid boolean");
            break;
        default:
            consoleApplied.error("Invalid internal type", internalType);
            throw new Error('Invalid internal type');
    }

    return value;
}

function validateTuple<T extends any[][]>(value: T, tyValue: Tuple): T {
    if (!Array.isArray(value)) {
        consoleApplied.error('Invalid tuple', value);
        throw new Error('Invalid tuple');
    }

    if (tyValue.values.length === 0) {
        consoleApplied.error('Forged tuple', 'Empty tuple', value);
        throw new Error('Empty tuple');
    }

    for (const i in value) {
        const tv = value[i];

        if (!Array.isArray(tv)) {
            consoleApplied.error('Invalid tuple value', tv);
            throw new Error('Invalid tuple value');
        }
        if (tyValue.length === 0) {
            consoleApplied.error('Forged tuple', 'Empty tuple value', tv);
            throw new Error('Empty tuple value');
        }
        if (tv.length !== tyValue.length) {
            consoleApplied.error('Invalid tuple value', tv);
            throw new Error('Invalid tuple value');
        }

        for (let i = 0; i < tyValue.length; i++) {
            t(tyValue.values[i][0]).new(tv[i]);

            for (const [validator, error] of tyValue.values[i][1]) {
                if (!validator(tv[i])) {
                    consoleApplied.error(error, tv);
                    throw new Error(error);
                }
            }
        }
    }

    for (const [validator, error] of tyValue.validators) {
        if (!validator(value)) {
            consoleApplied.error(error, value);
            throw new Error(error);
        }
    }

    return value;
}

function validateStruct<T>(value: T, tyValue: Struct): T {
    if (typeof value !== 'object' || value === null) {
        consoleApplied.error('Invalid struct', value);
        throw new Error('Invalid struct');
    }

    if (Object.keys(value).length !== tyValue.properties.length) {
        consoleApplied.error('Invalid struct properties', value);
        throw new Error('Invalid struct properties');
    }

    if (tyValue.properties.length === 0) {
        consoleApplied.error('Forged struct', 'Empty struct', value);
        throw new Error('Empty struct');
    }

    const uniqueProperties = new Set(tyValue.properties.map(([name]) => name));
    if (uniqueProperties.size !== tyValue.properties.length) {
        consoleApplied.error('Forged struct', 'Duplicate struct property', value);
        throw new Error('Duplicate struct property');
    }

    const val = value as { [key: string]: any };

    for (const [name, tyx] of tyValue.properties) {
        t(tyx).new(val[name]);
    }

    for (const [name, validators] of tyValue.validators) {
        for (const [type, error] of validators) {
            if (!type(val[name])) {
                consoleApplied.error(error, val[name]);
                throw new Error(error);
            }
        }
    }

    return value;
}

function validateArray<T>(value: T, tyValue: ArrayOf): T {
    if (!Array.isArray(value)) {
        consoleApplied.error('Invalid array', value);
        throw new Error('Invalid array');
    }

    if (tyValue.type === undefined) {
        consoleApplied.error('Forged array', 'Array of no type', value);
        throw new Error('Array of no type');
    }

    for (const item of value) {
        t(tyValue.type).new(item);
    }

    for (const [type, error] of tyValue.validators) {
        if (!type(value)) {
            consoleApplied.error(error, value);
            throw new Error(error);
        }
    }

    return value;
}

function validateEnum<T>(value: T, tyValue: Enum): T {
    if (typeof value !== 'string') {
        consoleApplied.error('Invalid enum', value);
        throw new Error('Invalid enum');
    }
    
    const uniqueValues = new Set(tyValue.values);
    if (uniqueValues.size !== tyValue.values.length) {
        consoleApplied.error('Forged enum', 'Duplicate enum value');
        throw new Error('Duplicate enum value');
    }

    if (tyValue.values.length === 0) {
        consoleApplied.error('Forged enum', 'Empty enum');
        throw new Error('Empty enum');
    }

    if (tyValue.values.includes(value as string)) {
        return value;
    }

    consoleApplied.error('Invalid enum value', value);
    throw new Error('Invalid enum value');
}

function validateOneOf<T>(value: T, tyValue: OneOf): T {
    if (tyValue.types.length === 0) {
        consoleApplied.error('Forged oneOf', 'Empty oneOf', value);
        throw new Error('Empty oneOf');
    }

    for (const type of tyValue.types) {
        try {
            t(type).new(value);
            for (const [validator, error] of tyValue.validators) {
                if (!validator(value)) {
                    consoleApplied.error(error, value);
                    throw new Error(error);
                }
            }
            return value;
        } catch {
            continue;
        }
    }

    consoleApplied.error('Invalid oneOf value', value);
    throw new Error('Invalid oneOf value');
}

function validateLiteral<T>(value: T, literalValue: any): T {
    if (value !== literalValue) {
        consoleApplied.error('Invalid literal', value);
        throw new Error('Invalid literal');
    }
    return value;
}