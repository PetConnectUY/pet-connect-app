import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import { AppComponent } from './pages/app/app.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { EmptyPetsComponent } from './dasbhoard/components/empty-pets/empty-pets.component';


@NgModule({
  declarations: [
    AppComponent,
    CarouselComponent,
    EmptyPetsComponent,
  ],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
  ]
})
export class ProtectedModule { }
