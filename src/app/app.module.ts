import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './components/about/about.component';
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { FrequentQuestionsComponent } from './pages/frequent-questions/frequent-questions.component';
import { PurchaseComponent } from './pages/purchase/purchase.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, RecaptchaFormsModule } from "ng-recaptcha";



@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    AboutComponent,
    FrequentQuestionsComponent,
    PurchaseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule,
    SharedModule,
    RouterModule.forRoot([]),
    RecaptchaV3Module,
    RecaptchaFormsModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: "6Ld_MEYoAAAAAIymj1uB3BakkGkNlimFXm2Un_sY" },
  ],
  exports: [
    NavbarComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeEs); // Importa la configuración regional para 'es-ES'
  }
 }
