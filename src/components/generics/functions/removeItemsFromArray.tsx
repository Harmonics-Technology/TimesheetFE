export function removeItemsFromArray(array1, array2) {
    const array2Ids = array2?.map((item) => item.id);
    return array1?.filter((item) => !array2Ids?.includes(item.id));
}
