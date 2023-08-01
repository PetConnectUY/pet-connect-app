import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit {
  @ViewChildren('aboutItem') aboutItem!: QueryList<ElementRef>;

  user: User|null;
  faBullseye = faBullseye;

  constructor(
    private authService: AuthService
  ) {
    this.user = this.authService.getUser();
  }

  ngAfterViewInit(): void {
    this.animateItems();
  }

  animateItems() {
    const items = this.aboutItem.toArray();
    const animationDuration = 500;

    items.forEach((item, index) => {
      item.nativeElement.style.animationDelay = `${animationDuration * index}ms`;
    });

    setTimeout(() => {
      items.forEach((item, index) => {
        item.nativeElement.classList.add('fadeIn');
      });
    });
  }
}
