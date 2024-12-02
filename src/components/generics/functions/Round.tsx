export const Round = (num: any, floor?: boolean) => {
    const rounded = floor
        ? Math.floor(num)
        : Math.round((num + Number.EPSILON) * 100) / 100;
    return rounded;
};
