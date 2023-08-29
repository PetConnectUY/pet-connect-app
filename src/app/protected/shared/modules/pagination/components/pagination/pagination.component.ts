import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pagination } from '../../interfaces/pagination';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})

export class PaginationComponent implements OnInit {

  @Input() pagination!: Pagination;
  @Output() OnPageChange: EventEmitter<number> = new EventEmitter();

  // Icons
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  pageSizeOption: number = 10;

  get pageSizes(): number[] {
    return [5, 10, 15, 20];
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {}

  paginationItems(): number[] {
    let items: number[] = [];

    for(let i=1; i<=this.pagination.last_page; i++) {
      items.push(i);
    }
    return items;
  }

  getCurrentPage(){
    this.route.queryParams
      .subscribe(res => {
        this.OnPageChange.emit(res['page']);
      })
  }
  
}