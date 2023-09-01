import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PetProfileRoutingModule } from './pet-profile-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { DashboardModule } from '../dashboard.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginationModule } from '../../shared/modules/pagination/pagination.module';
import { PetService } from './services/pet.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';


@NgModule({
  declarations: [
    IndexComponent,
    ModalFormComponent,
    ConfirmModalComponent,
  ],
  imports: [
    CommonModule,
    PetProfileRoutingModule,
    DashboardModule,
    FontAwesomeModule,
    PaginationModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [PetService]
})
export class PetProfileModule { }
