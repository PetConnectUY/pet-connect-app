import { AfterViewInit, Component } from '@angular/core';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit {
  faCommentDots = faCommentDots;

  constructor(
  ) {
  }

  ngAfterViewInit(): void {
  }

  
}
