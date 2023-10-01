import moment from 'moment';

export const filterPagingSearchOptions = (ctx: any) => {
    const {
        limit,
        offset,
        search,
        from,
        to,
        paySlipFilter,
        chartYear,
        clientId,
        status,
    } = ctx.query;
    const options = {
        limit: limit ? limit : 10,
        clientId: clientId,
        shiftLimit: limit ? limit : 5,
        offset: offset ? offset : 0,
        search: search ? search : '',
        from: from,
        to: to,
        status: status,
        paySlipFilter: paySlipFilter ? paySlipFilter : '',
        chartYear: chartYear ? chartYear : moment(new Date()).format('YYYY'),
    };

    return options;
};
