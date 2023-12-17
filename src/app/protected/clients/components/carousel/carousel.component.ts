import { Component, Input, OnInit } from '@angular/core';
import { Client } from '../../interfaces/client.interface';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() clients: Client[] = [];
  images: any[] = [];

  ngOnInit(): void {
    this.clients.forEach(element => {
       this.images.push({
        image: element.url,
        thumbImage: element.url,
        name: element.name,
        title: element.name,
       }); 
    });
    
  }
}
