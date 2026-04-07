import { Input, initMDB } from 'mdb-ui-kit';
import { BookManager } from './BookManager';
import { Renderer } from './Renderer';
import { StorageService } from './StorageService';
import { debounce } from './utils/debounce';
import type { AppState, Book, SortKey } from './types';

export class App {
  private manager: BookManager;
  private ui: Renderer;
  private state: AppState;

  constructor() {
    this.manager = new BookManager(StorageService.getBooks());
    this.ui = new Renderer();

    this.state = {
      query: '',
      sortBy: 'title',
      currentPage: 1,
      pageSize: 5,
    };
  }

  public init(): void {
    // Initialize MDB components
    initMDB({ Input });

    // Set up all event listeners
    this.setupListeners();

    // Initial render
    this.updateDisplay();
  }

  private setupListeners(): void {
    document
      .getElementById('book-form')
      ?.addEventListener('submit', (e) => this.handleAddBook(e));

    const handleSearch = debounce((e: Event) => {
      this.state.query = (e.target as HTMLInputElement).value;
      this.state.currentPage = 1;
      this.updateDisplay();
    }, 300);

    document
      .getElementById('search-input')
      ?.addEventListener('input', handleSearch);

    document.getElementById('sort-select')?.addEventListener('change', (e) => {
      this.state.sortBy = (e.target as HTMLSelectElement).value as SortKey;
      this.updateDisplay();
    });

    document
      .getElementById('book-list')
      ?.addEventListener('click', (e) => this.handleDelete(e));

    document
      .getElementById('pagination-controls')
      ?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const pageBtn = target.closest('.page-link') as HTMLButtonElement;

        if (pageBtn) {
          this.state.currentPage = parseInt(pageBtn.dataset.page || '1');
          this.updateDisplay();
        }
      });
  }

  private updateDisplay(): void {
    const result = this.manager.getProcessedBooks(
      this.state.query,
      this.state.sortBy,
      this.state.currentPage,
      this.state.pageSize,
    );

    this.ui.renderTable(result.data);
    this.ui.renderPagination(result, this.state.pageSize);
  }

  private handleAddBook(e: Event): void {
    e.preventDefault();

    const titleInput = document.getElementById('title') as HTMLInputElement;
    const authorInput = document.getElementById('author') as HTMLInputElement;
    const isbnInput = document.getElementById('isbn') as HTMLInputElement;

    if (!titleInput.value || !authorInput.value || !isbnInput.value) {
      this.ui.showAlert('Please fill in all fields', 'danger');
      return;
    }

    const newBook: Book = {
      title: titleInput.value,
      author: authorInput.value,
      isbn: isbnInput.value,
    };

    this.manager.addBook(newBook);
    StorageService.saveBooks(this.manager.getAllBooks());

    this.ui.clearForm();
    this.ui.showAlert('Book added successfully!', 'success');
    this.updateDisplay();
  }

  private handleDelete(e: Event): void {
    const target = e.target as HTMLElement;
    const deleteBtn = target.closest('.delete-btn') as HTMLButtonElement;

    if (deleteBtn) {
      const isbn = deleteBtn.dataset.isbn;

      if (isbn) {
        this.manager.removeBook(isbn);
        StorageService.saveBooks(this.manager.getAllBooks());
        this.ui.showAlert('Book removed.', 'info');
        this.updateDisplay();
      }
    }
  }
}
