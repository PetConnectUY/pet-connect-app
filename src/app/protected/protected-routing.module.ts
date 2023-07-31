import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateTokenGuard } from './shared/guards/ValidateToken.guard';
import { AppComponent } from './pages/app/app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivate: [ValidateTokenGuard],
    data: {requiresAuth: true},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
