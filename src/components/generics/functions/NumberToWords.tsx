import { getCurrencyName } from './getCurrencyName';

export function numberToWords(number) {
    const ones = [
        '',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
    ];
    const teens = [
        '',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen',
    ];
    const tens = [
        '',
        'ten',
        'twenty',
        'thirty',
        'forty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninety',
    ];
    const thousands = ['', 'thousand', 'million', 'billion', 'trillion'];

    const numToString = (num) => {
        if (num === 0) return '';
        if (num < 10) return ones[num];
        if (num < 20) return teens[num - 10];
        if (num < 100) return tens[Math.floor(num / 10)] + ' ' + ones[num % 10];
        if (num < 1000)
            return (
                ones[Math.floor(num / 100)] +
                ' hundred and ' +
                numToString(num % 100)
            );
        for (let i = 1; i < thousands.length; i++) {
            if (num < Math.pow(1000, i + 1)) {
                return (
                    numToString(Math.floor(num / Math.pow(1000, i))) +
                    ' ' +
                    thousands[i] +
                    ' ' +
                    numToString(num % Math.pow(1000, i))
                );
            }
        }
    };

    return numToString(number);
}
export function numberToWordsWithCurrency(number, currency) {
    const words = numberToWords(number);
    return `${words} ${getCurrencyName(currency)} only`;
}
