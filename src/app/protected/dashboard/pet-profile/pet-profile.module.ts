import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PetProfileRoutingModule } from './pet-profile-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { DashboardModule } from '../dashboard.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginationModule } from '../../shared/modules/pagination/pagination.module';
import { PetService } from './services/pet.service';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    PetProfileRoutingModule,
    DashboardModule,
    FontAwesomeModule,
    PaginationModule,
    SharedModule,
  ],
  providers: [PetService]
})
export class PetProfileModule { }
