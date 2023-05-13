import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SubjectsService } from '../../core/services/subjects.service';
import { Book } from 'src/app/core/models/book-response.model';


@Component({
  selector: 'front-end-internship-assignment-trending-subjects',
  templateUrl: './trending-subjects.component.html',
  styleUrls: ['./trending-subjects.component.scss'],
})
export class TrendingSubjectsComponent implements OnInit {
  @Input() showDiv: boolean = true;
  isLoading: boolean = true;
  subjectName: string = '';
  allBooks: Book[] = [];
  currentOffset: number = 0;
  currentLimit: number = 10;

  constructor(
    private route: ActivatedRoute,
    private subjectsService: SubjectsService,
  ) { }

  onClickPrevious() {
    if (this.currentOffset >= 10) {
      this.currentOffset = this.currentOffset - this.currentLimit;
      this.getAllBooks();
    }
  }

  onClickNext() {
    this.currentOffset = this.currentOffset + this.currentLimit;
    this.getAllBooks();
  }

  getAllBooks() {
    this.subjectsService.getAllBooks(this.subjectName, this.currentLimit, this.currentOffset).subscribe((data) => {
      this.allBooks = data?.works;
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.subjectName = params.get('name') || '';
      this.isLoading = true;
      this.getAllBooks();
    });
  }
}
