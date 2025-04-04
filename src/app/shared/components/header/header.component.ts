import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-sky-400 text-white p-2 h-auto shadow-md">
      <div
        class="container mx-auto flex flex-col md:flex-row justify-between items-center"
      >
        <h1 class="text-xl font-semibold mb-2 md:mb-0">PIMS</h1>
        <nav class="w-full md:w-auto">
          <div class="flex flex-col sm:flex-row items-center gap-2">
            <ul
              class="flex flex-wrap justify-center gap-2 text-sm mt-2 sm:mt-0"
            >
              <li *ngIf="currentUser">
                <button
                  (click)="logout()"
                  class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs transition-all duration-300"
                >
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </li>
              <li *ngIf="!currentUser" class="flex flex-wrap gap-1">
                <button
                  (click)="login('user1')"
                  class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs transition-all duration-300"
                >
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Login as User</span>
                </button>
                <button
                  (click)="login('admin')"
                  class="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs transition-all duration-300"
                >
                  <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      d="M12 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.76 0-5 2.24-5 5h10c0-2.76-2.24-5-5-5z"
                    />
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  </svg>
                  <span>Login as Admin</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  currentUser: string | null = null;
  showToggleButton = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.showToggleButton = true; // Ensure button appears after refresh
    }, 0);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  login(user: string) {
    this.authService.login(user);

    // Navigate based on user type
    if (user === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/appointments']);
    }
  }

  logout() {
    this.authService.logout();
  }
}
