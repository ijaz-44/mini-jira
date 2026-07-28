// src/utils/pagination.ts
export interface PaginationOptions {
  page?: string | number;
  limit?: string | number;
}

export const getPagination = (options: PaginationOptions) => {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(options.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};