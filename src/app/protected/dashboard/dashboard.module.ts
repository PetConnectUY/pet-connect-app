import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';


@NgModule({
  declarations: [
    IndexComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
