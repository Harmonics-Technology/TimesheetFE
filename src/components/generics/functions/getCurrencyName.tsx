import currencyCodes from 'currency-codes';
import getSymbolFromCurrency from 'currency-symbol-map';

export const getCurrencyName = (abv: any) => {
    const currencyName = abv ? currencyCodes.code(abv)?.currency : '';
    return currencyName;
};
export const getCurrencySymbol = (abv: any) => {
    const currencyName = abv ? getSymbolFromCurrency(abv) : '';
    return currencyName;
};

export const onBoardingFees = (watch?: any) => {
    return [
        {
            name: 'Flat Fee',
            id: 'fixedamount',
            prefix: getCurrencySymbol(watch('currency')),
        },
        {
            name: 'Percentage',
            id: 'percentage',
            prefix: '%',
        },
    ];
};
export const getPrefix = (value: string, watch: any) => {
    const pre = onBoardingFees(watch)?.find((x) => x.id == value)?.prefix;
    return pre;
};
