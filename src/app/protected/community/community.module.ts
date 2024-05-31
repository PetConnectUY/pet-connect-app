import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FeedComponent } from './components/feed/feed.component';
import { PostComponent } from './components/post/post.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavbarCommunityComponent } from './navbar-community/navbar-community.component';
import { SkeletonLoaderComponent } from './components/feed/skeleton-loader/skeleton-loader.component';


@NgModule({
  declarations: [
    WelcomeComponent,
    HomeComponent,
    FeedComponent,
    PostComponent,
    NavbarCommunityComponent,
    SkeletonLoaderComponent
  ],
  imports: [
    CommonModule,
    CommunityRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatBadgeModule,
    MatDialogModule,
    RouterModule,
  ],
  exports: [
    HomeComponent,
    NavbarCommunityComponent
  ],
})
export class CommunityModule { }
