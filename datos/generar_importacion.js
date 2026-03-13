const fs = require('fs');
const path = require('path');

const DATOS_DIR = path.join(__dirname);
const PASSWORD_HASH = '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW';

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizarNombre(nombre) {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

function generarEmail(nombre) {
  const nombreNormalizado = normalizarNombre(nombre)
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/\.+/g, '.');
  return `${nombreNormalizado}@ekonsumo.es`;
}

function dividirFamilia(familiaStr) {
  if (familiaStr.includes(' - ')) {
    const partes = familiaStr.split(' - ').map(p => p.trim()).filter(p => p);
    return partes.length >= 2 ? partes : [familiaStr];
  }
  return [familiaStr.trim()];
}

function extraerInfoCSV(filePath) {
  const contenido = fs.readFileSync(filePath, 'utf-8');
  const lineas = contenido.split('\n').filter(l => l.trim());
  
  if (lineas.length < 5) return null;
  
  const fila1 = parseCSVLine(lineas[0]);
  const fila2 = parseCSVLine(lineas[1]);
  const fila3 = parseCSVLine(lineas[2] || '');
  const fila4 = parseCSVLine(lineas[3] || '');
  
  let familiaGestora = null;
  let productor = null;
  let esAutomatico = false;
  
  for (let i = 0; i < fila1.length; i++) {
    if (fila1[i] && fila1[i].toLowerCase().includes('familia responsable')) {
      familiaGestora = fila1[i + 1] || null;
    }
    if (fila1[i] && fila1[i].toLowerCase().includes('productor')) {
      productor = fila1[i + 1] || null;
    }
    if (fila1[i] && fila1[i].toLowerCase().includes('duplicado')) {
      esAutomatico = (fila1[i + 1] || '').toLowerCase().includes('si');
    }
  }
  
  if (!familiaGestora || !productor) {
    return null;
  }
  
  let periodicidad = fila2[1] || 'sin determinar';
  periodicidad = periodicidad.toLowerCase().trim();
  
  if (periodicidad.includes('semanal')) periodicidad = 'semanal';
  else if (periodicidad.includes('mensual')) periodicidad = 'mensual';
  else if (periodicidad.includes('anual')) periodicidad = 'anual';
  else if (periodicidad.includes('semestral')) periodicidad = 'semestral';
  else periodicidad = 'sin determinar';
  
  let telefono = null;
  let movil = null;
  let correo = null;
  
  for (let i = 0; i < fila3.length; i++) {
    if (fila3[i] && fila3[i].toLowerCase().includes('telefono')) {
      telefono = fila3[i + 1] || null;
    }
    if (fila3[i] && fila3[i].toLowerCase().includes('mail')) {
      correo = fila3[i + 1] || null;
    }
  }
  
  for (let i = 0; i < fila4.length; i++) {
    if (fila4[i] && fila4[i].toLowerCase().includes('telefono')) {
      movil = fila4[i + 1] || null;
    }
    if (fila4[i] && fila4[i].toLowerCase().includes('mail') && !correo) {
      correo = fila4[i + 1] || null;
    }
  }
  
  const pedidoAbierto = fila2[0].toLowerCase().includes('abierto');
  
  const productos = [];
  let productoStartLine = -1;
  
  for (let i = 0; i < lineas.length; i++) {
    const cols = parseCSVLine(lineas[i]);
    if (cols.some(c => c && c.includes('TOTAL unidades'))) {
      productoStartLine = i + 1;
      break;
    }
  }
  
  if (productoStartLine > 0) {
    for (let i = productoStartLine; i < lineas.length; i++) {
      const cols = parseCSVLine(lineas[i]);
      if (cols.length < 3) continue;
      
      const nombre = cols[0];
      const descripcion = cols[1] || '';
      let precioStr = cols[2] || '';
      
      if (!nombre || nombre.includes('TOTAL') || nombre.includes('€') || 
          nombre.toLowerCase().includes('cierre') || nombre.toLowerCase().includes('piden') ||
          nombre.toLowerCase().includes('introducido')) {
        continue;
      }
      
      precioStr = precioStr.replace(/[€,\s]/g, '').replace(',', '.');
      const precio = parseFloat(precioStr);
      
      if (nombre && !isNaN(precio) && precio > 0) {
        productos.push({
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          precio: precio
        });
      }
    }
  }
  
  return {
    familiaGestora,
    productor,
    periodicidad,
    esAutomatico,
    telefono,
    movil,
    correo,
    pedidoAbierto,
    productos
  };
}

function extraerFamiliasDeCSV(filePath) {
  const contenido = fs.readFileSync(filePath, 'utf-8');
  const lineas = contenido.split('\n').filter(l => l.trim());
  
  const familias = new Set();
  const palabrasProhibidas = [
    'total', 'unidades', 'caducidad', 'peso', 'unidad', 'importe', 
    'introducido', 'fila', 'cuentas', 'propiedades', 'cantidad',
    'iva', 'incluido', 'cierre', 'pedido', 'piden', 'familias',
    'abierto', 'cerrado', 'entrega', 'fecha', 'euro', '€', '%'
  ];
  
  for (const linea of lineas) {
    const cols = parseCSVLine(linea);
    
    if (cols.some(c => c && c.includes('TOTAL unidades'))) {
      for (let i = 5; i < cols.length && i < 60; i++) {
        const familia = cols[i];
        if (familia && familia.trim() && !familia.match(/^\d+$/) && 
            !familia.includes('%') && familia.length > 2 && familia.length < 40) {
          
          const familiaLower = familia.toLowerCase();
          const esValido = !palabrasProhibidas.some(p => familiaLower.includes(p));
          
          if (esValido && !familia.match(/^[\d\s,\.€%]+$/)) {
            familias.add(familia.trim());
          }
        }
      }
    }
  }
  
  return Array.from(familias);
}

function main() {
  const archivos = fs.readdirSync(DATOS_DIR)
    .filter(f => f.startsWith('PEDIDOS_') && f.endsWith('.csv'));
  
  console.log(`Procesando ${archivos.length} archivos CSV...`);
  
  const todasFamilias = new Set();
  const proveedores = [];
  
  for (const archivo of archivos) {
    const filePath = path.join(DATOS_DIR, archivo);
    
    const info = extraerInfoCSV(filePath);
    if (!info) {
      console.log(`  [SKIP] ${archivo} - No se pudo extraer informacion`);
      continue;
    }
    
    todasFamilias.add(info.familiaGestora);
    
    const familiasCSV = extraerFamiliasDeCSV(filePath);
    familiasCSV.forEach(f => todasFamilias.add(f));
    
    proveedores.push({
      nombre: info.productor,
      familiaGestora: info.familiaGestora,
      periodicidad: info.periodicidad,
      esAutomatico: info.esAutomatico,
      telefono: info.telefono,
      movil: info.movil,
      correo: info.correo,
      pedidoAbierto: info.pedidoAbierto,
      productos: info.productos,
      archivo: archivo
    });
    
    console.log(`  [OK] ${info.productor} - ${info.productos.length} productos, ${info.periodicidad}${info.esAutomatico ? ' (auto)' : ''}`);
  }
  
  console.log(`\nFamilias unicas encontradas: ${todasFamilias.size}`);
  
  const familiasOrdenadas = Array.from(todasFamilias).sort();
  const usuarios = [];
  const familiaNumero = new Map();
  let numFamilia = 1;
  
  for (const familiaStr of familiasOrdenadas) {
    const individuos = dividirFamilia(familiaStr);
    
    for (const nombre of individuos) {
      if (nombre && nombre.length > 1) {
        usuarios.push({
          nombre: normalizarNombre(nombre),
          email: generarEmail(nombre),
          familia: numFamilia,
          familiaOriginal: familiaStr
        });
      }
    }
    
    familiaNumero.set(familiaStr, numFamilia);
    numFamilia++;
  }
  
  console.log(`Usuarios generados: ${usuarios.length}`);
  console.log(`Proveedores: ${proveedores.length}`);
  
  let sql = `-- Script de importacion de datos generado automaticamente
-- Fecha: ${new Date().toISOString().split('T')[0]}
-- Ejecutar con: psql -U ekonsumo_user -d ekonsumo -f importar_datos.sql

-- ============================================
-- LIMPIAR TABLAS
-- ============================================

TRUNCATE TABLE Notificacion, Pago, Pedido_Periodico, usuario_proveedor, Detalle_Pedido, Pedido, Producto, Proveedor, Usuario RESTART IDENTITY CASCADE;

-- ============================================
-- 1. USUARIOS
-- ============================================

INSERT INTO Usuario (Nombre, Correo, Pass, Movil, Rol, Activo, Saldo, Familia) VALUES
`;

  const usuariosSQL = usuarios.map((u, i) => {
    const movil = `60000${String(i + 1).padStart(4, '0')}`;
    return `('${u.nombre.replace(/'/g, "''")}', '${u.email}', '${PASSWORD_HASH}', '${movil}', 'usuario', TRUE, 0.00, ${u.familia})`;
  });
  
  const adminMovil = '600000000';
  sql += usuariosSQL.join(',\n') + `,\n('Admin', 'admin@ekonsumo.es', '${PASSWORD_HASH}', '${adminMovil}', 'admin', TRUE, 0.00, NULL);\n\n`;

  sql += `-- Total usuarios: ${usuarios.length + 1}\n\n`;

  sql += `-- ============================================
-- 2. PROVEEDORES
-- ============================================

INSERT INTO Proveedor (Nombre, Contacto, Telefono, Movil, Correo, Metodo_Pago, Frecuencia_Pedido_Aproximada, Envio_Movil, Envio_Mail, Familia, Activo) VALUES
`;

  const proveedoresSQL = proveedores.map((p, i) => {
    const telefono = p.telefono ? p.telefono.replace(/'/g, "''") : null;
    const movil = p.movil ? p.movil.replace(/'/g, "''") : null;
    const correo = p.correo ? p.correo.replace(/'/g, "''") : null;
    const familiaNum = familiaNumero.get(p.familiaGestora) || 'NULL';
    
    return `('${p.nombre.replace(/'/g, "''")}', '${p.nombre.replace(/'/g, "''")}', ${telefono ? `'${telefono}'` : 'NULL'}, ${movil ? `'${movil}'` : 'NULL'}, ${correo ? `'${correo}'` : 'NULL'}, 'efectivo', '${p.periodicidad}', TRUE, TRUE, ${familiaNum}, TRUE)`;
  });
  
  sql += proveedoresSQL.join(',\n') + ';\n\n';
  sql += `-- Total proveedores: ${proveedores.length}\n\n`;

  sql += `-- ============================================
-- 3. PRODUCTOS
-- ============================================\n\n`;

  let productoId = 1;
  for (let i = 0; i < proveedores.length; i++) {
    const p = proveedores[i];
    if (p.productos.length === 0) continue;
    
    sql += `-- Productos de ${p.nombre} (id_proveedor = ${i + 1})\n`;
    sql += `INSERT INTO Producto (Nombre, Descripcion, Precio, id_proveedor, Activo) VALUES\n`;
    
    const productosSQL = p.productos.map(prod => {
      return `('${prod.nombre.replace(/'/g, "''")}', '${prod.descripcion.replace(/'/g, "''")}', ${prod.precio}, ${i + 1}, TRUE)`;
    });
    
    sql += productosSQL.join(',\n') + ';\n\n';
    productoId += p.productos.length;
  }
  
  sql += `-- Total productos: ${productoId - 1}\n\n`;

  sql += `-- ============================================
-- 4. PEDIDOS PERIODICOS (Solo automaticos)
-- ============================================\n\n`;

  const pedidosPeriodicos = proveedores.filter(p => p.esAutomatico);
  
  if (pedidosPeriodicos.length > 0) {
    sql += `INSERT INTO Pedido_Periodico (id_proveedor, Periodicidad, Fecha_Inicio, Activo, Dia_Apertura, Dia_Cierre, Dia_Entrega) VALUES\n`;
    
    const ppSQL = pedidosPeriodicos.map((p, idx) => {
      const proveedorId = proveedores.indexOf(p) + 1;
      let dias = 7;
      if (p.periodicidad === 'mensual') dias = 30;
      else if (p.periodicidad === 'anual') dias = 365;
      else if (p.periodicidad === 'semestral') dias = 180;
      
      return `(${proveedorId}, ${dias}, CURRENT_DATE, TRUE, 1, 15, 20)`;
    });
    
    sql += ppSQL.join(',\n') + ';\n\n';
    sql += `-- Total pedidos periodicos: ${pedidosPeriodicos.length}\n\n`;
  }

  sql += `-- ============================================
-- 5. PEDIDOS ABIERTOS (Actuales)
-- ============================================\n\n`;

  const pedidosAbiertos = proveedores.filter(p => p.pedidoAbierto);
  
  if (pedidosAbiertos.length > 0) {
    sql += `INSERT INTO Pedido (id_proveedor, Fecha_Apertura, Fecha_Cierre, Fecha_Entrega, Estado) VALUES\n`;
    
    const paSQL = pedidosAbiertos.map((p, idx) => {
      const proveedorId = proveedores.indexOf(p) + 1;
      const ahora = new Date();
      const apertura = new Date(ahora);
      const cierre = new Date(ahora);
      cierre.setDate(cierre.getDate() + 5);
      const entrega = new Date(cierre);
      entrega.setDate(entrega.getDate() + 2);
      
      return `(${proveedorId}, '${apertura.toISOString().split('T')[0]}', '${cierre.toISOString().split('T')[0]}', '${entrega.toISOString().split('T')[0]}', 'pendiente')`;
    });
    
    sql += paSQL.join(',\n') + ';\n\n';
    sql += `-- Total pedidos abiertos: ${pedidosAbiertos.length}\n\n`;
  }

  sql += `-- ============================================
-- 6. ASIGNACIONES FAMILIA-PROVEEDOR (Gestores)
-- ============================================\n\n`;

  sql += `-- Los gestores se asignan automaticamente por el campo Familia en Proveedor\n`;
  sql += `-- Cada proveedor tiene asignada su familia gestora\n\n`;

  sql += `-- ============================================
-- RESUMEN
-- ============================================\n\n`;

  sql += `DO $$\n`;
  sql += `BEGIN\n`;
  sql += `  RAISE NOTICE '========================================';\n`;
  sql += `  RAISE NOTICE 'Importacion completada correctamente';\n`;
  sql += `  RAISE NOTICE 'Usuarios importados: %', (SELECT COUNT(*) FROM Usuario);\n`;
  sql += `  RAISE NOTICE 'Proveedores importados: %', (SELECT COUNT(*) FROM Proveedor);\n`;
  sql += `  RAISE NOTICE 'Productos importados: %', (SELECT COUNT(*) FROM Producto);\n`;
  sql += `  RAISE NOTICE 'Pedidos periodicos: %', (SELECT COUNT(*) FROM Pedido_Periodico);\n`;
  sql += `  RAISE NOTICE 'Pedidos abiertos: %', (SELECT COUNT(*) FROM Pedido WHERE Estado = 'pendiente');\n`;
  sql += `  RAISE NOTICE '========================================';\n`;
  sql += `END $$;\n`;

  const outputPath = path.join(DATOS_DIR, 'importar_datos.sql');
  fs.writeFileSync(outputPath, sql, 'utf-8');
  
  console.log(`\nArchivo generado: ${outputPath}`);
  console.log(`  - Usuarios: ${usuarios.length + 1}`);
  console.log(`  - Proveedores: ${proveedores.length}`);
  console.log(`  - Productos: ${productoId - 1}`);
  console.log(`  - Pedidos periodicos: ${pedidosPeriodicos.length}`);
  console.log(`  - Pedidos abiertos: ${pedidosAbiertos.length}`);
}

main();
