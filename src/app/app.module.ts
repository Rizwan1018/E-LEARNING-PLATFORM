import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LandingComponent } from './modules/landing/landing.component';
import { SharedModule } from './shared/shared.module';
import { LoginComponentComponent } from './modules/authentication/login-component/login-component.component';
import { SignupComponent } from './modules/authentication/signup/signup.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { SupportComponent } from './modules/support/support.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ForgotPasswordComponent } from './modules/authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './modules/authentication/reset-password/reset-password.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { PaymentHistoryComponent } from './modules/payment-history/payment-history.component';
import { TeacherAssessmentMarksComponent } from './modules/instructor/teacher-assessment/teacher-assessment-marks/teacher-assessment-marks.component';
import { InstructorNavbarComponent } from './modules/instructor/instructor-navbar/instructor-navbar.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponentComponent,
    SignupComponent,
    AboutUsComponent,
    SupportComponent,
    NavbarComponent,
    FooterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProfileComponent,
    PaymentHistoryComponent,
    TeacherAssessmentMarksComponent,
    TeacherAssessmentMarksComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
   // SharedModule
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass : JwtInterceptor,
      multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
