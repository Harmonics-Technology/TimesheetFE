export const filterPagingSearchOptions = (ctx: any) => {
    console.log({ ctx: ctx.query });

    const { limit, offset, search, from, to, paySlipFilter } = ctx.query;
    const options = {
        limit: limit ? limit : 10,
        offset: offset ? offset : 0,
        search: search ? search : '',
        from: from ? from : '',
        to: to ? to : '',
        paySlipFilter: paySlipFilter ? paySlipFilter : '',
    };
    console.log({ options });
    return options;
};
