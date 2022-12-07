export const filterPagingSearchOptions = (ctx: any) => {
    // console.log(ctx.query);

    const { limit, offset, search } = ctx.query;
    const options = {
        limit: limit ? limit : 10,
        offset: offset ? offset : 0,
        search: search ? search : "",
    };
    return options;
};
