import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { faUser, faPaw, faQrcode, faPrint, faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  @ViewChildren('headerItem') headerItems!: QueryList<ElementRef>;

  faUser = faUser;
  faPaw = faPaw;
  faQrcode = faQrcode;
  faPrint = faPrint;
  faMagnifyingGlassLocation = faMagnifyingGlassLocation;

  user: User|null;

  constructor(
    private authService: AuthService,
  ) {
    this.user = this.authService.getUser();
  }

  ngAfterViewInit() {
    this.animateItems();
  }

  animateItems() {
    const items = this.headerItems.toArray();
    const animationDuration = 500;

    items.forEach((item, index) => {
      item.nativeElement.style.animationDelay = `${animationDuration * index}ms`;
    });
  }
}
