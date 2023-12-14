import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MapComponent } from './components/map/map.component';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    IndexComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    SharedModule,
    FontAwesomeModule,
    MatTooltipModule,
  ]
})
export class ClientsModule { }
