import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { faUser, faPaw, faQrcode, faPrint, faMagnifyingGlassLocation, faPersonCircleQuestion, faPeopleRoof } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ScrollService } from 'src/app/shared/services/scroll.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  @ViewChildren('headerItem') headerItems!: QueryList<ElementRef>;
  @ViewChild('howToGet', { static: true }) howToGet!: ElementRef;

  faUser = faUser;
  faQrcode = faQrcode;
  user: User|null;
  token: string|null;
  
  constructor(
    private authService: AuthService,
    private scrollService: ScrollService
  ) {
    this.user = this.authService.getUser();
    this.token = this.authService.getToken();
    
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

  toSection(e: MouseEvent, to: string): void {
    e.preventDefault();
    
    this.scrollService.scrollToSection(to);
  }
}
