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
    const lowerQuery = query.toLowerCase();

    // 1. Filter - logic remains solid
    let filtered = this.books.filter((book) => {
      const searchContent =
        `${book.author} ${book.title} ${book.isbn}`.toLowerCase();

      return searchContent.includes(lowerQuery);
    });

    const sorted = [...filtered].sort((a, b) => {
      const valA = String(a[sortBy] || '').toLowerCase();
      const valB = String(b[sortBy] || '').toLowerCase();

      return valA.localeCompare(valB);
    });

    const totalItems = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;

    const paginatedData = sorted.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: safePage,
    };
  }
}
