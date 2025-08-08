import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(value: any, searchQuery?: string, categoryFilter?: string): any {
    console.log('SearchPipe input:', {
      value: value?.length,
      searchQuery,
      categoryFilter,
    });

    if (!value) {
      return value;
    }

    let filteredItems = value;

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      console.log('Filtering with query:', lowerCaseQuery);

      filteredItems = filteredItems.filter((item: any) => {
        // For products: search by title
        const titleMatch =
          item.title &&
          String(item.title).toLowerCase().includes(lowerCaseQuery);

        // For categories: search by name or code
        const nameMatch =
          item.name && String(item.name).toLowerCase().includes(lowerCaseQuery);
        const codeMatch =
          item.code && String(item.code).toLowerCase().includes(lowerCaseQuery);

        const matched = titleMatch || nameMatch || codeMatch;
        if (matched) {
          console.log('Match found:', {
            name: item.name,
            code: item.code,
            title: item.title,
          });
        }

        return matched;
      });

      console.log('Filtered results:', filteredItems.length);
    }

    // Filter by category id (for products)
    if (categoryFilter) {
      filteredItems = filteredItems.filter((item: any) => {
        return (
          item.categoryId &&
          String(item.categoryId).toLowerCase() === categoryFilter.toLowerCase()
        );
      });
    }

    return filteredItems;
  }
}
