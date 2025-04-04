// src/app/core/services/service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Service } from '../../../app/core/models/service.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private apiUrl = 'http://localhost:3000/services';
  private servicesSubject = new BehaviorSubject<Service[]>([]);
  public services$ = this.servicesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadServices();
  }

  loadServices(): void {
    this.http.get<Service[]>(this.apiUrl).subscribe((services) => {
      this.servicesSubject.next(services);
    });
  }

  getServices(page: number, limit: number): Observable<Service[]> {
    return this.http.get<Service[]>(
      `${this.apiUrl}?_page=${page}&_limit=${limit}`
    );
  }

  addService(service: Omit<Service, 'id'>): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, {
      ...service,
      id: this.generateId(),
      createdAt: new Date(),
    });
  }

  updateService(id: string, service: Partial<Service>): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
