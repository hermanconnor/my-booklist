import type { Book, PaginatedResult, SortKey } from './types';

export class BookManager {
  private books: Book[] = [];

  constructor(initialBooks: Book[] = []) {
    this.books = initialBooks;
  }

  setBooks(books: Book[]): void {
    this.books = books;
  }

  getAllBooks(): Book[] {
    return this.books;
  }

  addBook(book: Book): void {
    this.books.push(book);
  }

  removeBook(isbn: string): void {
    this.books = this.books.filter((book) => book.isbn !== isbn);
  }

  getProcessedBooks(
    query: string = '',
    sortBy: SortKey,
    page: number = 1,
    pageSize: number = 5,
  ): PaginatedResult {
    // 1. Filter based on search query
    const lowerQuery = query.toLowerCase();

    let filtered = this.books.filter((book) => {
      const searchContent =
        `${book.author} ${book.title} ${book.isbn}`.toLowerCase();

      return searchContent.includes(lowerQuery);
    });

    // 2. Sort the filtered results
    filtered.sort((a, b) => {
      const valA = a[sortBy].toLowerCase();
      const valB = b[sortBy].toLowerCase();

      return valA.localeCompare(valB);
    });

    // 3. Calculate Pagination
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    // Ensure current page doesn't exceed total pages if list shrinks
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;

    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: safePage,
    };
  }
}
