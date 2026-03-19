// Tests unitarios para el modelo Usuario
// Prueban las operaciones CRUD y funciones adicionales del modelo

const Usuario = require('../../src/models/Usuario');
const pool = require('../../src/config/db');

describe('Modelo Usuario', () => {
  let usuarioId;

  // Usar correos temporales validos
  const deudorCorreo = 'johiwa3415@soco7.com';
  const acreedorCorreo = `acreedor.pago+${Date.now()}@soco7.com`;

  const usuarioData = {
    nombre: 'Juan Perez',
    password: '123456',
    rol: 'usuario',
    movil: '123456789',
  };

  beforeEach(async () => {
    const nuevoUsuario = await Usuario.create(
      usuarioData.nombre,
      `test+${Date.now()}@soco7.com`,
      usuarioData.password,
      usuarioData.rol,
      usuarioData.movil
    );
    usuarioId = nuevoUsuario.id_usuario;
  });

  afterEach(async () => {
    if (usuarioId) {
      await Usuario.delete(usuarioId);
      usuarioId = null;
    }
  });

  it('Deberia crear un nuevo usuario', async () => {
    const nuevoUsuario = await Usuario.create(
      'Usuario de prueba',
      `test.crear+${Date.now()}@soco7.com`,
      'password',
      'usuario',
      '987654321'
    );
    expect(nuevoUsuario).toHaveProperty('id_usuario');
    await Usuario.delete(nuevoUsuario.id_usuario); 
  });


  // Test: obtener todos los usuarios
  it('Deberia obtener todos los usuarios', async () => {
    const usuarios = await Usuario.findAll();
    expect(usuarios).toBeInstanceOf(Array);
  });

  // Test: obtener un usuario por ID
  it('Deberia obtener un usuario por ID', async () => {
    const usuario = await Usuario.findById(usuarioId);
    expect(usuario).not.toBeNull(); // Compruebo que el usuario existe
    if (usuario) {
      expect(usuario).toHaveProperty('id_usuario', usuarioId);
    }
  });

  // Test: actualizar un usuario
  it('Deberia actualizar un usuario', async () => {
    const usuario = await Usuario.findById(usuarioId);
    const usuarioActualizado = await Usuario.update(
      usuarioId,
      'Juan Actualizado',
      usuario.correo,
      usuarioData.rol,
      usuarioData.movil
    );
    expect(usuarioActualizado).not.toBeNull(); // Compruebo que la actualizacion fue correcta
    if (usuarioActualizado) {
      expect(usuarioActualizado).toHaveProperty('nombre', 'Juan Actualizado');
    }
  });

  // Test: eliminar un usuario
  it('Deberia eliminar un usuario', async () => {
    const usuarioEliminado = await Usuario.delete(usuarioId);
    expect(usuarioEliminado).not.toBeNull(); // Compruebo que el usuario fue eliminado
    if (usuarioEliminado) {
      const usuario = await Usuario.findById(usuarioId);
      expect(usuario).toBeNull(); // Compruebo que el usuario ya no existe
    }
  });
});

describe('Funciones adicionales del modelo Usuario', () => {
  let usuarioId;
  const usuarioData = {
    nombre: 'Juan Perez',
    correo: `juan.perez+${Math.random()}@example.com`, // Correo unico para cada prueba
    password: '123456',
    rol: 'usuario',
    movil: '123456789',
  };

  beforeAll(async () => {
    // Creo un usuario para las pruebas
    const nuevoUsuario = await Usuario.create(
      usuarioData.nombre,
      usuarioData.correo,
      usuarioData.password,
      usuarioData.rol,
      usuarioData.movil
    );
    usuarioId = nuevoUsuario.id_usuario;
  });

  afterAll(async () => {
    // Limpio el usuario despues de todas las pruebas
    if (usuarioId) {
      await Usuario.delete(usuarioId);
    }
  });

  // Test: verificar la contrasena correctamente
  it('Deberia verificar la contrasena correctamente', async () => {
    const usuario = await Usuario.findById(usuarioId);
    expect(usuario).not.toBeNull(); // Compruebo que el usuario existe
    if (usuario) {
      const isValid = await Usuario.verifyPassword(
        usuarioData.password,
        usuario.pass
      );
      expect(isValid).toBe(true);
    }
  });

  // Test: activar y desactivar un usuario
  it('Deberia activar y desactivar un usuario', async () => {
    const usuarioActivado = await Usuario.toggleActivation(usuarioId, true);
    expect(usuarioActivado).toHaveProperty('activo', true);

    const usuarioDesactivado = await Usuario.toggleActivation(usuarioId, false);
    expect(usuarioDesactivado).toHaveProperty('activo', false);
  });

  // Test: calcular el saldo de un usuario
  it('Deberia calcular el saldo de un usuario', async () => {
    const saldo = await Usuario.calcularSaldo(usuarioId);
    expect(saldo).toBe(0); // Asumo que no hay pagos pendientes
  });
});

afterAll(async () => {
  // Cierro el pool de conexiones al terminar todas las pruebas
  await pool.end();
});