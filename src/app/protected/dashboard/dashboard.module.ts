import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { PaginationModule } from '../shared/modules/pagination/pagination.module';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { PetFiltersComponent } from './components/pet-filters/pet-filters.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    IndexComponent,
    SidebarComponent,
    ConfirmModalComponent,
    ModalFormComponent,
    SettingsComponent,
    PetFiltersComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FontAwesomeModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    NgbAccordionModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    SidebarComponent,
  ],
})
export class DashboardModule { }
