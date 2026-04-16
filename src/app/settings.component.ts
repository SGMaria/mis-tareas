import { ChangeDetectionStrategy, Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProfileService } from './services/profile.service';
import { TaskService } from './services/task.service';

type SaveStatus = 'idle' | 'saved' | 'error';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <div class="flex justify-center py-12 px-4 font-display">
      <div class="max-w-[80rem] w-full flex flex-col gap-10">
        <div class="flex flex-col gap-2">
          <h1 class="text-[3.6rem] font-black leading-tight tracking-tight text-slate-900 dark:text-slate-100">Configuración de Perfil</h1>
          <p class="text-slate-500 dark:text-slate-400 text-[1.6rem]">Gestiona tu información personal y apariencia en la plataforma.</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Left: Preview Section -->
          <div class="lg:col-span-1 flex flex-col">
            <div class="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-6 transition-colors duration-300 flex-1 h-full">
              <div class="flex flex-col items-center gap-2 mb-2">
                <h3 class="text-[2rem] font-bold dark:text-slate-100">Foto de Perfil</h3>
                <p class="text-[1.3rem] text-slate-500 dark:text-slate-400">Cómo te ven los demás</p>
              </div>

              <div class="relative group">
                <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-52 w-52 border-4 border-primary/10 shadow-inner" 
                     [style.background-image]="'url(' + profileForm.value.avatarUrl + ')'">
                </div>
                <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]">
                  <span class="material-symbols-outlined text-white text-[3.2rem]">photo_camera</span>
                </div>
              </div>
              
              <button 
                type="button"
                (click)="removePhoto()"
                class="mt-4 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 px-6 py-3 rounded-xl font-bold text-[1.4rem] flex items-center justify-center gap-2 mx-auto transition-all active:scale-95"
              >
                <span class="material-symbols-outlined text-[1.8rem]">delete</span>
                Eliminar foto
              </button>
            </div>
          </div>
                   <!-- Right: Form Section -->
          <div class="lg:col-span-2 h-full">
            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-8 transition-colors duration-300 h-full">
              <div class="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-700 pb-4">
                <h3 class="text-[2rem] font-bold dark:text-slate-100">Información Personal</h3>
                <p class="text-[1.3rem] text-slate-500 dark:text-slate-400">Actualiza tus datos básicos para identificarte en la app.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="flex flex-col gap-3">
                  <label for="firstName" class="text-[1.4rem] font-bold text-slate-700 dark:text-slate-300 ml-1">Nombre</label>
                  <div class="relative group">
                    <span class="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">person</span>
                    <input 
                      id="firstName"
                      formControlName="firstName"
                      class="w-full pl-16 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder-slate-500 text-[1.6rem] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                      [class.border-red-400]="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched"
                      placeholder="Ej: Juan" 
                      type="text"
                    />
                  </div>
                  @if (profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched) {
                    <p class="text-red-500 text-[1.2rem] flex items-center gap-1 ml-1 font-medium">
                      <span class="material-symbols-outlined text-[1.4rem]">error</span>
                      El nombre es obligatorio
                    </p>
                  }
                </div>

                <div class="flex flex-col gap-3">
                  <label for="lastName" class="text-[1.4rem] font-bold text-slate-700 dark:text-slate-300 ml-1">Apellidos</label>
                  <div class="relative group">
                    <span class="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">badge</span>
                    <input 
                      id="lastName"
                      formControlName="lastName"
                      class="w-full pl-16 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder-slate-500 text-[1.6rem] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                      [class.border-red-400]="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched"
                      placeholder="Ej: Pérez" 
                      type="text"
                    />
                  </div>
                  @if (profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched) {
                    <p class="text-red-500 text-[1.2rem] flex items-center gap-1 ml-1 font-medium">
                      <span class="material-symbols-outlined text-[1.4rem]">error</span>
                      Los apellidos son obligatorios
                    </p>
                  }
                </div>
              </div>
              
              <div class="flex flex-col gap-3">
                <label for="avatarUrl" class="text-[1.4rem] font-bold text-slate-700 dark:text-slate-300 ml-1">URL de la Imagen de Perfil</label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">link</span>
                  <input 
                    id="avatarUrl"
                    formControlName="avatarUrl"
                    class="w-full pl-16 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder-slate-500 text-[1.6rem] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                    [class.border-red-400]="profileForm.get('avatarUrl')?.invalid && profileForm.get('avatarUrl')?.touched"
                    placeholder="https://ejemplo.com/mi-foto.jpg" 
                    type="url"
                  />
                </div>
                @if (profileForm.get('avatarUrl')?.invalid && profileForm.get('avatarUrl')?.touched) {
                  <p class="text-red-500 text-[1.2rem] flex items-center gap-1 ml-1 font-medium">
                    <span class="material-symbols-outlined text-[1.4rem]">error</span>
                    URL inválida
                  </p>
                }
                <p class="text-[1.2rem] text-slate-400 dark:text-slate-500 mt-1 italic ml-1">Se recomienda una imagen cuadrada de al menos 400x400px.</p>
                @if (avatarError()) {
                  <div class="mt-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl font-medium text-[1.4rem] animate-pulse-once flex items-center gap-3 border border-red-100 dark:border-red-900/40">
                     <span class="material-symbols-outlined text-[2rem]">warning</span>
                     {{ avatarError() }}
                  </div>
                }
              </div>
            </form>
          </div>
          
          <!-- Task Preferences Section -->
          <div class="lg:col-span-3">
             <div class="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-6 transition-colors duration-300">
                <div class="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-700 pb-4">
                  <h3 class="text-[2rem] font-bold dark:text-slate-100">Preferencias de Tareas</h3>
                  <p class="text-[1.3rem] text-slate-500 dark:text-slate-400">Personaliza el comportamiento de tu lista de tareas.</p>
                </div>
                
                <div class="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    id="autoDelete"
                    [checked]="taskService.autoDeleteCompleted()"
                    (click)="promptAutoDeleteToggle($event)"
                    class="w-6 h-6 rounded text-primary focus:ring-primary focus:ring-2 border-slate-300 cursor-pointer"
                  >
                  <label for="autoDelete" class="text-[1.6rem] text-slate-700 dark:text-slate-300 font-medium cursor-pointer flex-1">
                    Borrar automáticamente tareas completadas
                  </label>
                </div>
                <p class="text-[1.4rem] text-slate-500 dark:text-slate-400 lg:ml-10">
                  Si marcas esta opción, cualquier tarea que se marque como completada será eliminada inmediatamente. También ocultará el contador de tareas completadas.
                </p>
             </div>
          </div>
        </div>

        <!-- Global Status Messages and Actions below -->
        <div class="flex flex-col gap-6 mt-4">
          @if (saveStatus() === 'saved') {
            <div class="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg px-5 py-4 text-[1.6rem] font-medium animate-pulse-once shadow-sm">
              <span class="material-symbols-outlined text-green-500 dark:text-green-400 text-[2.4rem]">check_circle</span>
              ¡Cambios guardados correctamente!
            </div>
          }
          @if (saveStatus() === 'error') {
            <div class="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg px-5 py-4 text-[1.6rem] font-medium shadow-sm">
              <span class="material-symbols-outlined text-red-500 dark:text-red-400 text-[2.4rem]">error</span>
              Ha ocurrido un error, no se han podido guardar los cambios.
            </div>
          }
          
          <div class="pt-6 flex justify-end gap-4">
            <button 
              type="button"
              (click)="resetForm()"
              class="px-8 py-3 rounded-lg text-[1.6rem] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="button"
              (click)="saveProfile()"
              class="px-10 py-3 rounded-lg bg-primary text-white text-[1.6rem] font-bold hover:opacity-90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
            >
              <span class="material-symbols-outlined text-[2rem]">save</span>
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación Auto Delete -->
    @if (showAutoDeleteConfirmModal()) {
      <div class="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4" (click)="cancelAutoDelete()">
        <div class="bg-white dark:bg-slate-800 p-10 rounded-[2rem] w-full max-w-3xl shadow-2xl border border-slate-200 dark:border-slate-700" (click)="$event.stopPropagation()">
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-6">
              <span class="material-symbols-outlined text-orange-500 text-[3.6rem]">warning</span>
            </div>
            <h3 class="text-[2.8rem] font-bold mb-6 text-slate-800 dark:text-slate-100">
              ¿Estás seguro?
            </h3>
            
            <div class="mb-10 w-full max-w-2xl">
              <p class="text-[1.8rem] text-slate-700 dark:text-slate-200 font-medium mb-6">
                {{ pendingAutoDeleteTargetValue() ? 'Estás a punto de activar el borrado automático de tareas.' : 'Estás a punto de desactivar el borrado automático de tareas.' }}
              </p>
              
              <hr class="border-t-2 border-slate-100 dark:border-slate-700 mb-6 mx-auto w-4/5">
              
              <p class="text-[1.5rem] text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                @if (pendingAutoDeleteTargetValue()) {
                  ¡Atención! Al activar esta opción se borrarán instantáneamente tus tareas completadas actuales, y las tareas que borres en el futuro no se podrán recuperar.
                } @else {
                  Se dejarán de eliminar permanentemente las tareas cuando las completes.
                }
              </p>
            </div>

            <div class="flex gap-5 w-full max-w-2xl">
              <button (click)="cancelAutoDelete()" class="flex-1 px-8 py-4 text-[1.6rem] bg-slate-100 dark:bg-slate-700 dark:text-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                Cancelar
              </button>
              <button (click)="confirmAutoDelete()" class="flex-1 px-8 py-4 text-[1.6rem] bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-colors shadow-sm active:scale-95">
                Sí, estoy seguro
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal de confirmación para eliminar foto -->
    @if (showDeleteModal()) {
      <div class="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4" (click)="cancelDeletePhoto()">
        <div class="bg-white dark:bg-slate-800 p-10 rounded-[2rem] w-full max-w-3xl shadow-2xl border border-slate-200 dark:border-slate-700" (click)="$event.stopPropagation()">
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
              <span class="material-symbols-outlined text-red-500 text-[3.6rem]">warning</span>
            </div>
            <h3 class="text-[2.8rem] font-bold mb-6 text-slate-800 dark:text-slate-100">
              Eliminar foto
            </h3>
            
            <div class="mb-10 w-full max-w-2xl">
              <p class="text-[1.8rem] text-slate-700 dark:text-slate-200 font-medium mb-6">
                ¿Estás seguro de que deseas eliminar tu foto de perfil?
              </p>
              
              <hr class="border-t-2 border-slate-100 dark:border-slate-700 mb-6 mx-auto w-4/5">
              
              <p class="text-[1.5rem] text-slate-500 dark:text-slate-400 leading-relaxed">
                Al hacerlo, los cambios se guardarán automáticamente y se establecerá una imagen predeterminada.
              </p>
            </div>

            <div class="flex gap-5 w-full max-w-2xl">
              <button (click)="cancelDeletePhoto()" class="flex-1 px-8 py-4 text-[1.6rem] bg-slate-100 dark:bg-slate-700 dark:text-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                No, mantener
              </button>
              <button (click)="confirmDeletePhoto()" class="flex-1 px-8 py-4 text-[1.6rem] bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-sm active:scale-95">
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal de Cambios sin Guardar -->
    @if (showUnsavedModal()) {
      <div class="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 p-4" (click)="cancelLeave()">
        <div class="bg-white dark:bg-slate-800 p-10 rounded-[2rem] w-full max-w-3xl shadow-2xl border border-slate-200 dark:border-slate-700" (click)="$event.stopPropagation()">
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
              <span class="material-symbols-outlined text-blue-500 text-[3.6rem]">save_as</span>
            </div>
            <h3 class="text-[2.8rem] font-bold mb-6 text-slate-800 dark:text-slate-100">
              Tienes cambios sin guardar
            </h3>
            
            <div class="mb-10 w-full max-w-2xl">
              <p class="text-[1.8rem] text-slate-700 dark:text-slate-200 font-medium mb-6">
                Si sales ahora perderás todos los cambios que hiciste.
              </p>
              
              <hr class="border-t-2 border-slate-100 dark:border-slate-700 mb-6 mx-auto w-4/5">
              
              <p class="text-[1.5rem] text-slate-500 dark:text-slate-400 leading-relaxed">
                ¿Deseas guardar los cambios antes de salir, descartarlos o permanecer en Ajustes?
              </p>
            </div>

            <div class="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
              <button (click)="cancelLeave()" class="flex-1 px-4 py-4 text-[1.6rem] bg-slate-100 dark:bg-slate-700 dark:text-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                Cancelar
              </button>
              <button (click)="discardChanges()" class="flex-1 px-4 py-4 text-[1.6rem] bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-2xl font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                Descartar
              </button>
              <button (click)="saveAndLeave()" class="flex-1 px-4 py-4 text-[1.6rem] bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-colors shadow-sm active:scale-95">
                Guardar y salir
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class SettingsComponent implements OnInit {
  profileService = inject(ProfileService);
  taskService = inject(TaskService);
  fb = inject(FormBuilder);
  
  saveStatus = signal<SaveStatus>('idle');
  showDeleteModal = signal<boolean>(false);
  showAutoDeleteConfirmModal = signal<boolean>(false);
  pendingAutoDeleteTargetValue = signal<boolean>(false);
  private statusTimer: ReturnType<typeof setTimeout> | null = null;

  profileForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    avatarUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
  });

  cdr = inject(ChangeDetectorRef);
  previousValidAvatar = '';
  avatarError = signal<string>('');
  showUnsavedModal = signal<boolean>(false);
  resolveDeactivate: ((value: boolean) => void) | null = null;

  ngOnInit() {
    this.resetForm();

    this.profileForm.get('avatarUrl')?.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe(url => {
      if (!url || url === this.previousValidAvatar) return;
      
      const img = new Image();
      img.onload = () => {
        this.onAvatarLoad(url);
      };
      img.onerror = () => {
        this.onAvatarError();
      };
      img.src = url;
    });
  }

  resetForm() {
    this.profileForm.patchValue(this.profileService.profile());
    this.profileForm.markAsUntouched();
    this.previousValidAvatar = this.profileService.profile().avatarUrl;
    this.saveStatus.set('idle');
  }

  saveProfile() {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      try {
        this.profileService.updateProfile(this.profileForm.getRawValue());
        this.profileForm.markAsPristine();
        this.profileForm.markAsUntouched();
        this.setSaveStatus('saved');
      } catch {
        this.setSaveStatus('error');
      }
    } else {
      this.setSaveStatus('error');
    }
  }

  private setSaveStatus(status: SaveStatus) {
    if (this.statusTimer) clearTimeout(this.statusTimer);
    this.saveStatus.set(status);
    this.statusTimer = setTimeout(() => {
      this.saveStatus.set('idle');
    }, 5000);
  }

  onAvatarError() {
    this.avatarError.set('No se puede generar el cambio, intente de nuevo o con otra imagen.');
    this.profileForm.patchValue({ avatarUrl: this.previousValidAvatar }, {emitEvent: false});
    this.cdr.markForCheck();
    
    setTimeout(() => {
       this.avatarError.set('');
       this.cdr.markForCheck();
    }, 6000);
  }

  onAvatarLoad(validUrl: string) {
    this.avatarError.set('');
    this.previousValidAvatar = validUrl;
    this.profileForm.get('avatarUrl')?.markAsDirty();
    this.saveProfile();
    this.cdr.markForCheck();
  }

  canDeactivate(): Promise<boolean> | boolean {
    const currentValues = this.profileForm.getRawValue();
    const savedValues = this.profileService.profile();
    
    const hasRealChanges = 
      currentValues.firstName !== savedValues.firstName ||
      currentValues.lastName !== savedValues.lastName ||
      currentValues.avatarUrl !== savedValues.avatarUrl;

    if (this.profileForm.dirty && hasRealChanges) {
      this.showUnsavedModal.set(true);
      return new Promise((resolve) => {
        this.resolveDeactivate = resolve;
      });
    }
    return true;
  }

  discardChanges() {
    this.resetForm();
    this.showUnsavedModal.set(false);
    if (this.resolveDeactivate) this.resolveDeactivate(true);
  }

  saveAndLeave() {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      this.profileService.updateProfile(this.profileForm.getRawValue());
      this.showUnsavedModal.set(false);
      if (this.resolveDeactivate) this.resolveDeactivate(true);
    } else {
      this.showUnsavedModal.set(false);
      if (this.resolveDeactivate) this.resolveDeactivate(false);
      this.setSaveStatus('error');
    }
  }

  cancelLeave() {
    this.showUnsavedModal.set(false);
    if (this.resolveDeactivate) this.resolveDeactivate(false);
  }

  removePhoto() {
    this.showDeleteModal.set(true);
  }

  cancelDeletePhoto() {
    this.showDeleteModal.set(false);
  }

  confirmDeletePhoto() {
    this.profileForm.patchValue({
      avatarUrl: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    });
    this.profileForm.get('avatarUrl')?.markAsDirty();
    this.saveProfile();
    this.showDeleteModal.set(false);
  }

  promptAutoDeleteToggle(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const targetValue = target.checked;
    target.checked = !targetValue;
    
    this.pendingAutoDeleteTargetValue.set(targetValue);
    this.showAutoDeleteConfirmModal.set(true);
  }

  confirmAutoDelete() {
    const value = this.pendingAutoDeleteTargetValue();
    this.taskService.setAutoDeleteCompleted(value);
    this.showAutoDeleteConfirmModal.set(false);
    this.setSaveStatus('saved');
    this.cdr.markForCheck();
  }

  cancelAutoDelete() {
    this.showAutoDeleteConfirmModal.set(false);
  }
}

