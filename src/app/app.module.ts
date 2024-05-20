import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './components/about/about.component';
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { FrequentQuestionsComponent } from './pages/frequent-questions/frequent-questions.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, RecaptchaFormsModule } from "ng-recaptcha";
import { ErrorComponent } from './errors/components/error/error.component';
import { MyErrorHandler } from './errors/error.handler';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { APP_DATEFORMAT } from './shared/configs/app.dateformat';
import { ToastrModule } from 'ngx-toastr';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AssociatedClientsComponent } from './components/associated-clients/associated-clients.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { FooterComponent } from './components/footer/footer.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { PurchasePointsComponent } from './components/purchase-points/purchase-points.component';
import { MatTreeModule } from '@angular/material/tree';
import { DiscoverMoreComponent } from './components/discover-more/discover-more.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    AboutComponent,
    FrequentQuestionsComponent,
    ErrorComponent,
    AssociatedClientsComponent,
    FooterComponent,
    CarouselComponent,
    PurchasePointsComponent,
    DiscoverMoreComponent,
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
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot(),
    MatSidenavModule,
    MatButtonModule,
    NgImageSliderModule,
    NgbCarouselModule,
    MatSnackBarModule,
    MatTreeModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: "6Ld_MEYoAAAAAIymj1uB3BakkGkNlimFXm2Un_sY" },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATEFORMAT }

    // { provide: ErrorHandler, useClass: MyErrorHandler }
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
