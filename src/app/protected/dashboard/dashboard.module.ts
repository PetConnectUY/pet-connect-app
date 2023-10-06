import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmModalComponent } from './componentes/confirm-modal/confirm-modal.component';
import { ModalFormComponent } from './componentes/modal-form/modal-form.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { PaginationModule } from '../shared/modules/pagination/pagination.module';


@NgModule({
  declarations: [
    IndexComponent,
    SidebarComponent,
    ConfirmModalComponent,
    ModalFormComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FontAwesomeModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
  ],
  exports: [
    SidebarComponent,
  ],
})
export class DashboardModule { }
