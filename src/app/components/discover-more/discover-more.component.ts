import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-discover-more',
  templateUrl: './discover-more.component.html',
  styleUrls: ['./discover-more.component.scss']
})
export class DiscoverMoreComponent implements OnInit, AfterViewChecked {
  constructor(private renderer: Renderer2, private el: ElementRef, private router: Router) { }

  ngOnInit(): void {
    this.checkVisibility();
  }

  ngAfterViewChecked(): void {
    this.checkVisibility();
  }

  @HostListener('window:scroll', [])
  @HostListener('window:resize', [])
  onWindowScroll(): void {
    this.checkVisibility();
  }

  checkVisibility(): void {
    const elements = this.el.nativeElement.querySelectorAll('.animated');
    elements.forEach((el: any) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        this.renderer.addClass(el, 'visible');
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
