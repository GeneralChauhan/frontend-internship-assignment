import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Search } from '../models/search-response.model';
// import book 
import { Book } from '../models/book-response.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) { }

  getSearchResults(query: string): Observable<Book> {
    return this.http.get<Book>(`http://openlibrary.org/search.json?q=${query}`);
  }
}

