import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PetsRoutingModule } from './pets-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';
import { PhonePipe } from 'src/app/shared/pipes/phone.pipe';
import { MapComponent } from './components/map/map.component';
import { ImageModalComponent } from './components/image-modal/image-modal.component';


@NgModule({
  declarations: [
    IndexComponent,
    PhonePipe,
    MapComponent,
    ImageModalComponent
  ],
  imports: [
    CommonModule,
    PetsRoutingModule,
    FontAwesomeModule,
    SharedModule,
  ]
})
export class PetsModule { }
