import { PaginationInfo } from 'src/types/response.type';

export function parsePaginatedData({
  count,
  page,
  limit,
  data,
}: {
  count: number;
  page: number;
  limit: number;
  data: unknown[];
}): PaginationInfo {
  return {
    count,
    data,
    page,
    last_page: Math.ceil(count / limit),
    previous: page > 1 ? page - 1 : null,
    next: page * limit < count ? page + 1 : null,
  };
}
