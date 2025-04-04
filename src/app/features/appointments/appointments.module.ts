import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { BookAppointmentComponent } from './book-appointment/book-appointment.component';
import { AppointmentsRoutingModule } from './appointments-routing.module';

@NgModule({
  declarations: [AppointmentListComponent, BookAppointmentComponent],
  imports: [
    CommonModule,
    FormsModule, // For ngClass
    ReactiveFormsModule, // For formGroup
    AppointmentsRoutingModule,
  ],
})
export class AppointmentsModule {}
