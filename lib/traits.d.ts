import { Enum, Type } from "./types/types";
export type TraitApplicable<T> = {
    type: Type & T;
    new: <T>(_: T) => T;
};
export type Trait<K extends TraitApplicable<K>, V extends Obj> = (value: K) => K & V;
export type ApplyTraits<V extends TraitApplicable<any>, T extends Trait<V, any>> = T extends Trait<V, infer R> ? R : never;
type Obj = {
    [key: string]: any;
};
export declare function applyTraits<T extends TraitApplicable<any>, V extends Obj>(...traits: Trait<T, V>[]): (obj: T) => T & V;
export declare function EnumTrait<T extends TraitApplicable<{
    enum: Enum;
}>>(obj: T): T & {
    values: string[];
    keyAt: (index: number) => string;
    indexOf: (value: string) => number;
};
export {};
