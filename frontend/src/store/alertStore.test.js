import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { alertStore } from './alertStore';

describe('alertStore', () => {
  beforeEach(() => {
    alertStore.clearAlert();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    alertStore.clearAlert();
  });

  describe('initial state', () => {
    it('deberia tener mensaje vacio initially', () => {
      expect(alertStore.message).toBe('');
    });

    it('deberia tener tipo vacio initially', () => {
      expect(alertStore.type).toBe('');
    });

    it('deberia tener timeoutId null initially', () => {
      expect(alertStore.timeoutId).toBeNull();
    });
  });

  describe('showAlert', () => {
    it('deberia establecer el mensaje y tipo', () => {
      alertStore.showAlert('Test message', 'success');

      expect(alertStore.message).toBe('Test message');
      expect(alertStore.type).toBe('success');
    });

    it('deberia usar "success" como tipo por defecto', () => {
      alertStore.showAlert('Test message');

      expect(alertStore.type).toBe('success');
    });

    it('deberia aceptar tipo danger', () => {
      alertStore.showAlert('Error message', 'danger');

      expect(alertStore.type).toBe('danger');
    });

    it('deberia limpiar timeout anterior', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      alertStore.showAlert('First message', 'success');
      alertStore.showAlert('Second message', 'danger');

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  describe('clearAlert', () => {
    it('deberia limpiar el mensaje', () => {
      alertStore.showAlert('Test message', 'success');
      alertStore.clearAlert();

      expect(alertStore.message).toBe('');
    });

    it('deberia limpiar el tipo', () => {
      alertStore.showAlert('Test message', 'danger');
      alertStore.clearAlert();

      expect(alertStore.type).toBe('');
    });

    it('deberia limpiar el timeout si existe', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      alertStore.showAlert('Test message', 'success');
      alertStore.clearAlert();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('deberia establecer timeoutId a null', () => {
      alertStore.showAlert('Test message', 'success');
      alertStore.clearAlert();

      expect(alertStore.timeoutId).toBeNull();
    });
  });

  describe('auto-dismiss', () => {
    it('deberia limpiar la alerta despues del duration', () => {
      alertStore.showAlert('Test message', 'success', 2000);

      expect(alertStore.message).toBe('Test message');

      vi.advanceTimersByTime(2000);

      expect(alertStore.message).toBe('');
      expect(alertStore.type).toBe('');
    });

    it('deberia usar 2000ms como duracion por defecto', () => {
      alertStore.showAlert('Test message');

      vi.advanceTimersByTime(2000);

      expect(alertStore.message).toBe('');
    });

    it('deberia funcionar con diferente duracion', () => {
      alertStore.showAlert('Test message', 'success', 5000);

      vi.advanceTimersByTime(5000);

      expect(alertStore.message).toBe('');
    });

    it('deberia no limpiar antes del tiempo', () => {
      alertStore.showAlert('Test message', 'success', 5000);

      vi.advanceTimersByTime(2000);

      expect(alertStore.message).toBe('Test message');
      expect(alertStore.type).toBe('success');
    });
  });
});
