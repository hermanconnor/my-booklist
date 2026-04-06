import type { Book, PaginatedResult } from './types';

export class Renderer {
  private bookList = document.getElementById(
    'book-list',
  ) as HTMLTableSectionElement;
  private paginationContainer = document.getElementById(
    'pagination-controls',
  ) as HTMLUListElement;
  private bookCountBadge = document.getElementById(
    'book-count',
  ) as HTMLSpanElement;
  private emptyMsg = document.getElementById('empty-msg') as HTMLDivElement;

  renderTable(books: Book[]): void {
    this.bookList.innerHTML = '';

    if (books.length === 0) {
      this.emptyMsg.classList.remove('d-none');
      return;
    }

    this.emptyMsg.classList.add('d-none');

    const fragment = document.createDocumentFragment();

    books.forEach((book) => {
      const row = document.createElement('tr');

      row.innerHTML = `
      <td class="px-4">${book.title}</td>
      <td>${book.author}</td>
      <td><span class="badge bg-light text-dark border">${book.isbn}</span></td>
      <td class="text-center">
        <button class="btn btn-outline-danger btn-sm delete-btn" data-isbn="${book.isbn}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;
      fragment.appendChild(row);
    });

    this.bookList.appendChild(fragment);
  }

  renderPagination(result: PaginatedResult, pageSize: number): void {
    // 1. Clear previous buttons and update the count badge
    this.paginationContainer.innerHTML = '';
    this.bookCountBadge.textContent = `${result.totalItems} Books`;

    // 2. Find the parent <nav> or the container to hide/show
    const navWrapper =
      this.paginationContainer.closest('nav') || this.paginationContainer;

    // 3. Only show if totalItems > pageSize
    if (result.totalItems <= pageSize) {
      navWrapper.classList.add('d-none');
      return;
    } else {
      navWrapper.classList.remove('d-none');
    }

    // 4. Render the buttons if we passed the check
    for (let i = 1; i <= result.totalPages; i++) {
      const li = document.createElement('li');

      li.className = `page-item ${result.currentPage === i ? 'active' : ''}`;
      li.innerHTML = `<button class="page-link" data-page="${i}">${i}</button>`;
      this.paginationContainer.appendChild(li);
    }
  }

  showAlert(message: string, type: 'success' | 'danger' | 'info'): void {
    const div = document.createElement('div');

    div.className = `alert alert-${type} alert-dismissible fade show shadow-sm position-fixed top-0 start-50 translate-middle-x mt-3`;
    div.setAttribute('role', 'alert');
    div.style.zIndex = '9999';

    // 1. Define the internal HTML
    // Removed data-bs-dismiss and added 'close-alert-btn' class for selection
    div.innerHTML = `
    <i class="fas ${this.getIcon(type)} me-2"></i>
    <span>${message}</span>
    <button type="button" class="btn-close close-alert-btn" aria-label="Close"></button>
  `;

    document.body.appendChild(div);

    // 2. Manual Close Logic Function
    const removeAlert = () => {
      div.classList.remove('show');
      // Wait for the CSS transition (300ms) before removing from DOM
      setTimeout(() => div.remove(), 300);
    };

    // 3. Attach listener to the "X" button
    const closeBtn = div.querySelector('.close-alert-btn');
    closeBtn?.addEventListener('click', removeAlert);

    // 4. Existing Auto-remove logic (3 seconds)
    setTimeout(removeAlert, 3000);
  }

  private getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'fa-check-circle';
      case 'danger':
        return 'fa-times-circle';
      default:
        return 'fa-info-circle';
    }
  }

  clearForm(): void {
    (document.querySelector('#book-form') as HTMLFormElement).reset();
  }
}
