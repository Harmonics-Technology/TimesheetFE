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
        if (num < 20 && num > 10) return teens[num - 11]; // Corrected indexing for teens
        if (num < 100)
            return (
                tens[Math.floor(num / 10)] +
                (num % 10 !== 0 ? ' ' + ones[num % 10] : '')
            );
        if (num < 1000)
            return (
                ones[Math.floor(num / 100)] +
                ' hundred' +
                (num % 100 !== 0 ? ' and ' + numToString(num % 100) : '')
            );
        for (let i = thousands.length - 1; i >= 0; i--) {
            const divisor = Math.pow(1000, i);
            if (num >= divisor) {
                return (
                    numToString(Math.floor(num / divisor)) +
                    ' ' +
                    thousands[i] +
                    (num % divisor !== 0
                        ? ' ' + numToString(num % divisor)
                        : '')
                );
            }
        }
    };

    return numToString(number).trim();
}

export function numberToWordsWithCurrency(number, currency) {
    const words = numberToWords(number);
    return `${words} ${getCurrencyName(currency)} only`;
}
