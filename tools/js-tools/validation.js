export function validateId(id) {
    if (!Number.isInteger(id) || id < 0) throw new Error("ID must be a non-negative integer!");
}

export function validateYear(year) {
    if (!Number.isInteger(year) || year < 0) throw new Error("Year must be a non-negative integer!");
}

export function validateNonNegativeNumber(value, fieldName) {
    if (isNaN(value) || value < 0) throw new Error(`${fieldName} must be a non-negative number!`);
}

export function validateString(value, fieldName) {
    if (typeof value !== "string" || value.trim() === "")
        throw new Error(`${fieldName} must be a non-empty string!`);

    if (/^\d+$/.test(value.trim()))
        throw new Error(`${fieldName} cannot be only numbers!`);
}