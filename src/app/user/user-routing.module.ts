import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { ValidateTokenGuard } from '../protected/shared/guards/ValidateToken.guard';
import { PetProfileComponent } from './pages/pet-profile/pet-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { ProgressTemplateComponent } from './templates/progress-template/progress-template.component';
import { LoggedUserCannotRegisterGuard } from './guards/logged-user-cannot-register.guard';
import { PurchaseQrComponent } from './pages/purchase-qr/purchase-qr.component';

const routes: Routes = [
  {
    path: '',
    component: ProgressTemplateComponent,
    children: [
      {path: 'signup', component: SignupComponent, canActivate: [LoggedUserCannotRegisterGuard]},
      {path: 'pet-profile', component: PetProfileComponent, canActivate: [AuthGuard, ValidateTokenGuard]},
      {path: 'purchase-qr', component: PurchaseQrComponent, canActivate: [ValidateTokenGuard]},
    ]
  },
  {
    path: 'purchase-qr-template',
    component: PurchaseQrComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
