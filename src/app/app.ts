import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileService } from './services/profile.service';
import { ThemeService } from './services/theme.service';
import { TaskService } from './services/task.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-background-light font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <!-- Top Navigation Bar -->
      <header class="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-8 py-4 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div class="flex items-center gap-4">
          <div class="text-primary size-8 flex items-center justify-center">
            <span class="material-symbols-outlined text-[3.2rem]">task_alt</span>
          </div>
          <h2 class="text-[2rem] font-bold leading-tight tracking-tight font-display">Mis Tareas</h2>
        </div>
        <div class="flex items-center gap-10">
          <nav class="hidden md:flex items-center gap-10">
            <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{exact: true}" class="text-[1.4rem] font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Tareas</a>
            <a routerLink="/settings" routerLinkActive="text-primary" class="text-[1.4rem] font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Ajustes</a>
          </nav>
          <div class="flex items-center gap-4">
            <!-- Theme Toggle Button -->
            <button
              (click)="themeService.toggle()"
              [title]="themeService.isDark() ? 'Activar modo claro' : 'Activar modo oscuro'"
              class="flex items-center justify-center rounded-xl h-12 w-12 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 active:scale-90"
            >
              <span class="material-symbols-outlined text-[2.2rem] transition-all duration-300">
                {{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}
              </span>
            </button>
            <!-- Notifications Button with Badge -->
            <div class="relative">
              <button
                title="Notificaciones"
                class="flex items-center justify-center rounded-xl h-12 w-12 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span class="material-symbols-outlined">notifications</span>
              </button>
              @if (taskService.pendingCount() > 0) {
                <span class="absolute -top-1 -right-1 min-w-[1.8rem] h-[1.8rem] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[1rem] font-bold leading-none shadow-md animate-bounce-in">
                  {{ taskService.pendingCount() > 99 ? '99+' : taskService.pendingCount() }}
                </span>
              }
            </div>
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-primary/20" 
                 [style.background-image]="'url(' + profileService.profile().avatarUrl + ')'">
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="px-8 py-8 text-center text-slate-400 dark:text-slate-500 text-[1.2rem] transition-colors duration-300">
        © 2026 Mis Tareas App. Todos los derechos reservados.
      </footer>
    </div>
  `
})
export class App {
  profileService = inject(ProfileService);
  themeService = inject(ThemeService);
  taskService = inject(TaskService);
}
