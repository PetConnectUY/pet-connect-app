import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DarkModeTogglerComponent } from '../components/dark-mode-toggler/dark-mode-toggler.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../components/loader/loader.component';



@NgModule({
  declarations: [
    NavbarComponent,
    DarkModeTogglerComponent,
    LoaderComponent
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
  ]
})
export class SharedModule { }
