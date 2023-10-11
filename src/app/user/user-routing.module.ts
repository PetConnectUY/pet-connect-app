import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { ValidateTokenGuard } from '../protected/shared/guards/ValidateToken.guard';
import { PetProfileComponent } from './pages/pet-profile/pet-profile.component';
import { ProgressTemplateComponent } from './templates/progress-template/progress-template.component';
import { LoggedUserCannotRegisterGuard } from './guards/logged-user-cannot-register.guard';
import { ProfileSettingsComponent } from './pages/profile-settings/profile-settings.component';

const routes: Routes = [
  {
    path: '',
    component: ProgressTemplateComponent,
    children: [
      {path: 'signup', component: SignupComponent, canActivate: [LoggedUserCannotRegisterGuard]},
      {path: 'pet-profile', component: PetProfileComponent, canActivate: [ValidateTokenGuard]},
      {path: 'profile-settings', component: ProfileSettingsComponent, canActivate: [ValidateTokenGuard]},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
