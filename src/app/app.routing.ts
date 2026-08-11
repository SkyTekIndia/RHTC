import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
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
import { StudentComponent, PaymentCompleteComponent } from './student';
import { DashboardComponent, ApplicationViewComponent } from './dashboard';
import { AdmitCardComponent } from './admitcard/admitcard.component';

import { NewsComponent, AddNewsComponent } from './news';

import { AuthGuard } from './_guards';
import { AddGalleryComponent, AdminGalleryComponent } from './admin-gallery';

const routes: Routes = [
  { path: 'student/registration', component: StudentComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/application/:_id', component: ApplicationViewComponent, canActivate: [AuthGuard] },
  { path: 'admit-card', component: AdmitCardComponent},
  { path: 'pay-success',         component: PaymentCompleteComponent },
  { path: 'pay-failure',         component: PaymentCompleteComponent },
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'facilities', component: FacilitiesComponent },
  { path: 'phcs', component: PhcsComponent },
  { path: 'activities', component: ActivitiesComponent },
  { path: 'academics', component: AcademicsComponent },
  { path: 'admissions', component: AdmissionsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'news', component: NewsComponent, canActivate: [AuthGuard] },
  { path: 'add-news', component: AddNewsComponent, canActivate: [AuthGuard] },
  { path: 'admin-gallery', component: AdminGalleryComponent, canActivate: [AuthGuard] },
  { path: 'add-gallery', component: AddGalleryComponent, canActivate: [AuthGuard] },

  { path: '**', component: LandingComponent },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: false, initialNavigation: 'enabled' })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
