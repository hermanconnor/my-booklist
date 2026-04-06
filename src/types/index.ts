export interface Book {
  title: string;
  author: string;
  isbn: string;
}

export interface PaginatedResult {
  data: Book[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export type SortKey = 'title' | 'author' | 'isbn';

export interface AppState {
  query: string;
  sortBy: SortKey;
  currentPage: number;
  pageSize: number;
}
