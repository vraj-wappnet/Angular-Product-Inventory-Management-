import { Component } from '@angular/core';
import { HeaderComponent } from './shared/components/header/header.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, NotificationComponent, CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen" [ngClass]="themeClass">
      <app-header></app-header>
      <main class="container mx-auto p-4">
        <app-notification></app-notification>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = 'PMS';
  themeClass: string = 'bg-gray-100';

  constructor(private themeService: ThemeService) {
    this.updateTheme();
    this.themeService.themeChange.subscribe(() => {
      this.updateTheme();
    });
  }

  updateTheme() {
    this.themeClass =
      this.themeService.getTheme() === 'dark'
        ? 'bg-gray-900 text-white'
        : 'bg-gray-100 text-gray-900';
  }
}
