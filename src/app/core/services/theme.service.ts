import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeKey = 'theme';
  private themeSubject = new BehaviorSubject<string>('light'); // 🔹 Tracks the current theme
  themeChange = this.themeSubject.asObservable(); // 🔹 Expose observable for components

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem(this.themeKey) || 'light';
      this.setTheme(savedTheme);
    }
  }

  setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.themeKey, theme);
    }
    this.themeSubject.next(theme); // 🔹 Emit theme change
  }

  toggleTheme() {
    const currentTheme = this.themeSubject.getValue(); // 🔹 Get current theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  getTheme(): string {
    return this.themeSubject.getValue(); // 🔹 Return current theme value
  }
}
