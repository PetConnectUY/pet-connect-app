import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { ValidateTokenGuard } from '../shared/guards/ValidateToken.guard';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    canActivate: [ValidateTokenGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [ValidateTokenGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
