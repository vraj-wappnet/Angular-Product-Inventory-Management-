import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this import
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true, // Mark as standalone
  imports: [CommonModule], // Import CommonModule here
  template: `
    <div
      *ngIf="notification"
      class="fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg text-white"
      [ngClass]="{
        'bg-green-500': notification.type === 'success',
        'bg-red-500': notification.type === 'error',
        'bg-blue-500': notification.type === 'info'
      }"
    >
      {{ notification.message }}
      <button (click)="onClose()" class="ml-4 font-bold">×</button>
    </div>
  `,
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent {
  notification: any = null;

  constructor(private notificationService: NotificationService) {
    this.notificationService.notifications$.subscribe((notification) => {
      this.notification = notification;
    });
  }

  onClose() {
    this.notificationService.clearNotification();
  }
}
