export interface CategoryModel {
  id: number;
  name: string;
  code: string;
  description: string;
  parentCategoryId?: number | null;
  parentCategoryName?: string | null;
  subCategories?: CategoryModel[] | null;
}

// Helper interface for display purposes
export interface CategoryDisplay extends CategoryModel {
  isExpanded?: boolean;
  level?: number; // For indentation
}
