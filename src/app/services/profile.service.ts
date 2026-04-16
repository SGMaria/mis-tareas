import { Injectable, signal, effect } from '@angular/core';

export interface UserProfile {
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

const STORAGE_KEY = 'mis-tareas-profile';

const DEFAULT_PROFILE: UserProfile = {
  firstName: 'Juan',
  lastName: 'Pérez',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

function loadProfileFromStorage(): UserProfile {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return { ...DEFAULT_PROFILE, ...parsed };
      }
    }
  } catch {
    // Si hay error al parsear, usar el perfil por defecto
  }
  return DEFAULT_PROFILE;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  profile = signal<UserProfile>(loadProfileFromStorage());

  constructor() {
    effect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile()));
      }
    });
  }

  updateProfile(profile: UserProfile) {
    this.profile.set(profile);
  }
}
