export enum InternalType {
    string = 'String',
    boolean = 'Boolean',

    integer = 'Integer',
    double = 'Double',
    long = 'Long',

    null = 'Null',
    undefined = 'Undefined'
}

export type ValidatorFunction<T = any> = (...args: T[]) => Validator;
export type ValidatorBuilt = (value: any) => boolean;
export type Validator = [ValidatorBuilt, string];

export interface Struct {
    properties: [string, Type][];
    validators: [string, Validator[]][];
}

export interface ArrayOf {
    type: Type;
    validators: Validator[];
}

export interface Enum {
    values: string[];
}

export interface OneOf {
    types: Type[];
    validators: Validator[];
}

export interface Tuple {
    tuple: [Type, Validator[]][];
    length: number;
}

export interface Type {
    internal?: [InternalType, Validator[]];
    struct?: Struct;
    array?: ArrayOf;
    enum?: Enum;
    oneOf?: OneOf;
    literal?: any;
    tuple?: Tuple;
}