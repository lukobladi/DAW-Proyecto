// Los models son para acceder a la base de datos

const db = require('../config/db');

class Pago {
  // Normalizar el periodo para las consultas
  static normalizePeriodo(periodo) {
    const periodoActual = new Date().toISOString().slice(0, 7);

    if (!periodo) {
      return {
        periodoQuery: periodoActual,
        periodoDate: `${periodoActual}-01`,
      };
    }

    if (/^\d{4}-\d{2}$/.test(periodo)) {
      return {
        periodoQuery: periodo,
        periodoDate: `${periodo}-01`,
      };
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(periodo)) {
      return {
        periodoQuery: periodo.slice(0, 7),
        periodoDate: periodo,
      };
    }

    return {
      periodoQuery: periodoActual,
      periodoDate: `${periodoActual}-01`,
    };
  }

  // Crear un nuevo pago
  static async create(
    id_usuario_deudor,
    id_usuario_creditor,
    monto,
    estado,
    periodo = null,
    origen = 'manual',
    concepto = null
  ) {
    const query = `
      INSERT INTO Pago (
        id_usuario_Deudor,
        id_usuario_Creditor,
        Monto,
        Estado,
        Periodo,
        Origen,
        Concepto,
        Fecha_Modificacion
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const values = [
      id_usuario_deudor,
      id_usuario_creditor,
      monto,
      estado,
      periodo,
      origen,
      concepto,
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  // Obtener todos los pagos
  static async findAll() {
    const query = `
      SELECT 
        p.ID_Pago,
        p.Monto,
        p.Estado,
        p.Periodo,
        p.Origen,
        p.Concepto,
        p.Deudor_Reporta_Pagado,
        p.Fecha_Reporte_Deudor,
        p.Fecha_Confirmacion_Receptor,
        u_deudor.id_usuario AS id_usuario_Deudor,
        u_deudor.Nombre AS Nombre_Deudor,
        u_creditor.id_usuario AS id_usuario_Creditor,
        u_creditor.Nombre AS Nombre_Creditor
      FROM Pago p
      JOIN Usuario u_deudor ON p.id_usuario_Deudor = u_deudor.id_usuario
      JOIN Usuario u_creditor ON p.id_usuario_Creditor = u_creditor.id_usuario;
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  // Obtener un pago por ID
  static async findById(id) {
    const query = 'SELECT * FROM Pago WHERE ID_Pago = $1;';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  // Cambiar el estado de un pago
  static async cambiarEstado(id, estado) {
    const query = `
      UPDATE Pago
      SET Estado = $2
      WHERE ID_Pago = $1
      RETURNING *;
    `;
    const { rows } = await db.query(query, [id, estado]);

    if (estado === 'completado') {
      const query2 = `
            UPDATE Pago
            SET Fecha_Confirmacion_Receptor = CURRENT_TIMESTAMP
            WHERE ID_Pago = $1
            RETURNING *;
        `;
      const { rows: rows2 } = await db.query(query2, [id]);
      return rows2[0];
    }

    return rows[0];
  }

  // Obtener pagos pendientes de un deudor
  static async findPendientesDeudor(id_usuario_deudor) {
    const query = `
      SELECT 
        p.ID_Pago,
        p.Monto,
        p.Estado,
        p.Periodo,
        p.Deudor_Reporta_Pagado,
        p.Fecha_Reporte_Deudor,
        u_deudor.id_usuario AS id_usuario_Deudor,
        u_deudor.Nombre AS Nombre_Deudor,
        u_creditor.id_usuario AS id_usuario_Creditor,
        u_creditor.Nombre AS Nombre_Creditor
      FROM Pago p
      JOIN Usuario u_deudor ON p.id_usuario_Deudor = u_deudor.id_usuario
      JOIN Usuario u_creditor ON p.id_usuario_Creditor = u_creditor.id_usuario
      WHERE p.id_usuario_Deudor = $1 AND p.Estado = 'pendiente';
    `;
    const { rows } = await db.query(query, [id_usuario_deudor]);
    return rows;
  }

  // Obtener pagos pendientes de un acreedor
  static async findPendientesCreditor(id_usuario_creditor) {
    const query = `
      SELECT 
        p.ID_Pago,
        p.Monto,
        p.Estado,
        p.Periodo,
        p.Deudor_Reporta_Pagado,
        p.Fecha_Reporte_Deudor,
        u_deudor.id_usuario AS id_usuario_Deudor,
        u_deudor.Nombre AS Nombre_Deudor,
        u_creditor.id_usuario AS id_usuario_Creditor,
        u_creditor.Nombre AS Nombre_Creditor
      FROM Pago p
      JOIN Usuario u_deudor ON p.id_usuario_Deudor = u_deudor.id_usuario
      JOIN Usuario u_creditor ON p.id_usuario_Creditor = u_creditor.id_usuario
      WHERE p.id_usuario_Creditor = $1 AND p.Estado = 'pendiente';
    `;
    const { rows } = await db.query(query, [id_usuario_creditor]);
    return rows;
  }

  // Marcar que el deudor ha pagado
  static async marcarPagadoPorDeudor(idPago, idUsuarioDeudor) {
    const query = `
      UPDATE Pago
      SET Deudor_Reporta_Pagado = TRUE,
          Fecha_Reporte_Deudor = CURRENT_TIMESTAMP,
          Fecha_Modificacion = CURRENT_TIMESTAMP
      WHERE ID_Pago = $1
        AND id_usuario_Deudor = $2
        AND Estado = 'pendiente'
      RETURNING *;
    `;
    const { rows } = await db.query(query, [idPago, idUsuarioDeudor]);
    return rows[0] || null;
  }

  // Confirmar que el acreedor ha recibido el pago
  static async confirmarRecibidoPorAcreedor(idPago, idUsuarioCreditor) {
    const query = `
      UPDATE Pago
      SET Estado = 'completado',
          Fecha_Confirmacion_Receptor = CURRENT_TIMESTAMP,
          Fecha_Modificacion = CURRENT_TIMESTAMP
      WHERE ID_Pago = $1
        AND id_usuario_Creditor = $2
        AND Estado = 'pendiente'
      RETURNING *;
    `;
    const { rows } = await db.query(query, [idPago, idUsuarioCreditor]);
    return rows[0] || null;
  }

  // Obtener resumen mensual de pagos de un usuario
  static async obtenerResumenMensual(idUsuario, periodo) {
    const { periodoQuery, periodoDate } = this.normalizePeriodo(periodo);

    const [
      saldoResult,
      gastoMesResult,
      pagarResult,
      cobrarResult,
      deudasResult,
    ] = await Promise.all([
      db.query('SELECT Saldo FROM Usuario WHERE id_usuario = $1;', [idUsuario]),
      db.query(
        `
          SELECT COALESCE(SUM(d.Cantidad * d.Precio_Unitario), 0) AS total
          FROM Detalle_Pedido d
          JOIN Pedido p ON p.ID_Pedido = d.ID_Pedido
          WHERE d.id_usuario_Comprador = $1
            AND d.Cantidad > 0
            AND p.Estado <> 'cancelado'
            AND date_trunc('month', COALESCE(p.Fecha_Cierre, p.Fecha_Apertura)) = date_trunc('month', $2::date);
        `,
        [idUsuario, periodoDate]
      ),
      db.query(
        `
          SELECT COALESCE(SUM(Monto), 0) AS total
          FROM Pago
          WHERE id_usuario_Deudor = $1
            AND Estado = 'pendiente';
        `,
        [idUsuario]
      ),
      db.query(
        `
          SELECT COALESCE(SUM(Monto), 0) AS total
          FROM Pago
          WHERE id_usuario_Creditor = $1
            AND Estado = 'pendiente';
        `,
        [idUsuario]
      ),
      db.query(
        `
          SELECT
            p.ID_Pago,
            p.Monto,
            p.Estado,
            p.Periodo,
            p.Origen,
            p.Deudor_Reporta_Pagado,
            p.Fecha_Reporte_Deudor,
            p.Fecha_Confirmacion_Receptor,
            p.id_usuario_Deudor,
            p.id_usuario_Creditor,
            u_deudor.Nombre AS Nombre_Deudor,
            u_creditor.Nombre AS Nombre_Creditor
          FROM Pago p
          JOIN Usuario u_deudor ON p.id_usuario_Deudor = u_deudor.id_usuario
          JOIN Usuario u_creditor ON p.id_usuario_Creditor = u_creditor.id_usuario
          WHERE p.Estado = 'pendiente'
            AND (p.id_usuario_Deudor = $1 OR p.id_usuario_Creditor = $1)
          ORDER BY p.Periodo DESC NULLS LAST, p.ID_Pago DESC;
        `,
        [idUsuario]
      ),
    ]);

    return {
      periodo_consultado: periodoQuery,
      saldo_actual: Number(saldoResult.rows[0]?.saldo || 0),
      total_gastado_mes: Number(gastoMesResult.rows[0]?.total || 0),
      total_pendiente_por_pagar: Number(pagarResult.rows[0]?.total || 0),
      total_pendiente_por_cobrar: Number(cobrarResult.rows[0]?.total || 0),
      deudas_pendientes: deudasResult.rows,
    };
  }

  // Generar la liquidacion mensual de todos los usuarios
  static async generarLiquidacionMensual(periodo) {
    const { periodoQuery, periodoDate } = this.normalizePeriodo(periodo);

    const query = `
      WITH resumen AS (
        SELECT
          d.id_usuario_Comprador AS id_usuario_deudor,
          p.id_usuario_Encargado AS id_usuario_creditor,
          ROUND(SUM(d.Cantidad * d.Precio_Unitario)::numeric, 2) AS monto
        FROM Detalle_Pedido d
        JOIN Pedido p ON p.ID_Pedido = d.ID_Pedido
        WHERE d.Cantidad > 0
          AND p.Estado <> 'cancelado'
          AND d.id_usuario_Comprador <> p.id_usuario_Encargado
          AND date_trunc('month', COALESCE(p.Fecha_Cierre, p.Fecha_Apertura)) = date_trunc('month', $1::date)
        GROUP BY d.id_usuario_Comprador, p.id_usuario_Encargado
      )
      INSERT INTO Pago (
        id_usuario_Deudor,
        id_usuario_Creditor,
        Monto,
        Estado,
        Fecha_Pago,
        Periodo,
        Origen,
        Concepto,
        Deudor_Reporta_Pagado,
        Fecha_Reporte_Deudor,
        Fecha_Confirmacion_Receptor,
        Fecha_Modificacion
      )
      SELECT
        r.id_usuario_deudor,
        r.id_usuario_creditor,
        r.monto,
        'pendiente',
        CURRENT_TIMESTAMP,
        $1::date,
        'liquidacion_mensual',
        'Liquidacion mensual automatica',
        FALSE,
        NULL,
        NULL,
        CURRENT_TIMESTAMP
      FROM resumen r
      ON CONFLICT (id_usuario_Deudor, id_usuario_Creditor, Periodo, Origen)
      DO UPDATE
      SET Monto = EXCLUDED.Monto,
          Estado = CASE
            WHEN Pago.Estado = 'completado' THEN Pago.Estado
            ELSE 'pendiente'
          END,
          Deudor_Reporta_Pagado = CASE
            WHEN Pago.Estado = 'completado' THEN Pago.Deudor_Reporta_Pagado
            ELSE FALSE
          END,
          Fecha_Reporte_Deudor = CASE
            WHEN Pago.Estado = 'completado' THEN Pago.Fecha_Reporte_Deudor
            ELSE NULL
          END,
          Fecha_Modificacion = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const { rows } = await db.query(query, [periodoDate]);
    return {
      periodo: periodoQuery,
      total_registros: rows.length,
      registros: rows,
    };
  }
}

module.exports = Pago;
