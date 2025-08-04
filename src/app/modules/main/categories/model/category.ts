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
}

export interface CategoryDisplay extends CategoryModel {
  isExpanded?: boolean;
  displayLevel?: number;
}
