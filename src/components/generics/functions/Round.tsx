export const Round = (num: any) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};
