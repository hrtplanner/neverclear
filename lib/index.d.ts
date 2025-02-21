import { Type, Validator } from './types/types.d';
export declare function oneOf(...types: [Type, Validator[]][]): Type;
export declare function enumerable(...values: string[]): Type;
export declare function struct(...properties: [string, Type, Validator[]][]): Type;
export declare function array(type: Type, validators?: Validator[]): Type;
export declare function tuple(types: [Type, Validator[]][], validators: Validator[]): Type;
export declare const logger: {
    extend: <T extends Partial<Console>>(logger: T) => void;
    reset: () => void;
};
export declare function t(arg: Type): {
    new: <T>(value: T) => T;
    type: Type;
};
