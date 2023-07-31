import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { faUser, faPaw, faQrcode, faPrint, faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  faUser = faUser;
  faPaw = faPaw;
  faQrcode = faQrcode;
  faPrint = faPrint;
  faMagnifyingGlassLocation = faMagnifyingGlassLocation;

  @ViewChildren('headerItem') headerItems!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.animateItems();
  }

  animateItems() {
    const items = this.headerItems.toArray();
    const animationDuration = 500; // Ajusta la duración de la animación (en milisegundos)

    items.forEach((item, index) => {
      item.nativeElement.style.animationDelay = `${animationDuration * index}ms`;
    });

    setTimeout(() => {
      items.forEach((item, index) => {
        item.nativeElement.classList.add('fadeInRight');
      });
    }, 0);
  }
}
