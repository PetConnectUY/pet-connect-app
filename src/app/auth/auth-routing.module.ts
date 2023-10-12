import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateGuestGuard } from './guards/validate-guest.guard';
import { SigninComponent } from './pages/signin/signin.component';
import { PetProfileComponent } from '../user/pages/pet-profile/pet-profile.component';
import { ProfileSettingsComponent } from '../user/pages/profile-settings/profile-settings.component';
import { ValidateTokenGuard } from '../protected/shared/guards/ValidateToken.guard';
import { ProgressTemplateComponent } from '../user/templates/progress-template/progress-template.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full',
      },
      {
        path: 'signin',
        component: SigninComponent,
        canActivate: [ValidateGuestGuard],
      },
      {
        path: 'signup',
        loadChildren: () => import('./../user/user.module').then(m => m.UserModule)
      },
      {
        path: 'signin/pet-profile',
        component: ProgressTemplateComponent,
        canActivate: [ValidateTokenGuard],
        children: [
          {path: '', component: PetProfileComponent, canActivate: [ValidateTokenGuard]},
          {path: 'profile-settings', component: ProfileSettingsComponent, canActivate: [ValidateTokenGuard]}
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
