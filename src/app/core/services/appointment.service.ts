import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from '../../features/appointments/models/appointment.model';
@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'http://localhost:3000/appointments'; // Consider renaming this endpoint to '/products' if appropriate
  private editingAppointment = new BehaviorSubject<Appointment | null>(null);
  public editingAppointment$ = this.editingAppointment.asObservable();

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAppointmentsByUser(userName: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}?userName=${userName}`);
  }

  bookAppointment(
    appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>
  ): Observable<Appointment> {
    const newAppointment: Appointment = {
      ...appointment,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };
    return this.http.post<Appointment>(this.apiUrl, newAppointment);
  }

  setEditingAppointment(appointment: Appointment): void {
    this.editingAppointment.next(appointment);
  }

  clearEditingAppointment(): void {
    this.editingAppointment.next(null);
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(
      `${this.apiUrl}/${appointment.id}`,
      appointment
    );
  }

  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
