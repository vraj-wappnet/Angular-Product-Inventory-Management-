import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Router } from '@angular/router';
import { Appointment } from '../../appointments/models/appointment.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  template: `
    <div class="container mx-auto p-4" [ngClass]="themeClass">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <h2 class="text-2xl font-bold tracking-tight">
          Admin Dashboard - Products
        </h2>
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
            routerLink="/admin/services"
            class="text-blue-600 hover:text-blue-800 text-sm px-4 py-2 rounded-sm bg-blue-200 hover:bg-blue-100 transition-colors duration-200"
            [ngClass]="{
              'text-blue-400 hover:text-blue-300 bg-gray-800 hover:bg-gray-700':
                theme === 'dark'
            }"
          >
            Product Report
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
        *ngIf="filteredProducts.length === 0"
        class="p-4 rounded-lg text-center shadow-sm"
        [ngClass]="noDataThemeClass"
      >
        No matching products found.
      </div>

      <div
        *ngIf="filteredProducts.length > 0"
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
              *ngFor="let product of filteredProducts"
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
                  (click)="editAppointment(product)"
                  class="mr-1 px-3 py-1 rounded-sm hover:bg-blue-100 transition-colors duration-200"
                  [ngClass]="{
                    'text-blue-600': theme === 'light',
                    'text-blue-400 hover:bg-blue-900/50': theme === 'dark'
                  }"
                >
                  Edit
                </button>

                <button
                  (click)="deleteProduct(product.id)"
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
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];
  theme: string = 'light';
  themeClass: string = '';
  noDataThemeClass: string = '';
  searchName: string = '';
  searchCategory: string = '';
  sortByPrice: string = '';
  sortByStock: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.updateTheme();
    this.themeService.themeChange.subscribe(() => {
      this.updateTheme();
    });
    this.loadProducts();
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

  loadProducts() {
    this.appointmentService.getAppointments().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.notificationService.showNotification(
          'Failed to load products',
          'error'
        );
      },
    });
  }

  editAppointment(product: Appointment): void {
    this.appointmentService.setEditingAppointment(product);
    this.router.navigate(['/appointments/book']);
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => {
          this.notificationService.showNotification(
            'Product deleted successfully',
            'success'
          );
          this.loadProducts();
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

  get filteredProducts(): any[] {
    let filtered = this.products.filter((product) => {
      const matchesName =
        product.productName
          ?.toLowerCase()
          .includes(this.searchName.toLowerCase()) || false;
      const matchesCategory =
        product.category
          ?.toLowerCase()
          .includes(this.searchCategory.toLowerCase()) || false;
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
