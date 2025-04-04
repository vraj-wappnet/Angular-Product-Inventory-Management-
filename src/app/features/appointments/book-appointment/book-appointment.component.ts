import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appointment, CATEGORIES } from '../models/appointment.model';
import { AppointmentService } from '../../../core/services/appointment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-book-appointment',
  standalone: false,
  template: `
    <div
      class="max-w-md mx-auto p-6 rounded-lg shadow-md"
      [ngClass]="themeClass"
    >
      <h2
        class="text-2xl font-bold mb-6 text-center"
        [ngClass]="{ 'text-white': theme === 'dark' }"
      >
        {{ isEditing ? 'Edit Product' : 'Add New Product' }}
      </h2>
      <form
        [formGroup]="appointmentForm"
        (ngSubmit)="onSubmit()"
        class="space-y-4"
      >
        <!-- Product Name -->
        <div>
          <label
            for="productName"
            class="block text-sm font-medium"
            [ngClass]="{
              'text-gray-300': theme === 'dark',
              'text-gray-700': theme === 'light'
            }"
          >
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            formControlName="productName"
            class="mt-1 block w-full rounded-md shadow-sm p-2 border"
            [ngClass]="inputThemeClass"
          />
          <div
            *ngIf="
              appointmentForm.get('productName')?.invalid &&
              appointmentForm.get('productName')?.touched
            "
            class="text-red-500 text-sm mt-1"
          >
            Product name is required
          </div>
        </div>

        <!-- Category -->
        <div>
          <label
            for="category"
            class="block text-sm font-medium"
            [ngClass]="{
              'text-gray-300': theme === 'dark',
              'text-gray-700': theme === 'light'
            }"
          >
            Category
          </label>
          <select
            id="category"
            formControlName="category"
            class="mt-1 block w-full rounded-md shadow-sm p-2 border"
            [ngClass]="inputThemeClass"
          >
            <option value="">Select a category</option>
            <option *ngFor="let cat of categories" [value]="cat">
              {{ cat }}
            </option>
          </select>
          <div
            *ngIf="
              appointmentForm.get('category')?.invalid &&
              appointmentForm.get('category')?.touched
            "
            class="text-red-500 text-sm mt-1"
          >
            Category is required
          </div>
        </div>

        <!-- Price -->
        <div>
          <label
            for="price"
            class="block text-sm font-medium"
            [ngClass]="{
              'text-gray-300': theme === 'dark',
              'text-gray-700': theme === 'light'
            }"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            formControlName="price"
            min="0"
            step="0.01"
            class="mt-1 block w-full rounded-md shadow-sm p-2 border"
            [ngClass]="inputThemeClass"
          />
          <div
            *ngIf="
              appointmentForm.get('price')?.invalid &&
              appointmentForm.get('price')?.touched
            "
            class="text-red-500 text-sm mt-1"
          >
            Valid price is required
          </div>
        </div>

        <!-- Stock Quantity -->
        <div>
          <label
            for="stockQuantity"
            class="block text-sm font-medium"
            [ngClass]="{
              'text-gray-300': theme === 'dark',
              'text-gray-700': theme === 'light'
            }"
          >
            Stock Quantity
          </label>
          <input
            type="number"
            id="stockQuantity"
            formControlName="stockQuantity"
            min="0"
            class="mt-1 block w-full rounded-md shadow-sm p-2 border"
            [ngClass]="inputThemeClass"
          />
          <div
            *ngIf="
              appointmentForm.get('stockQuantity')?.invalid &&
              appointmentForm.get('stockQuantity')?.touched
            "
            class="text-red-500 text-sm mt-1"
          >
            Valid quantity is required
          </div>
        </div>

        <!-- Description -->
        <div>
          <label
            for="description"
            class="block text-sm font-medium"
            [ngClass]="{
              'text-gray-300': theme === 'dark',
              'text-gray-700': theme === 'light'
            }"
          >
            Description
          </label>
          <textarea
            id="description"
            formControlName="description"
            rows="3"
            class="mt-1 block w-full rounded-md shadow-sm p-2 border"
            [ngClass]="inputThemeClass"
          ></textarea>
          <div
            *ngIf="
              appointmentForm.get('description')?.invalid &&
              appointmentForm.get('description')?.touched
            "
            class="text-red-500 text-sm mt-1"
          >
            Description is required
          </div>
        </div>

        <!-- Submit/Cancel Buttons -->
        <div class="flex space-x-4" *ngIf="isEditing">
          <button
            type="button"
            (click)="cancelEdit()"
            class="w-full py-2 px-4 rounded-md"
            [ngClass]="{
              'bg-gray-500 hover:bg-gray-600 text-white': theme === 'light',
              'bg-gray-700 hover:bg-gray-600 text-white': theme === 'dark'
            }"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="!appointmentForm.valid"
            class="w-full py-2 px-4 rounded-md"
            [ngClass]="{
              'bg-blue-600 hover:bg-blue-700 text-white': theme === 'light',
              'bg-blue-700 hover:bg-blue-600 text-white': theme === 'dark'
            }"
          >
            Update Product
          </button>
        </div>

        <button
          *ngIf="!isEditing"
          type="submit"
          [disabled]="!appointmentForm.valid || !currentUser || isLoading"
          class="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400"
          [ngClass]="{
            'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500':
              theme === 'light',
            'bg-blue-700 hover:bg-blue-600 text-white focus:ring-blue-400':
              theme === 'dark'
          }"
        >
          <span *ngIf="!isLoading">Add Product</span>
          <span *ngIf="isLoading">Saving...</span>
        </button>
      </form>
    </div>
  `,
  styles: [],
})
export class BookAppointmentComponent implements OnInit {
  editingAppointmentId: string | null = null;
  appointmentForm: FormGroup;
  categories = CATEGORIES;
  currentUser: string | null = null;
  isLoading = false;
  editingAppointment: Appointment | null = null;
  isEditing = false;
  theme: string = 'light';
  themeClass: string = '';
  inputThemeClass: string = '';

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.appointmentForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.updateTheme();
    this.themeService.themeChange.subscribe(() => {
      this.updateTheme();
    });

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.appointmentService.editingAppointment$.subscribe((appointment) => {
      if (appointment) {
        this.isEditing = true;
        this.editingAppointment = appointment;
        this.appointmentForm.patchValue({
          productName: appointment.productName,
          category: appointment.category,
          price: appointment.price,
          stockQuantity: appointment.stockQuantity,
          description: appointment.description,
        });
      } else {
        this.isEditing = false;
        this.editingAppointment = null;
        this.appointmentForm.reset();
      }
    });
  }

  updateTheme() {
    this.theme = this.themeService.getTheme();
    this.themeClass =
      this.theme === 'dark'
        ? 'bg-gray-800 text-white'
        : 'bg-white text-gray-900';
    this.inputThemeClass =
      this.theme === 'dark'
        ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-400'
        : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  }

  // Update the onSubmit() method:
  onSubmit() {
    if (this.appointmentForm.valid && this.currentUser) {
      this.isLoading = true;

      const appointmentData: Appointment = {
        ...this.appointmentForm.value,
        userName: this.currentUser,
        status: 'Booked',
      };

      if (this.isEditing && this.editingAppointment) {
        appointmentData.id = this.editingAppointment.id;
        appointmentData.createdAt = this.editingAppointment.createdAt;

        this.appointmentService.updateAppointment(appointmentData).subscribe({
          next: () => {
            this.handleSuccess('Product updated successfully!');
            this.appointmentService.clearEditingAppointment();
            this.router.navigate(['/admin']); // Add this line
          },
          error: (err) => this.handleError(err, 'Failed to update product.'),
        });
      } else {
        this.appointmentService.bookAppointment(appointmentData).subscribe({
          next: () => {
            this.handleSuccess('Product added successfully!');
            this.router.navigate(['/appointments']); // Add this line
          },
          error: (err) => this.handleError(err, 'Failed to add product.'),
        });
      }
    }
  }

  // Update the handleSuccess method to remove the navigation:

  private handleSuccess(message: string): void {
    this.notificationService.showNotification(message, 'success');
    this.appointmentForm.reset();
    this.isLoading = false;
  }

  private handleError(error: any, message: string): void {
    console.error('Error:', error);
    this.notificationService.showNotification(message, 'error');
    this.isLoading = false;
  }

  cancelEdit(): void {
    this.appointmentService.clearEditingAppointment();
  }
}
