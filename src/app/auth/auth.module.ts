import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './pages/signin/signin.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';


@NgModule({
  declarations: [
    SigninComponent,
    AlertModalComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SharedModule
  ],
  exports: [
    SigninComponent,
  ]
})
export class AuthModule { }
