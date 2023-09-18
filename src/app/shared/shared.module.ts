import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DarkModeTogglerComponent } from '../components/dark-mode-toggler/dark-mode-toggler.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../components/loader/loader.component';
import { HtmlToSafeHtmlPipe } from './pipes/html-to-safe-html.pipe';



@NgModule({
  declarations: [
    NavbarComponent,
    DarkModeTogglerComponent,
    LoaderComponent,
    HtmlToSafeHtmlPipe
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    DarkModeTogglerComponent,
    LoaderComponent,
    HtmlToSafeHtmlPipe,
  ]
})
export class SharedModule { }
