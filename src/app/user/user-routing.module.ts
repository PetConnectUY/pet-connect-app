import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { ValidateTokenGuard } from '../protected/shared/guards/ValidateToken.guard';
import { PetProfileComponent } from './pages/pet-profile/pet-profile.component';

const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'pet-profile',
    component: PetProfileComponent,
    canActivate: [ValidateTokenGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
