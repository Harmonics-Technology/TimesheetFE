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
