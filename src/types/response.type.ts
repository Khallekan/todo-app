export type GlobalResponseType<T = unknown> = Promise<{
  message?: string;
  data?: T;
}>;

export type PaginationInfo = {
  count: number;
  last_page: number;
  page: number;
  previous: number | null;
  next: number | null;
  data: unknown[];
};

export type PaginatedDataResponseType = GlobalResponseType<PaginationInfo>;
