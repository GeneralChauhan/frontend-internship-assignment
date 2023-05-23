import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Book } from 'src/app/core/models/book-response.model';
import { SubjectsService } from '../../core/services/subjects.service';


@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  bookSearch: FormControl;
  searchToggle: boolean;
  subjectName: string;
  isLoading = false;
  allBooks: Book[] = [];
  currentOffset = 0;
  currentLimit = 10;
  currentPage = 1;
  wrongInput = '';

  public trendingSubjects: Array<string>;

  constructor(
    
    private subjectsService: SubjectsService,

  ) {
    this.trendingSubjects = [
      'JavaScript',
      'CSS',
      'HTML',
      'Harry Potter',
      'Crypto',
      'Angular',
      'WrongInputabcd'
    ];
    this.bookSearch = new FormControl('');
    this.searchToggle = false;
    this.subjectName = '';
  }

  onClickPrevious() {
    if (this.currentOffset >= 10) {
      this.currentOffset = this.currentOffset - this.currentLimit;
      this.getSearchResults();
      if (this.currentPage > 10) {
        this.currentPage -= 10;
      }
    }
  }

  onClickNext() {
    this.currentOffset = this.currentOffset + this.currentLimit;
    this.getSearchResults();
    this.currentPage += 10;
  }

  getSearchResults() {
    const cacheKey = `${this.subjectName}${this.currentOffset}${this.currentLimit}`;
    const cachedResponse = localStorage.getItem(cacheKey);

    if (cachedResponse) {
      const cachedData = JSON.parse(cachedResponse);
      if (cachedData.expiration > new Date().getTime()) {
        this.allBooks = cachedData.data;
        this.isLoading = false;
        return;
      }
      // remove expired cached data
      localStorage.removeItem(cacheKey);
    }

    this.subjectsService.searchForBooks(this.subjectName, this.currentLimit, this.currentOffset).subscribe((data) => {
      this.allBooks = data?.docs;
      this.isLoading = false;
      if (this.subjectName !== null) {
        const expiration = new Date().getTime() + (24 * 60 * 60 * 1000);
        const cachedData = { data: data?.docs, expiration };
        localStorage.setItem(cacheKey, JSON.stringify(cachedData));
      }
    });

    setTimeout(() => {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        const cachedData = JSON.parse(localStorage.getItem(key!)!);
        if (cachedData?.expiration && cachedData.expiration <= new Date().getTime()) {
          localStorage.removeItem(null ?? key!);
        }
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

  }



  onIconClick() {
    this.isLoading = true;
    this.searchToggle = true;
    this.wrongInput = this.bookSearch.value;
    const regex = /^[^\w\d]+|[^\w\d]+$/g; // regex to match non-alphanumeric characters at the beginning or end of the string
    this.subjectName = this.bookSearch.value.replace(regex, '');
    console.log(this.subjectName);
    if (this.subjectName !== '') {
      this.getSearchResults();
    } else {
      this.isLoading = false;
      this.allBooks = [];
    }
    console.log(this.allBooks);
  }



  clearSearch() {
    this.bookSearch.setValue('');
  }


  ngOnInit(): void {
    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300),
      ).
      subscribe((value: string) => {
        console.log(value);
      });
  }
}
