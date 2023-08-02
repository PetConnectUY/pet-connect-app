import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateGuestGuard } from './guards/validate-guest.guard';
import { SigninComponent } from './pages/signin/signin.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [ValidateGuestGuard],
    children: [
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full',
      },
      {
        path: 'signin',
        component: SigninComponent
      },
      {
        path: 'signup',
        loadChildren: () => import('./../user/user.module').then(m => m.UserModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
