export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getPagination = (query: PaginationQuery): { page: number; limit: number; skip: number } => {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 && query.limit <= 100 ? query.limit : 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
