const Usuario = require('../../src/models/Usuario');
const pool = require('../../src/config/db');

describe('Usuario Model', () => {
  let usuarioId; // Para almacenar el ID del usuario creado
  const usuarioData = {
    nombre: 'Juan Pérez',
    correo: `juan.perez+${Date.now()}@example.com`, // Correo único para cada prueba
    password: '123456',
    rol: 'usuario',
    movil: '123456789',
  };

  beforeEach(async () => {
    const uniqueCorreo = `test+${Date.now()}@example.com`; // Generar un correo único
    const nuevoUsuario = await Usuario.create(
      usuarioData.nombre,
      uniqueCorreo,
      usuarioData.password,
      usuarioData.rol,
      usuarioData.movil
    );
    usuarioId = nuevoUsuario.id_usuario; // Asegurar que el usuario se crea antes de cada prueba
  });

  afterEach(async () => {
    if (usuarioId) {
      await Usuario.delete(usuarioId); // Asegurar que el usuario se elimina después de cada prueba
      usuarioId = null;
    }
  });

  it('Debería crear un nuevo usuario', async () => {
    const uniqueCorreo = `test+${Date.now()}@example.com`; // Generar un correo único
    const nuevoUsuario = await Usuario.create(
      usuarioData.nombre,
      uniqueCorreo,
      usuarioData.password,
      usuarioData.rol,
      usuarioData.movil
    );
    expect(nuevoUsuario).toHaveProperty('id_usuario');
    usuarioId = nuevoUsuario.id_usuario; // Guardar el ID del usuario creado
  });

  it('Debería obtener todos los usuarios', async () => {
    const usuarios = await Usuario.findAll();
    expect(usuarios).toBeInstanceOf(Array);
  });

  it('Debería obtener un usuario por ID', async () => {
    const usuario = await Usuario.findById(usuarioId);
    expect(usuario).not.toBeNull(); // Validar que el usuario existe
    if (usuario) {
      expect(usuario).toHaveProperty('id_usuario', usuarioId);
    }
  });

  it('Debería actualizar un usuario', async () => {
    const usuarioActualizado = await Usuario.update(
      usuarioId,
      'Juan Actualizado',
      usuarioData.correo,
      usuarioData.rol,
      usuarioData.movil
    );
    expect(usuarioActualizado).not.toBeNull(); // Validar que la actualización fue exitosa
    if (usuarioActualizado) {
      expect(usuarioActualizado).toHaveProperty('nombre', 'Juan Actualizado');
    }
  });

  it('Debería eliminar un usuario', async () => {
    const usuarioEliminado = await Usuario.delete(usuarioId);
    expect(usuarioEliminado).not.toBeNull(); // Validar que el usuario fue eliminado
    if (usuarioEliminado) {
      const usuario = await Usuario.findById(usuarioId);
      expect(usuario).toBeNull(); // Validar que el usuario ya no existe
    }
  });
});

describe('Funciones adicionales del modelo Usuario', () => {
  let usuarioId;
  const usuarioData = {
    nombre: 'Juan Pérez',
    correo: `juan.perez+${Math.random()}@example.com`, // Correo único para cada prueba
    password: '123456',
    rol: 'usuario',
    movil: '123456789',
  };

  beforeAll(async () => {
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
    if (usuarioId) {
      await Usuario.delete(usuarioId);
    }
  });

  it('Debería verificar la contraseña correctamente', async () => {
    const usuario = await Usuario.findById(usuarioId);
    expect(usuario).not.toBeNull(); // Validar que el usuario existe
    if (usuario) {
      const isValid = await Usuario.verifyPassword(usuarioData.password, usuario.pass);
      expect(isValid).toBe(true);
    }
  });

  it('Debería activar y desactivar un usuario', async () => {
    const usuarioActivado = await Usuario.toggleActivation(usuarioId, true);
    expect(usuarioActivado).toHaveProperty('activo', true);

    const usuarioDesactivado = await Usuario.toggleActivation(usuarioId, false);
    expect(usuarioDesactivado).toHaveProperty('activo', false);
  });

  it('Debería calcular el saldo de un usuario', async () => {
    const saldo = await Usuario.calcularSaldo(usuarioId);
    expect(saldo).toBe(0); // Asume que no hay pagos pendientes
  });
});

afterAll(async () => {
  await pool.end();
});
