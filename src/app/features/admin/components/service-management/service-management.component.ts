import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { AppointmentService } from '../../../../core/services/appointment.service';

Chart.register(...registerables);

interface Product {
  id: string;
  name: string;
  category: string;
  stockQuantity: number;
  price: number;
  description?: string;
}

interface CategoryCount {
  category: string;
  count: number;
}

@Component({
  selector: 'app-product-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Template remains the same as your previous version -->
    <!-- ... -->
  `,
  styles: [],
})
export class ProductDashboardComponent implements OnInit {
  products: Product[] = [];
  totalProducts: number = 0;
  lowStockCount: number = 0;
  lowStockProducts: Product[] = [];
  topCategory: CategoryCount | null = null;
  theme: string = 'light';
  themeClass: string = '';
  cardThemeClass: string = '';
  private stockChart: Chart<'bar'> | null = null;
  private categoryChart: Chart<'doughnut'> | null = null;

  constructor(
    private productService: AppointmentService,
    private notificationService: NotificationService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.updateTheme();
    this.themeService.themeChange.subscribe(() => {
      this.updateTheme();
      this.updateChartsTheme();
    });

    this.loadProducts();
  }

  updateTheme() {
    this.theme = this.themeService.getTheme();
    this.themeClass = this.theme === 'dark' ? 'bg-gray-900' : 'bg-white';
    this.cardThemeClass = this.theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.analyzeProducts();
        this.createCharts();
      },
      error: (err: Error) => {
        console.error('Error loading products:', err);
        this.notificationService.showNotification(
          'Failed to load products',
          'error'
        );
      },
    });
  }

  analyzeProducts() {
    this.totalProducts = this.products.length;

    this.lowStockProducts = this.products.filter((p) => p.stockQuantity < 10);
    this.lowStockCount = this.lowStockProducts.length;

    const categoryCounts: Record<string, number> = {};
    this.products.forEach((product) => {
      categoryCounts[product.category] =
        (categoryCounts[product.category] || 0) + 1;
    });

    const sortedCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    this.topCategory = sortedCategories[0] || null;
  }

  createCharts() {
    this.createStockChart();
    this.createCategoryChart();
  }

  createStockChart() {
    const stockCtx = document.getElementById('stockChart') as HTMLCanvasElement;
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['0-10', '11-50', '51-100', '100+'],
        datasets: [
          {
            label: 'Products by Stock Level',
            data: this.calculateStockRanges(),
            backgroundColor: this.theme === 'dark' ? '#3B82F6' : '#1D4ED8',
            borderColor: this.theme === 'dark' ? '#1E40AF' : '#1E3A8A',
            borderWidth: 1,
          },
        ],
      },
      options: this.getBarChartOptions('Stock Quantity Distribution'),
    };

    if (this.stockChart) {
      this.stockChart.destroy();
    }
    this.stockChart = new Chart(stockCtx, config);
  }

  createCategoryChart() {
    const categoryCtx = document.getElementById(
      'categoryChart'
    ) as HTMLCanvasElement;
    const categoryData = this.getCategoryChartData();
    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: categoryData.labels,
        datasets: [
          {
            data: categoryData.values,
            backgroundColor: this.getCategoryColors(categoryData.labels.length),
            borderWidth: 1,
            borderColor: this.theme === 'dark' ? '#374151' : '#E5E7EB',
          },
        ],
      },
      options: this.getDoughnutChartOptions('Products by Category'),
    };

    if (this.categoryChart) {
      this.categoryChart.destroy();
    }
    this.categoryChart = new Chart(categoryCtx, config);
  }

  calculateStockRanges(): number[] {
    const ranges = [0, 0, 0, 0];
    this.products.forEach((product) => {
      if (product.stockQuantity <= 10) ranges[0]++;
      else if (product.stockQuantity <= 50) ranges[1]++;
      else if (product.stockQuantity <= 100) ranges[2]++;
      else ranges[3]++;
    });
    return ranges;
  }

  getCategoryChartData(): { labels: string[]; values: number[] } {
    const categoryCounts: Record<string, number> = {};
    this.products.forEach((product) => {
      categoryCounts[product.category] =
        (categoryCounts[product.category] || 0) + 1;
    });

    const labels = Object.keys(categoryCounts);
    const values = Object.values(categoryCounts);

    const combined = labels.map((label, index) => ({
      label,
      value: values[index],
    }));
    combined.sort((a, b) => b.value - a.value);

    if (combined.length > 5) {
      const top5 = combined.slice(0, 5);
      const others = combined
        .slice(5)
        .reduce((sum, item) => sum + item.value, 0);
      return {
        labels: [...top5.map((item) => item.label), 'Others'],
        values: [...top5.map((item) => item.value), others],
      };
    }

    return {
      labels: combined.map((item) => item.label),
      values: combined.map((item) => item.value),
    };
  }

  getCategoryColors(count: number): string[] {
    const baseColors = [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#EC4899',
      '#14B8A6',
      '#F97316',
      '#64748B',
      '#84CC16',
    ];
    return baseColors.slice(0, count);
  }

  getBarChartOptions(title: string) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: this.theme === 'dark' ? '#E5E7EB' : '#111827',
          },
        },
        title: {
          display: true,
          text: title,
          color: this.theme === 'dark' ? '#E5E7EB' : '#111827',
          font: {
            size: 16,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: this.theme === 'dark' ? '#9CA3AF' : '#6B7280',
          },
          grid: {
            color: this.theme === 'dark' ? '#374151' : '#E5E7EB',
          },
        },
        x: {
          ticks: {
            color: this.theme === 'dark' ? '#9CA3AF' : '#6B7280',
          },
          grid: {
            color: this.theme === 'dark' ? '#374151' : '#E5E7EB',
          },
        },
      },
    };
  }

  getDoughnutChartOptions(title: string) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right' as const,
          labels: {
            color: this.theme === 'dark' ? '#E5E7EB' : '#111827',
          },
        },
        title: {
          display: true,
          text: title,
          color: this.theme === 'dark' ? '#E5E7EB' : '#111827',
          font: {
            size: 16,
          },
        },
      },
    };
  }

  updateChartsTheme() {
    if (this.stockChart) {
      const options = this.stockChart.options;
      if (options.plugins?.title) {
        options.plugins.title.color =
          this.theme === 'dark' ? '#E5E7EB' : '#111827';
      }
      if (options.scales?.x) {
        options.scales.x.ticks = {
          color: this.theme === 'dark' ? '#9CA3AF' : '#6B7280',
        };
        options.scales.x.grid = {
          color: this.theme === 'dark' ? '#374151' : '#E5E7EB',
        };
      }
      if (options.scales?.y) {
        options.scales.y.ticks = {
          color: this.theme === 'dark' ? '#9CA3AF' : '#6B7280',
        };
        options.scales.y.grid = {
          color: this.theme === 'dark' ? '#374151' : '#E5E7EB',
        };
      }
      this.stockChart.update();
    }

    if (this.categoryChart) {
      const options = this.categoryChart.options;
      if (options.plugins?.title) {
        options.plugins.title.color =
          this.theme === 'dark' ? '#E5E7EB' : '#111827';
      }
      if (options.plugins?.legend?.labels) {
        options.plugins.legend.labels.color =
          this.theme === 'dark' ? '#E5E7EB' : '#111827';
      }
      this.categoryChart.update();
    }
  }
}
