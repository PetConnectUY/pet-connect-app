import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DarkModeTogglerComponent } from '../components/dark-mode-toggler/dark-mode-toggler.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../components/loader/loader.component';
import { HtmlToSafeHtmlPipe } from './pipes/html-to-safe-html.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    NavbarComponent,
    DarkModeTogglerComponent,
    LoaderComponent,
    HtmlToSafeHtmlPipe,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
  ],
  exports: [
    NavbarComponent,
    DarkModeTogglerComponent,
    LoaderComponent,
    HtmlToSafeHtmlPipe,
  ],
})
export class SharedModule { }
