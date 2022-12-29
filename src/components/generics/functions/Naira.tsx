export default function Naira(value: string | null | undefined | number) {
    return `₦ ${value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}
export function CAD(value: string | null | undefined | number) {
    return `$ ${value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}
