export default function getBusinessDateCount(startDate, endDate) {
    let elapsed;
    // , daysBeforeFirstSaturday, daysAfterLastSunday,daysBeforeFirstSunday;
    const ifThen = function (a, b, c) {
        return a == b ? c : a;
    };

    elapsed = endDate - startDate;
    elapsed /= 86400000;

    const daysBeforeFirstSunday = (7 - startDate.getDay()) % 7;
    const daysAfterLastSunday = endDate.getDay();

    elapsed -= daysBeforeFirstSunday + daysAfterLastSunday;
    elapsed = (elapsed / 7) * 5;
    elapsed +=
        ifThen(daysBeforeFirstSunday - 1, -1, 0) +
        ifThen(daysAfterLastSunday, 6, 5);

    // console.log({ elapsed });

    return Math.round(elapsed);
}
