import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification | null>(null);
  notifications$ = this.notificationsSubject.asObservable();

  showNotification(
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) {
    this.notificationsSubject.next({ message, type });

    // Auto hide after 3 seconds
    setTimeout(() => {
      this.notificationsSubject.next(null);
    }, 3000);
  }

  clearNotification() {
    this.notificationsSubject.next(null);
  }
}
