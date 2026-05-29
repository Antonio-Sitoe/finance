export type SortDir = "asc" | "desc";
export type Primitive = string | number | boolean;
export type FilterMap = Record<string, Primitive | Primitive[]>;

export interface ListQuery {
  size: number;
  page: number;
  sortOrder?: SortDir;
  sortBy?: string;
  filters?: FilterMap;
  startsWithZero?: boolean;
}

export interface PageResult<T> {
  content: T[];
  first: boolean;
  last: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
