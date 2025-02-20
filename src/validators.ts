import { Validator, ValidatorFunction } from "./types/types";

const Range: ValidatorFunction<number> = (min, max): Validator => {
    return [(value: number | string | Array<any>): boolean => {
        if (typeof value === "string") {
            return value.length >= min && value.length <= max;
        } else if (Array.isArray(value)) {
            return value.length >= min && value.length <= max;
        } else {
            return value >= min && value <= max;
        }
    }, "Value not in range " + min + ".." + max];
};

const Accuracy: ValidatorFunction<number> = (accuracy): Validator => {
    return [(value: number): boolean => {
        const accuracyDecimal = Math.pow(10, accuracy);
        return Math.round(value * accuracyDecimal) / accuracyDecimal === value;
    }, "Value not accurate to " + accuracy + " decimal places"];
};

const RegEx: ValidatorFunction<RegExp> = (regex): Validator => {
    return [(value: string): boolean => regex.test(value), "Value does not match regular expression"];
};

export { Range, Accuracy, RegEx };