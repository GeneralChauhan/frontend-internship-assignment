import { Component, Input } from '@angular/core';
import { Book, Doc } from 'src/app/core/models/book-response.model';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'front-end-internship-assignment-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent {
  @Input() booksList: Book[] = [];
  @Input() subjectName = '';

  @Input() searchResults: Doc[] = [];
  @Input() searchQuery = '';

  @Input() currentPage = 1;
  @Input() totalPages = 1;

  constructor(private searchService: SearchService) {}

  goToPage(page: number) {
    this.searchService.emitPage(page);
  }
}
