export const filterPagingSearchOptions = (ctx: any) => {
    // console.log(ctx.query);

    const { limit, offset, search } = ctx.query;
    const options = {
        limit: limit ? limit : 5,
        offset: offset ? offset : 0,
        search: search ? search : "",
    };
    return options;
};
