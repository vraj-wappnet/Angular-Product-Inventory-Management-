// Update the Appointment interface
export interface Appointment {
  id: string;
  userName: string;
  createdAt?: string;
  productName: string;
  category: string;
  price: number;
  stockQuantity: number;
  description: string;
}

// Add new constants for categories
export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Furniture',
  'Books',
  'Groceries',
  'Other',
];

// Remove SERVICE_TYPES and TIME_SLOTS as they won't be needed anymore
