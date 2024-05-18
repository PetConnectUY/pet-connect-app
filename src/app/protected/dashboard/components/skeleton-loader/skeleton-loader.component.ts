import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent implements OnInit {
  items: number[] = [];

  ngOnInit(): void {
    this.items = Array(6).fill(0); // Display 4 skeleton items
  }
}
