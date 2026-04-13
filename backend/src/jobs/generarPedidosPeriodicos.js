#!/usr/bin/env node
/**
 * Job para generar pedidos periódicos automáticamente
 *
 * Este script lee las configuraciones de Pedido_Periodico activas,
 * calcula si corresponde crear un nuevo pedido según la periodicidad
 * y genera los Pedido correspondientes en la base de datos.
 *
 * Uso: node generarPedidosPeriodicos.js [--dry-run]
 *   --dry-run: Simula la ejecución sin crear pedidos reales
 *
 * Programación recomendada (cron del SO):
 *   0 2 * * * cd /var/www/daw-proyecto && node backend/src/jobs/generarPedidosPeriodicos.js >> logs/pedidos-periodicos.log 2>&1
 *
 * Para probarlo manualmente:
 *   npm run pedidos:periodicos
 *   npm run pedidos:periodicos -- --dry-run
 */

'use strict';

require('dotenv').config({ quiet: process.env.NODE_ENV === 'test' });

const pool = require('../config/db');

// Flag para simulación sin crear pedidos reales
const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Obtiene todos los pedidos periódicos activos que deben generar un pedido
 * @returns {Promise<Array>} Lista de configuraciones de pedidos periódicos
 */
async function obtenerPedidosPeriodicosActivos() {
  const query = `
    SELECT
      pp.id_pedido_periodico,
      pp.id_proveedor,
      pp.periodicidad,
      pp.fecha_inicio,
      pp.fecha_fin,
      pp.dia_apertura,
      pp.dia_cierre,
      pp.dia_entrega,
      pp.activo,
      pg.ultimo_pedido_generado
    FROM Pedido_Periodico pp
    LEFT JOIN Pedido_Periodico_Generacion pg ON pp.id_pedido_periodico = pg.id_pedido_periodico
    WHERE pp.activo = true
      AND pp.fecha_inicio <= CURRENT_DATE
      AND (pp.fecha_fin IS NULL OR pp.fecha_fin >= CURRENT_DATE)
    ORDER BY pp.id_pedido_periodico;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

/**
 * Calcula la fecha del próximo pedido basándose en la periodicidad
 * @param {Object} configPedido - Configuración del pedido periódico
 * @returns {Date|null} Fecha calculada para el próximo pedido o null si no corresponde
 */
function calcularFechaProximoPedido(configPedido) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const {
    periodicidad,
    ultimo_pedido_generado,
    fecha_inicio,
  } = configPedido;

  // Si es la primera vez que se genera, usar fecha_inicio
  if (!ultimo_pedido_generado) {
    const fechaInicio = new Date(fecha_inicio);
    if (fechaInicio > hoy) {
      return null; // Aún no corresponde
    }

    // Para la primera vez, crear inmediatamente si ya pasó la fecha de inicio
    return hoy;
  }

  // Calcular días desde la última generación
  const ultimoPedido = new Date(ultimo_pedido_generado);
  ultimoPedido.setHours(0, 0, 0, 0);

  const diasTranscurridos = Math.floor((hoy - ultimoPedido) / (1000 * 60 * 60 * 24));

  if (diasTranscurridos < periodicidad) {
    return null; // Aún no ha pasado suficiente tiempo
  }

  return hoy;
}

/**
 * Calcula las fechas de apertura, cierre y entrega para un pedido
 * @param {Object} config - Configuración del pedido periódico
 * @param {Date} fechaReferencia - Fecha de referencia para el cálculo
 * @returns {Object} Objeto con fecha_apertura, fecha_cierre y fecha_entrega
 */
function calcularFechasPedido(config, fechaReferencia) {
  const fecha = new Date(fechaReferencia);

  let diaApertura = config.dia_apertura || fecha.getDate();
  let diaCierre = config.dia_cierre || diaApertura + 3;
  let diaEntrega = config.dia_entrega || diaCierre + 2;

  // Ajustar al último día del mes si excede
  const ultimoDiaMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
  diaApertura = Math.min(diaApertura, ultimoDiaMes);
  diaCierre = Math.min(diaCierre, ultimoDiaMes);
  diaEntrega = Math.min(diaEntrega, ultimoDiaMes);

  const anio = fecha.getFullYear();
  const mes = fecha.getMonth();

  const fechaApertura = new Date(anio, mes, diaApertura, 10, 0, 0);
  const fechaCierre = new Date(anio, mes, diaCierre, 23, 59, 59);
  const fechaEntrega = new Date(anio, mes, diaEntrega, 9, 0, 0);

  return {
    fecha_apertura: fechaApertura.toISOString(),
    fecha_cierre: fechaCierre.toISOString(),
    fecha_entrega: fechaEntrega.toISOString(),
  };
}

/**
 * Crea un nuevo pedido en la base de datos
 * @param {number} idProveedor - ID del proveedor
 * @param {Object} fechas - Fechas del pedido
 * @returns {Promise<Object>} Pedido creado
 */
async function crearPedido(idProveedor, fechas) {
  const query = `
    INSERT INTO Pedido (id_proveedor, fecha_apertura, fecha_cierre, fecha_entrega, estado)
    VALUES ($1, $2, $3, $4, 'pendiente')
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [
    idProveedor,
    fechas.fecha_apertura,
    fechas.fecha_cierre,
    fechas.fecha_entrega,
  ]);
  return rows[0];
}

/**
 * Registra o actualiza la fecha de última generación
 * @param {number} idPedidoPeriodico - ID del pedido periódico
 * @param {Date} fechaGeneracion - Fecha de generación
 */
async function registrarGeneracion(idPedidoPeriodico, fechaGeneracion) {
  const query = `
    INSERT INTO Pedido_Periodico_Generacion (id_pedido_periodico, ultimo_pedido_generado)
    VALUES ($1, $2)
    ON CONFLICT (id_pedido_periodico)
    DO UPDATE SET ultimo_pedido_generado = $2;
  `;
  await pool.query(query, [idPedidoPeriodico, fechaGeneracion]);
}

/**
 * Función principal que ejecuta el job
 */
async function run() {
  const fechaEjecucion = new Date().toISOString();
  console.log(`[${fechaEjecucion}] Iniciando job de pedidos periódicos...`);

  if (DRY_RUN) {
    console.log('⚠️  MODO SIMULACIÓN - No se crearán pedidos reales');
  }

  try {
    // 1. Obtener configuraciones activas
    const configuraciones = await obtenerPedidosPeriodicosActivos();
    console.log(`Found ${configuraciones.length} active periodic order configurations`);

    let pedidosGenerados = 0;
    let pedidosOmitidos = 0;

    // 2. Procesar cada configuración
    for (const config of configuraciones) {
      const fechaProximoPedido = calcularFechaProximoPedido(config);

      if (!fechaProximoPedido) {
        console.log(`  [${config.id_pedido_periodico}] Omitido: aún no corresponde generar (periodicidad: ${config.periodicidad} días)`);
        pedidosOmitidos++;
        continue;
      }

      // Calcular fechas del pedido
      const fechas = calcularFechasPedido(config, fechaProximoPedido);

      if (DRY_RUN) {
        console.log(`  [${config.id_pedido_periodico}] SIMULARÍA: Crear pedido para proveedor ${config.id_proveedor}`);
        console.log(`    Apertura: ${fechas.fecha_apertura}`);
        console.log(`    Cierre: ${fechas.fecha_cierre}`);
        console.log(`    Entrega: ${fechas.fecha_entrega}`);
      } else {
        // Crear el pedido
        const pedido = await crearPedido(config.id_proveedor, fechas);
        console.log(`  [${config.id_pedido_periodico}] Creado pedido #${pedido.id_pedido} para proveedor ${config.id_proveedor}`);

        // Registrar la generación
        await registrarGeneracion(config.id_pedido_periodico, fechaProximoPedido);
        console.log(`  [${config.id_pedido_periodico}] Registrada generación para ${fechaProximoPedido.toISOString().split('T')[0]}`);
      }

      pedidosGenerados++;
    }

    // 3. Resumen
    console.log('\n=== Resumen de ejecución ===');
    console.log(`Fecha: ${fechaEjecucion}`);
    console.log(`Configuraciones activas: ${configuraciones.length}`);
    console.log(`Pedidos generados: ${pedidosGenerados}`);
    console.log(`Pedidos omitidos: ${pedidosOmitidos}`);
    console.log(`Modo: ${DRY_RUN ? 'SIMULACIÓN' : 'PRODUCCIÓN'}`);

    if (!DRY_RUN) {
      console.log('\n✅ Job completado correctamente');
    } else {
      console.log('\n⚠️  Modo simulación - ningún pedido real fue creado');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error ejecutando job de pedidos periódicos:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Ejecutar solo si se llama directamente (no como módulo)
if (require.main === module) {
  run();
}

module.exports = { run, calcularFechaProximoPedido, calcularFechasPedido };
