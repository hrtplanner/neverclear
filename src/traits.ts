import { Enum, Type } from "./types/types";

export type TraitApplicable<T> = {
    type: Type & T;
    new: <T>(_: T) => T
};

export type Trait<K extends TraitApplicable<K>, V extends Obj> =
    (value: K) => K & V;

export type ApplyTraits<
    V extends TraitApplicable<any>,
    T extends Trait<V, any>
    > = T extends Trait<V, infer R> ? R : never;

type Obj = { [key: string]: any };

function objectJoin<T extends Obj, V extends Obj>(obj1: T, obj2: V): T & V {
    return Object.keys(obj2).reduce((acc, key) => {
        if (acc[key] === undefined) {
            return { ...acc, [key]: obj2[key] };
        } else if (typeof obj2[key] === 'object' && !Array.isArray(obj2[key])) {
            return { ...acc, [key]: objectJoin(acc[key], obj2[key]) };
        }
        return { ...acc, [key]: obj2[key] };
    }, { ...obj1 } as T & V);
}

function applyTraitInternal<T extends TraitApplicable<any>, V extends Obj>(...traits: Trait<T, V>[]): (obj: T) => T & V {
    return (obj: T) => {
        let result = obj as T & V;
        for (const trait of traits) {
            result = objectJoin(result, trait(obj));
        }
        return result;
    }
}

export function applyTraits<T extends TraitApplicable<any>, V extends Obj>(...traits: Trait<T, V>[]): (obj: T) => T & V {
    return applyTraitInternal(...traits);
}

export function EnumTrait<T extends TraitApplicable<{ enum: Enum }>>(obj: T): T & {
    values: string[],
    keyAt: (index: number) => string,
    indexOf: (value: string) => number
} {
    return {
        ...obj,
        values: obj.type.enum.values,
        keyAt(index: number): string {
            return obj.type.enum.values[index];
        },
        indexOf(value: string): number {
            return obj.type.enum.values.indexOf(value);
        }
    }
}