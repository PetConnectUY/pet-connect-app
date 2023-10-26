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
import { ProfileSettingsComponent } from './pages/profile-settings/profile-settings.component';
import { GoogleSignupComponent } from './pages/google-signup/google-signup.component';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';

@NgModule({
  declarations: [
    SignupComponent,
    PetProfileComponent,
    ProgressBarComponent,
    ProgressTemplateComponent,
    ProfileSettingsComponent,
    GoogleSignupComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    NgxMatSelectSearchModule,
  ],
})
export class UserModule { }
