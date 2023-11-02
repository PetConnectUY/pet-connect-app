import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { ValidateTokenGuard } from '../shared/guards/ValidateToken.guard';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'my-pets',
  },
  {
    path: 'my-pets',
    component: IndexComponent,
    canActivate: [ValidateTokenGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ValidateTokenGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
