import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  constructor(private route: Router) {}

  images = [
    { 
      src: 'assets/images/carousel-image-1.webp', 
      title: 'Tranquilidad', 
      description: 'Manten a tu mascota siempre segura',
      cta: { text: 'Descubre más', link: '/discover-more' }
    },
    { 
      src: 'assets/images/carousel-image-3.webp', 
      title: 'Facilidad', 
      description: 'Simplemente escanea y listo!',
      cta: { text: 'Empezar ahora', link: '/auth/signin' }
    },
    { 
      src: 'assets/images/carousel-image-2.webp', 
      title: 'Económico', 
      description: 'El método más económico del mercado',
      cta: { text: 'Obtén tu chapita', link: '/get-qr-code' }
    }
  ];
  currentIndex = 0;


  handleCTAClick(link: string) {
    // Maneja la acción del botón de CTA, por ejemplo, redirigiendo a otra página
    this.route.navigateByUrl(link);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
