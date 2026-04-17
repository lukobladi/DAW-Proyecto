import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginPage from './LoginPage.vue';
import { setActivePinia, createPinia } from 'pinia';
import { nextTick } from 'vue';

const { mockLogin, mockShowAlert } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
  mockShowAlert: vi.fn(),
}));

vi.mock('@/services/api', () => ({
  default: {
    login: mockLogin,
  },
}));

vi.mock('@/store/alertStore', () => ({
  alertStore: {
    showAlert: mockShowAlert,
    clearAlert: vi.fn(),
    message: '',
    type: '',
    timeoutId: null,
  },
}));

describe('LoginPage', () => {
  let mockRouter;

  const mountOptions = {
    global: {
      mocks: {
        $router: mockRouter,
      },
      stubs: {
        'router-link': {
          template: '<a :href="to"><slot /></a>',
          props: ['to'],
        },
      },
    },
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    mockRouter = {
      push: vi.fn(),
    };
    vi.clearAllMocks();
  });

  describe('renderizado', () => {
    it('deberia renderizar el titulo de inicio de sesion', () => {
      const wrapper = mount(LoginPage, mountOptions);
      expect(wrapper.find('h2.auth-title').text()).toBe('Iniciar Sesión');
    });

    it('deberia renderizar el campo de correo o movil', () => {
      const wrapper = mount(LoginPage, mountOptions);
      const input = wrapper.find('#correoOMovil');
      expect(input.exists()).toBe(true);
      expect(input.attributes('type')).toBe('text');
    });

    it('deberia renderizar el campo de contrasena', () => {
      const wrapper = mount(LoginPage, mountOptions);
      const input = wrapper.find('#contraseña');
      expect(input.exists()).toBe(true);
      expect(input.attributes('type')).toBe('password');
    });

    it('deberia renderizar el boton de iniciar sesion', () => {
      const wrapper = mount(LoginPage, mountOptions);
      const button = wrapper.find('button[type="submit"]');
      expect(button.exists()).toBe(true);
      expect(button.text()).toBe('Iniciar Sesión');
    });

    it('deberia renderizar el enlace de recuperacion de password', () => {
      const wrapper = mount(LoginPage, mountOptions);
      const link = wrapper.find('a[href="/recuperar-password"]');
      expect(link.exists()).toBe(true);
      expect(link.text()).toContain('Recupérala aquí');
    });

    it('deberia renderizar el boton de registrarse', () => {
      const wrapper = mount(LoginPage, mountOptions);
      const link = wrapper.find('a[href="/registrar"]');
      expect(link.exists()).toBe(true);
      expect(link.text()).toBe('Registrarse');
    });
  });

  describe('estado inicial', () => {
    it('deberia tener valores vacios en los campos del formulario', () => {
      const wrapper = mount(LoginPage, mountOptions);
      expect(wrapper.vm.correoOMovil).toBe('');
      expect(wrapper.vm.contraseña).toBe('');
    });
  });

  describe('interaccion con formulario', () => {
    it('deberia actualizar correoOMovil al escribir en el campo', async () => {
      const wrapper = mount(LoginPage, mountOptions);
      const input = wrapper.find('#correoOMovil');
      await input.setValue('test@example.com');
      expect(wrapper.vm.correoOMovil).toBe('test@example.com');
    });

    it('deberia actualizar contrasena al escribir en el campo', async () => {
      const wrapper = mount(LoginPage, mountOptions);
      const input = wrapper.find('#contraseña');
      await input.setValue('password123');
      expect(wrapper.vm.contraseña).toBe('password123');
    });
  });

  describe('envio de formulario', () => {
    it('deberia llamar a login al enviar el formulario con datos validos', async () => {
      mockLogin.mockResolvedValue({
        data: {
          token: 'mock-token',
          id_usuario: 1,
          nombre: 'Test User',
          correo: 'test@example.com',
          movil: '123456789',
          rol: 'usuario',
          familia: null,
          proveedor_gestionado: null,
        },
      });

      const wrapper = mount(LoginPage, mountOptions);

      await wrapper.find('#correoOMovil').setValue('test@example.com');
      await wrapper.find('#contraseña').setValue('password123');
      await wrapper.find('form').trigger('submit.prevent');

      await nextTick();

      expect(mockLogin).toHaveBeenCalledWith({
        correoOMovil: 'test@example.com',
        password: 'password123',
      });
    });

    it('deberia mostrar alerta de error cuando las credenciales son incorrectas (401)', async () => {
      mockLogin.mockRejectedValue({
        response: {
          status: 401,
        },
        message: 'Unauthorized',
      });

      const wrapper = mount(LoginPage, mountOptions);

      await wrapper.find('#correoOMovil').setValue('wrong@example.com');
      await wrapper.find('#contraseña').setValue('wrongpassword');
      await wrapper.find('form').trigger('submit.prevent');

      await nextTick();

      expect(mockShowAlert).toHaveBeenCalledWith(
        'Credenciales incorrectas. Por favor, inténtalo de nuevo.',
        'danger'
      );
    });

    it('deberia mostrar alerta de usuario inactivo cuando el status es 403', async () => {
      mockLogin.mockRejectedValue({
        response: {
          status: 403,
        },
        message: 'Forbidden',
      });

      const wrapper = mount(LoginPage, mountOptions);

      await wrapper.find('#correoOMovil').setValue('inactive@example.com');
      await wrapper.find('#contraseña').setValue('password');
      await wrapper.find('form').trigger('submit.prevent');

      await nextTick();

      expect(mockShowAlert).toHaveBeenCalledWith(
        'El usuario no está activo. Contacta al administrador.',
        'danger'
      );
    });

    it('deberia mostrar alerta de error generico cuando hay error de servidor (500)', async () => {
      mockLogin.mockRejectedValue({
        response: {
          status: 500,
        },
        message: 'Server Error',
      });

      const wrapper = mount(LoginPage, mountOptions);

      await wrapper.find('#correoOMovil').setValue('test@example.com');
      await wrapper.find('#contraseña').setValue('password');
      await wrapper.find('form').trigger('submit.prevent');

      await nextTick();

      expect(mockShowAlert).toHaveBeenCalledWith(
        'Ocurrió un error inesperado. Inténtalo más tarde.',
        'danger'
      );
    });

    it('deberia mostrar alerta de error generico cuando no hay response', async () => {
      mockLogin.mockRejectedValue({
        message: 'Network Error',
      });

      const wrapper = mount(LoginPage, mountOptions);

      await wrapper.find('#correoOMovil').setValue('test@example.com');
      await wrapper.find('#contraseña').setValue('password');
      await wrapper.find('form').trigger('submit.prevent');

      await nextTick();

      expect(mockShowAlert).toHaveBeenCalledWith(
        'Ocurrió un error inesperado. Inténtalo más tarde.',
        'danger'
      );
    });
  });
});
