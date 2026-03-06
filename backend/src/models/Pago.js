const db = require('../config/db');

class Pago {
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
        ID_Usuario_Deudor,
        ID_Usuario_Creditor,
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
    const values = [id_usuario_deudor, id_usuario_creditor, monto, estado, periodo, origen, concepto];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

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
        u_deudor.ID_Usuario AS ID_Usuario_Deudor,
        u_deudor.Nombre AS Nombre_Deudor,
        u_creditor.ID_Usuario AS ID_Usuario_Creditor,
        u_creditor.Nombre AS Nombre_Creditor
      FROM Pago p
      JOIN Usuario u_deudor ON p.ID_Usuario_Deudor = u_deudor.ID_Usuario
      JOIN Usuario u_creditor ON p.ID_Usuario_Creditor = u_creditor.ID_Usuario;
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM Pago WHERE ID_Pago = $1;';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async cambiarEstado(id, estado) {
    const query = `
      UPDATE Pago
      SET Estado = $1,
          Fecha_Confirmacion_Receptor = CASE
            WHEN $1 = 'completado' THEN CURRENT_TIMESTAMP
            ELSE Fecha_Confirmacion_Receptor
          END,
          Fecha_Modificacion = CURRENT_TIMESTAMP
      WHERE ID_Pago = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [estado, id]);
    return rows[0];
  }

  static async findPendientesDeudor(id_usuario_deudor) {
    const query = `
      SELECT 
        p.ID_Pago,
        p.Monto,
        p.Estado,
        p.Periodo,
        p.Deudor_Reporta_Pagado,
        p.Fecha_Reporte_Deudor,
        u_deudor.ID_Usuario AS ID_Usuario_Deudor,
        u_deudor.Nombre AS Nombre_Deudor,
        u_creditor.ID_Usuario AS ID_Usuario_Creditor,
        u_creditor.Nombre AS Nombre_Creditor
      FROM Pago p
      JOIN Usuario u_deudor ON p.ID_Usuario_Deudor = u_deudor.ID_Usuario
      JOIN Usuario u_creditor ON p.ID_Usuario_Creditor = u_creditor.ID_Usuario
      WHERE p.ID_Usuario_Deudor = $1 AND p.Estado = 'pendiente';
    `;
    const { rows } = await db.query(query, [id_usuario_deudor]);
    return rows;
  }

  static async findPendientesCreditor(id_usuario_creditor) {
    const query = `
      SELECT 
        p.ID_Pago,
        p.Monto,
        p.Estado,
        p.Periodo,
        p.Deudor_Reporta_Pagado,
        p.Fecha_Reporte_Deudor,
        u_deudor.ID_Usuario AS ID_Usuario_Deudor,
        u_deudor.Nombre AS Nombre_Deudor,
        u_creditor.ID_Usuario AS ID_Usuario_Creditor,
        u_creditor.Nombre AS Nombre_Creditor
      FROM Pago p
      JOIN Usuario u_deudor ON p.ID_Usuario_Deudor = u_deudor.ID_Usuario
      JOIN Usuario u_creditor ON p.ID_Usuario_Creditor = u_creditor.ID_Usuario
      WHERE p.ID_Usuario_Creditor = $1 AND p.Estado = 'pendiente';
    `;
    const { rows } = await db.query(query, [id_usuario_creditor]);
    return rows;
  }

  static async marcarPagadoPorDeudor(idPago, idUsuarioDeudor) {
    const query = `
      UPDATE Pago
      SET Deudor_Reporta_Pagado = TRUE,
          Fecha_Reporte_Deudor = CURRENT_TIMESTAMP,
          Fecha_Modificacion = CURRENT_TIMESTAMP
      WHERE ID_Pago = $1
        AND ID_Usuario_Deudor = $2
        AND Estado = 'pendiente'
      RETURNING *;
    `;
    const { rows } = await db.query(query, [idPago, idUsuarioDeudor]);
    return rows[0] || null;
  }

  static async confirmarRecibidoPorAcreedor(idPago, idUsuarioCreditor) {
    const query = `
      UPDATE Pago
      SET Estado = 'completado',
          Fecha_Confirmacion_Receptor = CURRENT_TIMESTAMP,
          Fecha_Modificacion = CURRENT_TIMESTAMP
      WHERE ID_Pago = $1
        AND ID_Usuario_Creditor = $2
        AND Estado = 'pendiente'
      RETURNING *;
    `;
    const { rows } = await db.query(query, [idPago, idUsuarioCreditor]);
    return rows[0] || null;
  }

  static async obtenerResumenMensual(idUsuario, periodo) {
    const { periodoQuery, periodoDate } = this.normalizePeriodo(periodo);

    const [saldoResult, gastoMesResult, pagarResult, cobrarResult, deudasResult] = await Promise.all([
      db.query('SELECT Saldo FROM Usuario WHERE ID_Usuario = $1;', [idUsuario]),
      db.query(
        `
          SELECT COALESCE(SUM(d.Cantidad * d.Precio_Unitario), 0) AS total
          FROM Detalle_Pedido d
          JOIN Pedido p ON p.ID_Pedido = d.ID_Pedido
          WHERE d.ID_Usuario_Comprador = $1
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
          WHERE ID_Usuario_Deudor = $1
            AND Estado = 'pendiente';
        `,
        [idUsuario]
      ),
      db.query(
        `
          SELECT COALESCE(SUM(Monto), 0) AS total
          FROM Pago
          WHERE ID_Usuario_Creditor = $1
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
            p.ID_Usuario_Deudor,
            p.ID_Usuario_Creditor,
            u_deudor.Nombre AS Nombre_Deudor,
            u_creditor.Nombre AS Nombre_Creditor
          FROM Pago p
          JOIN Usuario u_deudor ON p.ID_Usuario_Deudor = u_deudor.ID_Usuario
          JOIN Usuario u_creditor ON p.ID_Usuario_Creditor = u_creditor.ID_Usuario
          WHERE p.Estado = 'pendiente'
            AND (p.ID_Usuario_Deudor = $1 OR p.ID_Usuario_Creditor = $1)
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

  static async generarLiquidacionMensual(periodo) {
    const { periodoQuery, periodoDate } = this.normalizePeriodo(periodo);

    const query = `
      WITH resumen AS (
        SELECT
          d.ID_Usuario_Comprador AS id_usuario_deudor,
          p.ID_Usuario_Encargado AS id_usuario_creditor,
          ROUND(SUM(d.Cantidad * d.Precio_Unitario)::numeric, 2) AS monto
        FROM Detalle_Pedido d
        JOIN Pedido p ON p.ID_Pedido = d.ID_Pedido
        WHERE d.Cantidad > 0
          AND p.Estado <> 'cancelado'
          AND d.ID_Usuario_Comprador <> p.ID_Usuario_Encargado
          AND date_trunc('month', COALESCE(p.Fecha_Cierre, p.Fecha_Apertura)) = date_trunc('month', $1::date)
        GROUP BY d.ID_Usuario_Comprador, p.ID_Usuario_Encargado
      )
      INSERT INTO Pago (
        ID_Usuario_Deudor,
        ID_Usuario_Creditor,
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
      ON CONFLICT (ID_Usuario_Deudor, ID_Usuario_Creditor, Periodo, Origen)
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
