import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { TaskService, Task, TaskCategory } from './services/task.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="p-4 md:p-12 flex justify-center font-sans">
      <div class="max-w-7xl w-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-700 rounded-xl p-6 md:p-10 transition-colors duration-300">
        <header class="mb-10 text-center">
          <h1 class="text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Mis Tareas</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2 text-lg">Organiza tu día de forma sencilla</p>
          <div class="flex items-center justify-center gap-3 mt-3 flex-wrap">
            @if (taskService.pendingCount() > 0) {
              <span class="bg-primary/10 text-primary-light font-semibold text-sm px-4 py-1 rounded-full shadow-sm">
                {{ taskService.pendingCount() }} pendiente{{ taskService.pendingCount() === 1 ? '' : 's' }}
              </span>
            } 
            
            @if (!taskService.autoDeleteCompleted()) {
              @if (taskService.tasks().length > 0 && taskService.pendingCount() === 0) {
                <span class="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-semibold text-sm px-4 py-1 rounded-full shadow-sm">
                  ✓ ¡Todo completado!
                </span>
              } @else if (taskService.completedCount() > 0) {
                <span class="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-semibold text-sm px-4 py-1 rounded-full shadow-sm">
                  ✓ {{ taskService.completedCount() }} completada{{ taskService.completedCount() === 1 ? '' : 's' }}
                </span>
              }
            }
          </div>
        </header>

        <section class="mb-8">
          <form class="flex flex-col sm:flex-row gap-3" (submit)="addTask($event)">
            <div class="relative flex-grow flex flex-col md:flex-row gap-3">
              <input 
                [formControl]="taskInput"
                class="w-full md:flex-grow p-4 border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-all text-xl" 
                placeholder="¿Qué necesitas hacer hoy?" 
                type="text"
              />
              <select 
                [formControl]="categoryInput" 
                class="w-full md:w-48 p-4 border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition-all text-xl cursor-pointer"
              >
                <option value="prioritario">Prioritario</option>
                <option value="urgente">Urgente</option>
                <option value="importante">Importante</option>
                <option value="normal">Normal</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <button 
              type="submit"
              [disabled]="taskInput.invalid"
              class="bg-primary-light hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 text-xl shadow-sm active:scale-95"
            >
              Añadir
            </button>
          </form>
        </section>

        <div class="flex flex-col md:flex-row gap-4 mb-8 border-b border-slate-100 dark:border-slate-700 pb-6 items-start md:items-center justify-between">
          @if (!taskService.autoDeleteCompleted()) {
            <nav class="flex flex-wrap gap-2">
              <button 
                (click)="taskService.setFilter('all')"
                [class]="taskService.filter() === 'all' ? 'bg-primary-light text-white' : 'bg-pastel-gray dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
                class="px-6 py-2 rounded-full text-lg font-medium transition-all"
              >Todas</button>
              <button 
                (click)="taskService.setFilter('pending')"
                [class]="taskService.filter() === 'pending' ? 'bg-primary-light text-white' : 'bg-pastel-gray dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
                class="px-6 py-2 rounded-full text-lg font-medium transition-all"
              >Pendientes</button>
              <button 
                (click)="taskService.setFilter('completed')"
                [class]="taskService.filter() === 'completed' ? 'bg-primary-light text-white' : 'bg-pastel-gray dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
                class="px-6 py-2 rounded-full text-lg font-medium transition-all"
              >Completadas</button>
            </nav>
          }
          
          <nav class="flex flex-wrap gap-2 items-center md:ml-auto">
            <span class="text-lg font-medium text-slate-500 dark:text-slate-400 mr-2">Filtrar prioridad:</span>
            <select 
              (change)="taskService.setCategoryFilter($any($event.target).value)"
              class="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-full px-6 py-2 text-lg font-medium focus:ring-2 focus:ring-primary-light outline-none cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <option value="all" [selected]="taskService.categoryFilter() === 'all'">Todas</option>
              <option value="prioritario" [selected]="taskService.categoryFilter() === 'prioritario'">Prioritario</option>
              <option value="urgente" [selected]="taskService.categoryFilter() === 'urgente'">Urgente</option>
              <option value="importante" [selected]="taskService.categoryFilter() === 'importante'">Importante</option>
              <option value="normal" [selected]="taskService.categoryFilter() === 'normal'">Normal</option>
              <option value="otro" [selected]="taskService.categoryFilter() === 'otro'">Otro</option>
            </select>
          </nav>
        </div>

        <section>
          <ul class="space-y-4">
            @for (task of taskService.filteredTasks(); track task.id) {
              <li class="group relative flex flex-col md:flex-row md:items-center justify-between p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  [class.bg-slate-50]="task.completed"
                  [class.border-transparent]="task.completed">
                
                <span class="absolute top-3 right-4 w-24 text-center text-[0.65rem] uppercase tracking-wider py-0.5 rounded-full font-bold"
                      [class.bg-red-100]="(task.category || 'normal') === 'prioritario'"
                      [class.dark:bg-red-900/40]="(task.category || 'normal') === 'prioritario'"
                      [class.text-red-700]="(task.category || 'normal') === 'prioritario'"
                      [class.dark:text-red-400]="(task.category || 'normal') === 'prioritario'"
                      
                      [class.bg-orange-100]="(task.category || 'normal') === 'urgente'"
                      [class.dark:bg-orange-900/40]="(task.category || 'normal') === 'urgente'"
                      [class.text-orange-700]="(task.category || 'normal') === 'urgente'"
                      [class.dark:text-orange-400]="(task.category || 'normal') === 'urgente'"

                      [class.bg-yellow-100]="(task.category || 'normal') === 'importante'"
                      [class.dark:bg-yellow-900/40]="(task.category || 'normal') === 'importante'"
                      [class.text-yellow-700]="(task.category || 'normal') === 'importante'"
                      [class.dark:text-yellow-400]="(task.category || 'normal') === 'importante'"

                      [class.bg-blue-100]="(task.category || 'normal') === 'normal'"
                      [class.dark:bg-blue-900/40]="(task.category || 'normal') === 'normal'"
                      [class.text-blue-700]="(task.category || 'normal') === 'normal'"
                      [class.dark:text-blue-400]="(task.category || 'normal') === 'normal'"
                      
                      [class.bg-slate-100]="(task.category || 'normal') === 'otro'"
                      [class.dark:bg-slate-700]="(task.category || 'normal') === 'otro'"
                      [class.text-slate-600]="(task.category || 'normal') === 'otro'"
                      [class.dark:text-slate-300]="(task.category || 'normal') === 'otro'"
                >
                  {{ task.category || 'normal' }}
                </span>

                <div class="flex items-start gap-4 flex-grow mt-2 md:mt-0">
                  <button 
                    (click)="taskService.toggleTask(task.id)"
                    class="mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0"
                    [class.bg-green-400]="task.completed"
                    [class.border-green-400]="task.completed"
                    [class.text-white]="task.completed"
                    [class.border-slate-300]="!task.completed"
                    [class.hover:border-primary-light]="!task.completed"
                    [title]="task.completed ? 'Marcar como pendiente' : 'Marcar como completada'"
                  >
                    @if (task.completed) {
                      <span class="text-sm">✓</span>
                    }
                  </button>
                  
                  <div class="flex-grow min-w-0 pr-12 md:pr-0">
                    <p class="text-xl font-medium transition-colors break-words"
                       [class.line-through]="task.completed"
                       [class.text-slate-400]="task.completed"
                       [class.dark:text-slate-500]="task.completed"
                       [class.text-slate-700]="!task.completed"
                       [class.dark:text-slate-200]="!task.completed"
                    >
                      {{ task.text }}
                    </p>
                    <div class="flex flex-col mt-1 text-sm text-slate-400 dark:text-slate-500">
                      <span>Creado: {{ task.createdAt | date:'d MMM y, HH:mm' }}</span>
                      @if (task.completedAt) {
                        <span class="text-green-500 dark:text-green-400 font-medium">Finalizado: {{ task.completedAt | date:'d MMM y, HH:mm' }}</span>
                      }
                    </div>
                  </div>
                </div>

                <!-- Acciones: editar / eliminar (con confirmación) -->
                <div class="flex items-center gap-2 mt-4 md:mt-0 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  @if (confirmingDeleteId() === task.id) {
                    <!-- Confirmación de eliminación inline -->
                    <div class="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg px-3 py-2 text-sm">
                      <span class="text-red-600 dark:text-red-400 font-medium">¿Eliminar?</span>
                      <button 
                        (click)="confirmDelete(task.id)"
                        class="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1 font-semibold transition-colors"
                      >Sí</button>
                      <button 
                        (click)="cancelDelete()"
                        class="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded px-3 py-1 font-semibold transition-colors"
                      >No</button>
                    </div>
                  } @else {
                    <button 
                      (click)="openEditModal(task)"
                      class="p-3 text-slate-500 dark:text-slate-400 hover:bg-pastel-blue dark:hover:bg-slate-700 hover:text-primary-light rounded-lg transition-colors"
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      (click)="requestDelete(task.id)"
                      class="p-3 text-slate-500 dark:text-slate-400 hover:bg-pastel-red dark:hover:bg-red-900/30 hover:text-red-500 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  }
                </div>
              </li>
            } @empty {
              <div class="text-center py-16 flex flex-col items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-200 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                @if (taskService.filter() === 'all') {
                  <p class="text-slate-400 dark:text-slate-500 text-xl font-medium">¡Añade tu primera tarea!</p>
                  <p class="text-slate-300 dark:text-slate-600 text-base">Escribe algo en el campo de arriba para empezar.</p>
                } @else {
                  <p class="text-slate-400 dark:text-slate-500 text-xl font-medium">No hay tareas {{ taskService.filter() === 'pending' ? 'pendientes' : 'completadas' }}</p>
                }
              </div>
            }
          </ul>
        </section>
      </div>

      <!-- Modal de edición -->
      @if (editingTask()) {
        <div class="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4" (click)="closeEditModal()">
          <div class="bg-white dark:bg-slate-800 p-8 rounded-xl w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-700" (click)="$event.stopPropagation()">
            <h3 class="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">Editar Tarea</h3>
            <input 
              [formControl]="editInput"
              class="w-full p-4 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 rounded-lg mb-4 text-xl focus:ring-2 focus:ring-primary-light outline-none transition-all" 
              type="text"
            />
            <select [formControl]="editCategoryInput" class="w-full p-4 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg mb-6 text-xl focus:ring-2 focus:ring-primary-light outline-none transition-all cursor-pointer">
              <option value="prioritario">Prioritario</option>
              <option value="urgente">Urgente</option>
              <option value="importante">Importante</option>
              <option value="normal">Normal</option>
              <option value="otro">Otro</option>
            </select>
            <div class="grid grid-cols-2 gap-3">
              <button (click)="closeEditModal()" class="w-full px-5 py-2.5 text-[1.4rem] bg-slate-100 dark:bg-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancelar</button>
              <button (click)="saveEdit()" [disabled]="editInput.invalid" class="w-full px-5 py-2.5 text-[1.4rem] bg-primary-light text-white rounded-lg font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors active:scale-95">Guardar Cambios</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class TasksComponent {
  taskService = inject(TaskService);

  taskInput = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] });
  categoryInput = new FormControl<TaskCategory>('normal', { nonNullable: true });

  editInput = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] });
  editCategoryInput = new FormControl<TaskCategory>('normal', { nonNullable: true });

  editingTask = signal<Task | null>(null);
  confirmingDeleteId = signal<number | null>(null);

  addTask(event: Event) {
    event.preventDefault();
    if (this.taskInput.valid && this.taskInput.value.trim()) {
      this.taskService.addTask(this.taskInput.value.trim(), this.categoryInput.value);
      this.taskInput.reset();
      this.categoryInput.setValue('normal');
    }
  }

  requestDelete(id: number) {
    this.confirmingDeleteId.set(id);
  }

  confirmDelete(id: number) {
    this.taskService.deleteTask(id);
    this.confirmingDeleteId.set(null);
  }

  cancelDelete() {
    this.confirmingDeleteId.set(null);
  }

  openEditModal(task: Task) {
    this.editingTask.set(task);
    this.editInput.setValue(task.text);
    this.editCategoryInput.setValue(task.category || 'normal');
    this.confirmingDeleteId.set(null);
  }

  closeEditModal() {
    this.editingTask.set(null);
    this.editInput.reset();
    this.editCategoryInput.setValue('normal');
  }

  saveEdit() {
    const task = this.editingTask();
    if (task && this.editInput.valid && this.editInput.value.trim()) {
      this.taskService.updateTask(task.id, this.editInput.value.trim(), this.editCategoryInput.value);
      this.closeEditModal();
    }
  }
}
