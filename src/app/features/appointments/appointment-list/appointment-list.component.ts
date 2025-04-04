import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';
import { Appointment } from '../models/appointment.model';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-appointment-list',
  standalone: false,
  template: `
    <div class="container mx-auto p-4" [ngClass]="themeClass">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <h2 class="text-2xl font-bold tracking-tight">My Products</h2>
        <div class="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            [(ngModel)]="searchName"
            placeholder="Search by name"
            class="border-2 border-blue-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            [(ngModel)]="searchCategory"
            placeholder="Search by category"
            class="border-2 border-blue-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <a
            routerLink="/appointments/book"
            class="text-blue-600 hover:text-blue-800 text-sm px-4 py-2 rounded-sm bg-blue-200 hover:bg-blue-100 transition-colors duration-200"
            [ngClass]="{
              'text-blue-400 hover:text-blue-300 bg-gray-800 hover:bg-gray-700':
                theme === 'dark'
            }"
          >
            Add New Product
          </a>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 gap-4"
      >
        <select
          [(ngModel)]="sortByPrice"
          class="border-2 border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Sort by Price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>

        <select
          [(ngModel)]="sortByStock"
          class="border-2 border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Sort by Stock</option>
          <option value="asc">Stock: Low to High</option>
          <option value="desc">Stock: High to Low</option>
        </select>
      </div>

      <div
        *ngIf="filteredAppointments.length === 0"
        class="p-4 rounded-lg text-center shadow-sm"
        [ngClass]="noDataThemeClass"
      >
        No matching products found.
        <a
          routerLink="/appointments/book"
          class="text-blue-600 hover:underline font-medium"
          [ngClass]="{ 'text-blue-400 hover:text-blue-300': theme === 'dark' }"
        >
          Add one now!
        </a>
      </div>

      <div
        *ngIf="filteredAppointments.length > 0"
        class="overflow-x-auto shadow-lg rounded-lg"
      >
        <table
          class="min-w-full divide-y divide-gray-200"
          [ngClass]="{ 'divide-gray-700': theme === 'dark' }"
        >
          <thead
            [ngClass]="{
              'bg-sky-800': theme === 'dark',
              'bg-sky-300': theme === 'light'
            }"
          >
            <tr>
              <th
                class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                [ngClass]="{
                  'text-gray-300': theme === 'dark',
                  'text-blue-800': theme === 'light'
                }"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                [ngClass]="{
                  'text-gray-300': theme === 'dark',
                  'text-blue-800': theme === 'light'
                }"
              >
                Product Name
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                [ngClass]="{
                  'text-gray-300': theme === 'dark',
                  'text-blue-800': theme === 'light'
                }"
              >
                Description
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                [ngClass]="{
                  'text-gray-300': theme === 'dark',
                  'text-blue-800': theme === 'light'
                }"
              >
                Category
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                [ngClass]="{
                  'text-gray-300': theme === 'dark',
                  'text-blue-800': theme === 'light'
                }"
              >
                Price
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                [ngClass]="{
                  'text-gray-300': theme === 'dark',
                  'text-blue-800': theme === 'light'
                }"
              >
                Stock
              </th>
              <th
                class="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                [ngClass]="{
                  'text-gray-300': theme === 'dark',
                  'text-blue-800': theme === 'light'
                }"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            class="divide-y divide-gray-200"
            [ngClass]="{
              'divide-gray-700': theme === 'dark',
              'bg-white': theme === 'light',
              'bg-gray-900': theme === 'dark'
            }"
          >
            <tr
              *ngFor="let product of filteredAppointments"
              [ngClass]="{
                'hover:bg-gray-50 transition-colors duration-150':
                  theme === 'light',
                'hover:bg-gray-800 transition-colors duration-150':
                  theme === 'dark'
              }"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  class="text-sm font-medium"
                  [ngClass]="{ 'text-white': theme === 'dark' }"
                >
                  {{ product.id }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  class="text-sm font-medium"
                  [ngClass]="{ 'text-white': theme === 'dark' }"
                >
                  {{ product.productName }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  class="text-sm truncate max-w-xs"
                  [ngClass]="{ 'text-white': theme === 'dark' }"
                >
                  {{ product.description }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  class="text-sm"
                  [ngClass]="{ 'text-white': theme === 'dark' }"
                >
                  {{ product.category }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  class="text-sm"
                  [ngClass]="{ 'text-white': theme === 'dark' }"
                >
                  {{ product.price | currency }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm px-2 py-1 rounded-full">
                  {{ product.stockQuantity }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  (click)="cancelAppointment(product.id)"
                  class="px-3 py-1 rounded-sm hover:bg-red-100 transition-colors duration-200"
                  [ngClass]="{
                    'text-red-600': theme === 'light',
                    'text-red-400 hover:bg-red-900/50': theme === 'dark'
                  }"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [],
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  currentUser: string | null = null;
  theme: string = 'light';
  themeClass: string = '';
  noDataThemeClass: string = '';
  searchName: string = '';
  searchCategory: string = '';
  sortByPrice: string = '';
  sortByStock: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.updateTheme();
    this.themeService.themeChange.subscribe(() => {
      this.updateTheme();
    });

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.loadAppointments(user);
      }
    });
  }

  updateTheme() {
    this.theme = this.themeService.getTheme();
    this.themeClass =
      this.theme === 'dark'
        ? 'bg-gray-900 text-white'
        : 'bg-white text-gray-900';
    this.noDataThemeClass =
      this.theme === 'dark'
        ? 'bg-gray-800 text-gray-300'
        : 'bg-gray-100 text-gray-700';
  }

  loadAppointments(userName: string) {
    this.appointmentService
      .getAppointmentsByUser(userName)
      .subscribe((appointments) => {
        this.appointments = appointments;
      });
  }

  editAppointment(product: Appointment): void {
    this.appointmentService.setEditingAppointment(product);
    this.router.navigate(['/appointments/book']);
  }

  cancelAppointment(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => {
          this.notificationService.showNotification(
            'Product deleted successfully',
            'success'
          );
          if (this.currentUser) {
            this.loadAppointments(this.currentUser);
          }
        },
        error: () => {
          this.notificationService.showNotification(
            'Failed to delete product',
            'error'
          );
        },
      });
    }
  }

  get filteredAppointments(): any[] {
    let filtered = this.appointments.filter((product) => {
      const matchesName = product.productName
        .toLowerCase()
        .includes(this.searchName.toLowerCase());
      const matchesCategory = product.category
        .toLowerCase()
        .includes(this.searchCategory.toLowerCase());
      return matchesName && matchesCategory;
    });

    if (this.sortByPrice) {
      filtered = filtered.sort((a, b) =>
        this.sortByPrice === 'asc' ? a.price - b.price : b.price - a.price
      );
    }

    if (this.sortByStock) {
      filtered = filtered.sort((a, b) =>
        this.sortByStock === 'asc'
          ? a.stockQuantity - b.stockQuantity
          : b.stockQuantity - a.stockQuantity
      );
    }

    return filtered;
  }
}
