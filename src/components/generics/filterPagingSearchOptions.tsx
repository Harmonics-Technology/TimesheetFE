import moment from 'moment';

export const filterPagingSearchOptions = (ctx: any) => {
    console.log({ ctx: ctx.query });

    const { limit, offset, search, from, to, paySlipFilter, chartYear } =
        ctx.query;
    const options = {
        limit: limit ? limit : 10,
        shiftLimit: limit ? limit : 5,
        offset: offset ? offset : 0,
        search: search ? search : '',
        from: from ? from : '',
        to: to ? to : '',
        paySlipFilter: paySlipFilter ? paySlipFilter : '',
        chartYear: chartYear ? chartYear : moment(new Date()).format('YYYY'),
    };
    console.log({ options });
    return options;
};
