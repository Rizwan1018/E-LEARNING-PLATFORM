// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';

// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';
// import { NavbarComponent } from './layouts/navbar/navbar.component';
// import { SidebarComponent } from './layouts/sidebar/sidebar.component';
// import { StudentDashboardComponent } from './modules/student/student-dashboard/student-dashboard.component';
// import { CourseListComponent } from './modules/student/course-list/course-list.component';
// import { MyEnrollmentsComponent } from './modules/student/my-enrollments/my-enrollments.component';
// import { InstructorDashboardComponent } from './modules/instructor/instructor-dashboard/instructor-dashboard.component';
// import { AddCourseComponent } from './modules/instructor/add-course/add-course.component';
// import { ViewEnrollmentsComponent } from './modules/instructor/view-enrollments/view-enrollments.component';
// import { CardComponent } from './shared/card/card.component';
// import { LoaderComponent } from './shared/loader/loader.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { HomeComponent } from './modules/home/home.component';

// @NgModule({
//   declarations: [
//     AppComponent,
//     NavbarComponent,
//     SidebarComponent,
//     StudentDashboardComponent,
//     CourseListComponent,
//     MyEnrollmentsComponent,
//     InstructorDashboardComponent,
//     AddCourseComponent,
//     ViewEnrollmentsComponent,
//     CardComponent,
//     LoaderComponent,
//     HomeComponent
//   ],
//   imports: [
//     BrowserModule,
//     FormsModule,
//     HttpClientModule,
//     ReactiveFormsModule,
//     AppRoutingModule
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }

// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { CardComponent } from './shared/card/card.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './modules/home/home.component';
import { LandingComponent } from './modules/landing/landing.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    CardComponent,
    LoaderComponent,
    HomeComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
