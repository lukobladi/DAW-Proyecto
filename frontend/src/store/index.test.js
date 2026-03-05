import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from './index';

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('sets auth state on login', () => {
    const store = useAuthStore();

    store.login({
      token: 'header.eyJyb2wiOiJhZG1pbiJ9.signature',
      user: { role: 'admin' },
    });

    expect(store.isAuthenticated).toBe(true);
    expect(store.user.role).toBe('admin');
    expect(localStorage.getItem('authToken')).toBe('header.eyJyb2wiOiJhZG1pbiJ9.signature');
    expect(localStorage.getItem('userRole')).toBe('admin');
  });

  it('clears auth state on logout', () => {
    const store = useAuthStore();

    store.login({ token: 'header.payload.signature', user: { role: 'usuario' } });
    store.logout();

    expect(store.isAuthenticated).toBe(false);
    expect(store.user.role).toBeNull();
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('userRole')).toBeNull();
  });
});
