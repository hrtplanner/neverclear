import { t } from ".";
/**
 * Returns a validator that checks if the value (number, string-length, array-length) is within the range of min and max
 * @param min Start of the range
 * @param max End of the range
 * @returns Validator function
 */
const Range = (min, max) => {
    return [(value) => {
            if (typeof value === "string") {
                return value.length >= min && value.length <= max;
            }
            else if (Array.isArray(value)) {
                return value.length >= min && value.length <= max;
            }
            else {
                return value >= min && value <= max;
            }
        }, "Value not in range " + min + ".." + max];
};
/**
 * Returns a validator that checks if the value is precise to the number of decimal places
 * @param accuracy Number of decimal places to check
 * @returns Validator function
 */
const Accuracy = (accuracy) => {
    return [(value) => {
            const accuracyDecimal = Math.pow(10, accuracy);
            return Math.round(value * accuracyDecimal) / accuracyDecimal === value;
        }, "Value not accurate to " + accuracy + " decimal places"];
};
/**
 * Returns a validator that checks if the value matches the regular expression
 * @param regex Regular expression to match the value against
 * @returns Validator function
 */
const RegEx = (regex) => {
    return [(value) => regex.test(value), "Value does not match regular expression"];
};
/**
 * Returns a validator that checks if the value is a sequence of types
 * @param types Array of types to check against (aimed to be a constant array of types also used in a oneOf type in tuples).
 * @returns Validator function
 */
const Seq = (...types) => {
    return [
        (value) => {
            if (!Array.isArray(value)) {
                return false;
            }
            if (value.length !== types.length) {
                return false;
            }
            for (let i = 0; i < value.length; i++) {
                let unraveled = value[i];
                if (unraveled.length === 1) {
                    unraveled = unraveled[0];
                }
                try {
                    t(types[i][0]).new(unraveled);
                    for (const validator of types[i][1]) {
                        if (!validator[0](unraveled)) {
                            return false;
                        }
                    }
                }
                catch {
                    return false;
                }
            }
            return true;
        },
        "Value does not match sequence"
    ];
};
export { Range, Accuracy, RegEx, Seq };
