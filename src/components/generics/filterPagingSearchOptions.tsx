export const filterPagingSearchOptions = (ctx: any) => {
    console.log({ ctx: ctx.query });

    const { limit, offset, search, date } = ctx.query;
    const options = {
        limit: limit ? limit : 10,
        offset: offset ? offset : 0,
        search: search ? search : '',
        date: date ? date : '',
    };
    console.log({ options });
    return options;
};
