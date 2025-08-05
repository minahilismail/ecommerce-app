import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(value: any, searchQuery?: string, categoryFilter?: string): any {
    if (!value) {
      return value;
    }

    let filteredItems = value;

    // Filter by search query (product name)
    if (searchQuery && searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filteredItems = filteredItems.filter((item: any) => {
        return (
          item.title &&
          String(item.title).toLowerCase().includes(lowerCaseQuery)
        );
      });
    }

    // Filter by category id
    if (categoryFilter) {
      filteredItems = filteredItems.filter((item: any) => {
        return (
          item.categoryId &&
          String(item.categoryId).toLowerCase() === categoryFilter
        );
      });
    }

    return filteredItems;
  }
}
