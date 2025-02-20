function objectJoin(obj1, obj2) {
    return Object.keys(obj2).reduce((acc, key) => {
        if (acc[key] === undefined) {
            return { ...acc, [key]: obj2[key] };
        }
        else if (typeof obj2[key] === 'object' && !Array.isArray(obj2[key])) {
            return { ...acc, [key]: objectJoin(acc[key], obj2[key]) };
        }
        return { ...acc, [key]: obj2[key] };
    }, { ...obj1 });
}
function applyTraitInternal(...traits) {
    return (obj) => {
        let result = obj;
        for (const trait of traits) {
            result = objectJoin(result, trait(obj));
        }
        return result;
    };
}
export function applyTraits(...traits) {
    return applyTraitInternal(...traits);
}
export function EnumTrait(obj) {
    return {
        ...obj,
        values: obj.type.enum.values,
        keyAt(index) {
            return obj.type.enum.values[index];
        },
        indexOf(value) {
            return obj.type.enum.values.indexOf(value);
        }
    };
}
