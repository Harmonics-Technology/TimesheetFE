export const convertYesNo = (input) => {
    if (input === true || input === 'Yes') {
        return true;
    } else if (input === false || input === 'No') {
        return false;
    }
    return null;
};
