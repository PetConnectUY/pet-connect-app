import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SignupComponent } from './pages/signup/signup.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PetProfileComponent } from './pages/pet-profile/pet-profile.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ProgressTemplateComponent } from './templates/progress-template/progress-template.component';


@NgModule({
  declarations: [
    SignupComponent,
    PetProfileComponent,
    ProgressBarComponent,
    ProgressTemplateComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule
  ],
})
export class UserModule { }
