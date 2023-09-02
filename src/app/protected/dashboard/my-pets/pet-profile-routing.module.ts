import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { ValidateTokenGuard } from '../../shared/guards/ValidateToken.guard';
import { GetTokenComponent } from './pages/get-token/get-token.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    canActivate: [ValidateTokenGuard],
  },
  {
    path: 'pet/:petid/get-token',
    component: GetTokenComponent,
    canActivate: [ValidateTokenGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetProfileRoutingModule { }
