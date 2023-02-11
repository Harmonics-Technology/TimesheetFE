export const filterPagingSearchOptions = (ctx: any) => {
    console.log({ ctx: ctx.query });

    const { limit, offset, search, from, to } = ctx.query;
    const options = {
        limit: limit ? limit : 10,
        offset: offset ? offset : 0,
        search: search ? search : '',
        from: from ? from : '',
        to: to ? to : '',
    };
    console.log({ options });
    return options;
};
