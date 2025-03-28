const Notificacion = require('../../models/Notificacion');
const pool = require('../../db');

describe('Notificacion Model', () => {
  let notificacionId; // Para almacenar el ID de la notificación creada
  const notificacionData = {
    id_usuario: 1,
    mensaje: 'Tu pedido ha sido enviado',
  };

  afterAll(async () => {
    await pool.end(); // Cierra la conexión a la base de datos después de las pruebas
  });

  afterEach(async () => {
    // Limpiar las notificaciones creadas durante los tests
    await pool.query('DELETE FROM notificacion WHERE id_usuario = $1', [1]);
    const notificaciones = await pool.query('SELECT * FROM notificacion WHERE id_usuario = $1', [1]);
    expect(notificaciones.rows).toHaveLength(0); // Validar que no queden registros
  });

  it('Debería enviar una nueva notificación', async () => {
    const nuevaNotificacion = await Notificacion.enviar(
      notificacionData.id_usuario,
      notificacionData.mensaje
    );
    expect(nuevaNotificacion).toHaveProperty('id_notificacion');
    notificacionId = nuevaNotificacion.id_notificacion; // Guardar el ID de la notificación creada
  });

  it('Debería marcar una notificación como leída', async () => {
    const notificacionLeida = await Notificacion.marcarLeida(notificacionId);
    expect(notificacionLeida).toHaveProperty('leida', true);
  });

  it('Debería manejar un caso de error al marcar una notificación inexistente como leída', async () => {
    try {
      await Notificacion.marcarLeida(9999); // ID inexistente
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});


// Cerrar conexiones
afterAll(async () => {
  await pool.end(); // Cierra la conexión a la base de datos
});