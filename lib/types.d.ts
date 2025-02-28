import { Type, Validator, ValidatorBuilt } from "./types/types.d";
export declare function int(validators?: Validator[]): Type;
export declare function double(validators?: Validator[]): Type;
export declare function long(validators?: Validator[]): Type;
export declare function string(validators?: Validator[]): Type;
export declare function bool(validators?: Validator[]): Type;
export declare function nil(validators?: Validator[]): Type;
export declare function undef(validators?: Validator[]): Type;
export declare function literal<T>(value: T): Type;
export declare function property(name: string, type: Type, validators?: Validator[]): [string, Type, Validator[]];
export declare function value(type: Type, validators?: Validator[]): [Type, Validator[]];
export declare function opt(type: Type, validators?: Validator[]): Type;
export declare function validator(val: ValidatorBuilt, error: string): Validator;
