export function calculatePer(divisor, divider) {
    const value = ((divisor || 0) / (divider || 0)) * 100;
    return isNaN(value) ? 0 : value;
}
