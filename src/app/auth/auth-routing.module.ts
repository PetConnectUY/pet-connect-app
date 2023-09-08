import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateGuestGuard } from './guards/validate-guest.guard';
import { SigninComponent } from './pages/signin/signin.component';
import { PetProfileComponent } from '../user/pages/pet-profile/pet-profile.component';

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
        component: PetProfileComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
