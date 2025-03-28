const Usuario = require('../../models/Usuario');
const pool = require('../../db');

describe('Usuario Model', () => {
  let usuarioId; // Para almacenar el ID del usuario creado
  const usuarioData = {
    nombre: 'Juan Pérez',
    correo: 'juan.perez@example.com',
    password: '123456',
    rol: 'usuario',
    movil: '123456789',
  };

  afterAll(async () => {
    await pool.end(); // Cierra la conexión a la base de datos después de las pruebas
  });

  afterEach(async () => {
    // Limpiar los usuarios creados durante los tests
    await pool.query('DELETE FROM usuario WHERE correo = $1', ['juan.perez@example.com']);
    const usuarios = await Usuario.findAll();
    expect(usuarios.filter(u => u.correo === 'juan.perez@example.com')).toHaveLength(0); // Validar que no queden registros
  });

  it('Debería crear un nuevo usuario', async () => {
    const nuevoUsuario = await Usuario.create(
      usuarioData.nombre,
      usuarioData.correo,
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
    expect(usuario).toHaveProperty('id_usuario', usuarioId);
  });

  it('Debería actualizar un usuario', async () => {
    const usuarioActualizado = await Usuario.update(
      usuarioId,
      'Juan Actualizado',
      usuarioData.correo,
      usuarioData.rol,
      usuarioData.movil
    );
    expect(usuarioActualizado).toHaveProperty('nombre', 'Juan Actualizado');
  });

  it('Debería eliminar un usuario', async () => {
    await Usuario.delete(usuarioId);
    const usuario = await Usuario.findById(usuarioId);
    expect(usuario).toBeUndefined();
  });
});


// Cerrar conexiones
afterAll(async () => {
  await pool.end(); // Cierra la conexión a la base de datos
});