export const filterPagingSearchOptions = (ctx: any) => {
    console.log({ ctx: ctx.query });

    const { limit, offset, search } = ctx.query;
    const options = {
        limit: limit ? limit : 4,
        offset: offset ? offset : 0,
        search: search ? search : '',
    };
    console.log({ options });
    return options;
};
