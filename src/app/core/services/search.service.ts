import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { SearchResponse } from 'src/app/core/models/book-response.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  pageEmitter: EventEmitter<number>;

  constructor(private apiService: ApiService) {
    this.pageEmitter = new EventEmitter<number>();
  }

  getSearchResults(
    query: string,
    page: number = 1
  ): Observable<SearchResponse> {
    const limit = 10;
    return this.apiService.get(
      `/search.json?q=${query
        .toLowerCase()
        .split(' ')
        .join('+')}&limit=${limit}&page=${page}`
    );
  }

  emitPage(page: number) {
    this.pageEmitter.emit(page);
  }
}
