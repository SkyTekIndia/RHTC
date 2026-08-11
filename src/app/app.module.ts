import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AuthNavbarComponent } from './shared/auth-navbar/auth-navbar.component';

import { NewsComponent, AddNewsComponent  } from './news';

import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { FacilitiesComponent } from './facilities/facilities.component';
import { PhcsComponent } from './phcs/phcs.component';
import { ActivitiesComponent } from './activities/activities.component';
import { AcademicsComponent } from './academics/academics.component';
import { AdmissionsComponent } from './admissions/admissions.component';
import { GalleryComponent } from './gallery/gallery.component';
import { DownloadComponent } from './download/download.component';
import { ContactComponent } from './contact/contact.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { AdmitCardComponent } from './admitcard/admitcard.component';
import { DashboardComponent, ApplicationViewComponent } from './dashboard';
import {
  ApplicationPreviewComponent, BasicDetailsComponent,
  DeclarationPaymentComponent, EducationalQualificationsComponent,
  UploadOtherDocumentsComponent, UploadPhotoSignatureComponent,
  StudentComponent, PaymentCompleteComponent
} from './student';
import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { SafePipe } from './_pipes';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { LeftmenuComponent } from './shared/leftmenu/leftmenu.component';
import { AddGalleryComponent, AdminGalleryComponent } from './admin-gallery';

export var options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    AboutComponent,
    FacilitiesComponent,
    PhcsComponent,
    ActivitiesComponent,
    AcademicsComponent,
    AdmissionsComponent,
    GalleryComponent,
    DownloadComponent,
    ContactComponent,
    PrivacyComponent,
    ApplicationPreviewComponent,
    BasicDetailsComponent,
    DeclarationPaymentComponent,
    EducationalQualificationsComponent,
    UploadOtherDocumentsComponent,
    UploadPhotoSignatureComponent,
    StudentComponent,
    PaymentCompleteComponent,
    DashboardComponent,
    AuthNavbarComponent,
    ApplicationViewComponent,
    SafePipe,
    AdmitCardComponent,
    LeftmenuComponent,
    NewsComponent,
    AddNewsComponent,
    AddGalleryComponent,
    AdminGalleryComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center'
    }),
    RouterModule,
    AppRoutingModule,
    HomeModule,
    NgxGalleryModule,
    CommonModule,
    TransferHttpCacheModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    NgxMaskModule.forRoot(options),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
