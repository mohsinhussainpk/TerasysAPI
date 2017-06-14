module.exports = {
    paginateResult: (count, offset, limit) => {
    const paginatedResult = {};
    paginatedResult.currentPage = Math.floor(offset / limit) + 1;
    paginatedResult.pageCount = Math.ceil(count / limit);
    paginatedResult.pageSize = Number(limit);
    paginatedResult.totalCount = count;

    return paginatedResult;
  }
}