import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { FrequentQuestionsComponent } from './pages/frequent-questions/frequent-questions.component';
import { ErrorComponent } from './errors/components/error/error.component';
import { errors } from './errors/constants/errors.constant';
import { PurchasePointsComponent } from './components/purchase-points/purchase-points.component';
import { DiscoverMoreComponent } from './components/discover-more/discover-more.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full'
  },
  {
    path: 'frequent-questions',
    component: FrequentQuestionsComponent
  },
  {
    path: 'app',
    component: WelcomeComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./protected/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'pets',
    loadChildren: () => import('./protected/pets/pets.module').then(m => m.PetsModule),
  },
  {
    path: 'community',
    loadChildren: () => import('./protected/community/community.module').then(m => m.CommunityModule),
  },
  {
    path: 'error/:code',
    component: ErrorComponent,
  },
  {
    path: 'get-qr-code',
    component: PurchasePointsComponent,
  },
  {
    path: 'discover-more',
    component: DiscoverMoreComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
