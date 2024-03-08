export function getUniqueListBy(arr: any[], key: string) {
    return [...new Map(arr.map((item: any) => [item[key], item])).values()];
}
