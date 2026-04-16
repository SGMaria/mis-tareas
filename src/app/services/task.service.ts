import { Injectable, signal, computed, effect } from '@angular/core';

export type TaskCategory = 'prioritario' | 'urgente' | 'importante' | 'normal' | 'otro';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
  category?: TaskCategory;
}

const STORAGE_KEY = 'mis-tareas-tasks';

function loadTasksFromStorage(): Task[] {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch {
    // Si hay error al parsear, ignorar y usar vacío
  }
  return [];
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  tasks = signal<Task[]>(loadTasksFromStorage());
  filter = signal<'all' | 'pending' | 'completed'>('all');
  categoryFilter = signal<TaskCategory | 'all'>('all');
  autoDeleteCompleted = signal<boolean>(typeof window !== 'undefined' ? localStorage.getItem('mis-tareas-autodelete') === 'true' : false);

  filteredTasks = computed(() => {
    let currentTasks = this.tasks();
    const currentFilter = this.filter();
    const currentCatFilter = this.categoryFilter();

    
    if (currentFilter === 'pending') {
      currentTasks = currentTasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
      currentTasks = currentTasks.filter(t => t.completed);
    }
    
    if (currentCatFilter !== 'all') {
      currentTasks = currentTasks.filter(t => (t.category || 'normal') === currentCatFilter);
    }
    
    const catOrder: Record<string, number> = {
      'prioritario': 1,
      'urgente': 2,
      'importante': 3,
      'normal': 4,
      'otro': 5,
    };

    return [...currentTasks].sort((a, b) => {
      // 1. Pending first, completed last
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // 2. Priority order
      const catA = a.category || 'normal';
      const catB = b.category || 'normal';
      if (catOrder[catA] !== catOrder[catB]) {
        return catOrder[catA] - catOrder[catB];
      }
      
      // 3. Creation order (oldest first, per id ascending)
      return a.id - b.id;
    });
  });

  pendingCount = computed(() => this.tasks().filter(t => !t.completed).length);
  completedCount = computed(() => this.tasks().filter(t => t.completed).length);

  constructor() {
    effect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks()));
      }
    });
  }

  addTask(text: string, category: TaskCategory = 'normal') {
    const newTask: Task = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      category
    };
    this.tasks.update(tasks => [newTask, ...tasks]);
  }

  toggleTask(id: number) {
    if (this.autoDeleteCompleted()) {
      const task = this.tasks().find(t => t.id === id);
      if (task && !task.completed) {
         this.deleteTask(id);
         return;
      }
    }

    this.tasks.update(tasks => tasks.map(task => {
      if (task.id === id) {
        const completed = !task.completed;
        return { ...task, completed, completedAt: completed ? new Date().toISOString() : null };
      }
      return task;
    }));
  }

  deleteTask(id: number) {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  updateTask(id: number, text: string, category: TaskCategory = 'normal') {
    this.tasks.update(tasks => tasks.map(task => task.id === id ? { ...task, text, category } : task));
  }

  setFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }

  setCategoryFilter(filter: TaskCategory | 'all') {
    this.categoryFilter.set(filter);
  }

  setAutoDeleteCompleted(value: boolean) {
    this.autoDeleteCompleted.set(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mis-tareas-autodelete', String(value));
    }
    if (value) {
      this.filter.set('all');
      this.tasks.update(tasks => tasks.filter(t => !t.completed));
    }
  }
}

