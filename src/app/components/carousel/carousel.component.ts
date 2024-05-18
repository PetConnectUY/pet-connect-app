import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  images = [
    { src: 'assets/images/carousel-image-1.webp', title: 'Tranquilidad', description: 'Manten a tu mascota siempre segura' },
    { src: 'assets/images/carousel-image-3.webp', title: 'Facilidad', description: 'Simplemente escanea y listo!' },
    { src: 'assets/images/carousel-image-2.webp', title: 'Económico', description: 'El método más económico del mercado' }
  ];
  currentIndex = 0;

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
