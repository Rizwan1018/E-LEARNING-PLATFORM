import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from "../app-routing.module";

@NgModule({
  declarations: [
   
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
],
  exports:[
  ]
})
export class SharedModule {}
