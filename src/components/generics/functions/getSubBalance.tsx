import moment from 'moment';
import { Round } from './Round';

export default function getSubBalance(subType, val) {
    val = val * subType?.duration;
    const dateDiff = moment(subType?.endDate).diff(
        moment(subType?.startDate),
        'day',
    );
    const daysUsed = moment().diff(moment(subType?.startDate), 'day');
    const usedPricePerDay = subType?.totalAmount / dateDiff;
    const newPricePerDay = val / dateDiff;
    const balanceUnused = subType?.totalAmount - usedPricePerDay * daysUsed;
    const balanceToPay = val - newPricePerDay * daysUsed;
    const finalBalance = Round(balanceToPay - balanceUnused);

    return finalBalance;
}
