export default function validateEmail(valueToValidate: any) {
    const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isValidEmail = valueToValidate?.toString().match(validRegex)
        ? true
        : false;
    return isValidEmail;
}
