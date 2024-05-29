import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DarkModeTogglerComponent } from '../components/dark-mode-toggler/dark-mode-toggler.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../components/loader/loader.component';
import { HtmlToSafeHtmlPipe } from './pipes/html-to-safe-html.pipe';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from '../components/footer/footer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    NavbarComponent,
    DarkModeTogglerComponent,
    LoaderComponent,
    HtmlToSafeHtmlPipe,
    FooterComponent,
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
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  exports: [
    NavbarComponent,
    DarkModeTogglerComponent,
    LoaderComponent,
    HtmlToSafeHtmlPipe,
    FooterComponent,
  ],
})
export class SharedModule { }
