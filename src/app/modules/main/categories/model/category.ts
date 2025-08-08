export interface CategoryModel {
  id: number;
  name: string;
  code: string;
  description: string;
  level?: number;
  parentCategoryId?: number | null;
  parentCategoryName?: string | null;
  subCategories?: CategoryModel[] | null;
  hasChildren?: boolean;
  statusId?: number;
}

export interface CategoryDisplay extends CategoryModel {
  isExpanded?: boolean;
  displayLevel?: number;
}

export interface Status {
  id: number;
  name: string;
}

export enum Statuses {
  Active = 1,
  Archived = 2,
  Deleted = 3,
}

export interface PaginationParameters {
  pageNumber: number;
  pageSize: number;
}

export interface PagedResult<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
