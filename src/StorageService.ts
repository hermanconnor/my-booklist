import type { Book } from './types';

export class StorageService {
  private static readonly STORAGE_KEY = 'books_data';

  static getBooks(): Book[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);

      if (Array.isArray(parsed)) {
        return parsed.filter((item) => item.title && item.isbn);
      }

      return [];
    } catch (error) {
      console.error('Could not get books from storage', error);
      return [];
    }
  }

  static saveBooks(books: Book[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(books));
    } catch (error) {
      console.error('Could not save books to storage', error);
    }
  }
}
