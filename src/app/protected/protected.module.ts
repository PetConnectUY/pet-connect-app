import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import { AppComponent } from './pages/app/app.component';
import { CarouselComponent } from './components/carousel/carousel.component';


@NgModule({
  declarations: [
    AppComponent,
    CarouselComponent,
  ],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
  ]
})
export class ProtectedModule { }
