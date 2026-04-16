import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { afterNextRender } from '@angular/core';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  isDark = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Inicialización síncrona en el cliente: evita parpadeo de tema
      const saved = localStorage.getItem(STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const dark = saved !== null ? saved === 'dark' : prefersDark;
      this.isDark.set(dark);
      this._apply(dark);
    }
  }

  toggle() {
    if (!isPlatformBrowser(this.platformId)) return;
    const next = !this.isDark();
    this.isDark.set(next);
    this._apply(next);
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  }

  private _apply(dark: boolean) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
