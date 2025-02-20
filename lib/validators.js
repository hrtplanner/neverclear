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
const Accuracy = (accuracy) => {
    return [(value) => {
            const accuracyDecimal = Math.pow(10, accuracy);
            return Math.round(value * accuracyDecimal) / accuracyDecimal === value;
        }, "Value not accurate to " + accuracy + " decimal places"];
};
const RegEx = (regex) => {
    return [(value) => regex.test(value), "Value does not match regular expression"];
};
export { Range, Accuracy, RegEx };
