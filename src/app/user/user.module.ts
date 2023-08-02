import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SignupComponent } from './pages/signup/signup.component';


@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ],
})
export class UserModule { }
