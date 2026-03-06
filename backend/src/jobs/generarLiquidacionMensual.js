#!/usr/bin/env node

require('dotenv').config({ quiet: process.env.NODE_ENV === 'test' });

const Pago = require('../models/Pago');

async function run() {
  const periodo = process.argv[2];

  try {
    const resultado = await Pago.generarLiquidacionMensual(periodo);
    console.log(
      `[liquidacion-mensual] Periodo ${resultado.periodo} procesado. Registros: ${resultado.total_registros}`
    );
    process.exit(0);
  } catch (error) {
    console.error('[liquidacion-mensual] Error generando liquidacion mensual:', error.message);
    process.exit(1);
  }
}

run();
