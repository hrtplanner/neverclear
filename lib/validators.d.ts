import { Type, Validator, ValidatorFunction } from "./types/types";
/**
 * Returns a validator that checks if the value (number, string-length, array-length) is within the range of min and max
 * @param min Start of the range
 * @param max End of the range
 * @returns Validator function
 */
declare const Range: ValidatorFunction<number>;
/**
 * Returns a validator that checks if the value is precise to the number of decimal places
 * @param accuracy Number of decimal places to check
 * @returns Validator function
 */
declare const Accuracy: ValidatorFunction<number>;
/**
 * Returns a validator that checks if the value matches the regular expression
 * @param regex Regular expression to match the value against
 * @returns Validator function
 */
declare const RegEx: ValidatorFunction<RegExp>;
/**
 * Returns a validator that checks if the value is a sequence of types
 * @param types Array of types to check against (aimed to be a constant array of types also used in a oneOf type in tuples).
 * @returns Validator function
 */
declare const Seq: ValidatorFunction<[Type, Validator[]]>;
export { Range, Accuracy, RegEx, Seq };
