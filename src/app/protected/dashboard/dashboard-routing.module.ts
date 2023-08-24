import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { ValidateTokenGuard } from '../shared/guards/ValidateToken.guard';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    canActivate: [ValidateTokenGuard]
  },
  {
    path: 'pet-profile',
    loadChildren: () => import('./pet-profile/pet-profile.module').then(m => m.PetProfileModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
