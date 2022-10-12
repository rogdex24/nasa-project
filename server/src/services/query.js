const DEFUAULT_PAGE_NUMEBR = 1;
const DEFUAULT_PAGE_LIMIT = 0;

function getPagination(query) {
  const page = Math.abs(query.page) || DEFUAULT_PAGE_NUMEBR;
  const limit = Math.abs(query.limit) || DEFUAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

module.exports = {
  getPagination,
};
