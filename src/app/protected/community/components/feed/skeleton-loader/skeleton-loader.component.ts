import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent implements OnInit {
  @Input() quantity!: number;
  items: number[] = [];

  ngOnInit(): void {
    this.items = Array(this.quantity).fill(0);
  }
}
