import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PetProfileRoutingModule } from './pet-profile-routing.module';
import { IndexComponent } from './pages/index/index.component';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    PetProfileRoutingModule
  ]
})
export class PetProfileModule { }
