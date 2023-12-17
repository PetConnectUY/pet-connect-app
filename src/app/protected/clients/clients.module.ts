import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MapComponent } from './components/map/map.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'; 
import { CarouselComponent } from './components/carousel/carousel.component';
import { NgImageSliderModule } from 'ng-image-slider';

@NgModule({
  declarations: [
    IndexComponent,
    MapComponent,
    CarouselComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    SharedModule,
    FontAwesomeModule,
    MatTooltipModule,
    NgbCarouselModule,
    NgImageSliderModule
  ]
})
export class ClientsModule { }
