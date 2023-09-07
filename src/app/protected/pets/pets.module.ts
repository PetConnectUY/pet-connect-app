import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PetsRoutingModule } from './pets-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    IndexComponent,
  ],
  imports: [
    CommonModule,
    PetsRoutingModule,
    FontAwesomeModule,
    SharedModule,
  ]
})
export class PetsModule { }
