var TypeLabel;
(function (TypeLabel) {
    TypeLabel["InternalType"] = "InternalType";
    TypeLabel["Struct"] = "Struct";
    TypeLabel["ArrayOf"] = "ArrayOf";
    TypeLabel["Enum"] = "Enum";
    TypeLabel["OneOf"] = "OneOf";
    TypeLabel["Tuple"] = "Tuple";
    TypeLabel["Literal"] = "Literal";
})(TypeLabel || (TypeLabel = {}));
const typeLabelMap = {
    internal: TypeLabel.InternalType,
    struct: TypeLabel.Struct,
    array: TypeLabel.ArrayOf,
    enum: TypeLabel.Enum,
    oneOf: TypeLabel.OneOf,
    tuple: TypeLabel.Tuple,
    literal: TypeLabel.Literal
};
function isValidType(value) {
    return Object.keys(typeLabelMap).some(key => value[key] !== undefined);
}
function typeObtainValue(value) {
    if (!isValidType(value)) {
        consoleApplied.error('Invalid type');
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
export function oneOf(...types) {
    if (types.length === 0) {
        consoleApplied.error('Empty oneOf');
        throw new Error('Empty oneOf');
    }
    return {
        types: types.map(([type]) => type),
        validators: types.flatMap(([_, validators]) => validators || [])
    };
}
export function enumerable(...values) {
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
export function struct(...properties) {
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
            validators: properties.map(([name, _, validators]) => [name, validators || []])
        }
    };
}
export function array(type, validators = []) {
    return {
        array: {
            type,
            validators
        }
    };
}
export function tuple(length, ...types) {
    if (length !== types.length) {
        consoleApplied.error('Invalid tuple length', length, types.length);
        throw new Error('Invalid tuple length');
    }
    return {
        tuple: {
            tuple: types,
            length,
        }
    };
}
function numberAccuracy(value, accuracy) {
    const accuracyDecimal = Math.pow(10, accuracy);
    return Math.round(value * accuracyDecimal) / accuracyDecimal <= value;
}
function throwIfFalse(condition, message) {
    if (!condition) {
        consoleApplied.error(message);
        throw new Error(message);
    }
}
let consoleApplied = console;
export const logger = {
    extend: (logger) => {
        consoleApplied = logger;
    },
    reset: () => {
        consoleApplied = console;
    }
};
export function t(arg) {
    const ty = typeObtainValue(arg);
    const fnValue = (value) => {
        switch (ty.type) {
            case TypeLabel.InternalType:
                return validateInternalType(value, ty.value);
            case TypeLabel.Tuple:
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
function validateInternalType(value, [internalType, validators]) {
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
function validateTuple(value, tyValue) {
    if (!Array.isArray(value)) {
        consoleApplied.error('Invalid tuple', value);
        throw new Error('Invalid tuple');
    }
    if (value.length !== tyValue.length) {
        consoleApplied.error('Invalid tuple length', value.length, tyValue.length);
        throw new Error('Invalid tuple length');
    }
    if (tyValue.tuple.length === 0) {
        consoleApplied.error('Forged tuple', 'Empty tuple', value);
        throw new Error('Empty tuple');
    }
    for (let i = 0; i < value.length; i++) {
        t(tyValue.tuple[i][0]).new(value[i]);
        for (const [type, error] of tyValue.tuple[i][1]) {
            if (!type(value[i])) {
                consoleApplied.error(error, value[i]);
                throw new Error(error);
            }
        }
    }
    return value;
}
function validateStruct(value, tyValue) {
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
    const val = value;
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
function validateArray(value, tyValue) {
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
function validateEnum(value, tyValue) {
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
    if (tyValue.values.includes(value)) {
        return value;
    }
    consoleApplied.error('Invalid enum value', value);
    throw new Error('Invalid enum value');
}
function validateOneOf(value, tyValue) {
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
        }
        catch (e) {
            continue;
        }
    }
    consoleApplied.error('Invalid oneOf value', value);
    throw new Error('Invalid oneOf value');
}
function validateLiteral(value, literalValue) {
    if (value !== literalValue) {
        consoleApplied.error('Invalid literal', value);
        throw new Error('Invalid literal');
    }
    return value;
}
