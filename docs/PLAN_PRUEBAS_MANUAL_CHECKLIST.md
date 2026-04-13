# Plan de Pruebas Manual y Checklist de Calidad

Este documento sirve como guia de validacion completa

## 1) Objetivo y alcance

- Validar flujos criticos de Ekonsumo .
- Detectar: funcionalidades faltantes, funcionalidades con fallo, deuda UIX/visual y regresiones.
- Alcance: frontend + backend + integracion API + permisos por rol + usabilidad basica.

## 2) Preparacion del entorno

### 2.1 Precondiciones

- [ ] Node `22.12.0` activo (`nvm use`).
- [ ] PostgreSQL levantado y accesible.
- [ ] Variables de entorno configuradas en `backend/.env` y `frontend/.env.development`.
- [ ] Base de datos creada y con datos de prueba.

### 2.2 Arranque

- [ ] Backend: `npm run start:backend`
- [ ] Frontend: `npm run start:frontend`
- [ ] Swagger accesible (`/api-docs`) para contrastar endpoints.

### 2.3 Cuentas de prueba 

- [ ] Usuario admin activo (datos prueba)
- [ ] Usuario normal activo (datos prueba)
- [ ] Usuario inactivo

## 3) Criterios de severidad para incidencias

- `Bloqueante`: impide flujo principal (login, compras, guardar entidades).
- `Alta`: flujo principal con funcionamiento parcial.
- `Media`: fallo funcional no critico o inconsistencia de datos.
- `Baja`: UI/UX, visual, copy, detalle no funcional.

## 4) Smoke test (test preliminar. 15-20 min)

- [ ] Login admin correcto.
- [ ] Login usuario correcto.
- [ ] Redireccion a login cuando token expira.
- [ ] Dashboard carga sin error 500/401 inesperado.
- [ ] Compras lista productos y permite anadir en pedido abierto.
- [ ] Gestion Usuarios lista y permite editar.
- [ ] Gestion Proveedores lista y permite editar.
- [ ] Gestion Productos lista y permite editar.
- [ ] Gestion Pedidos lista y permite crear/editar.

## 5) Checklist funcional por modulo

## 5.1 Autenticacion y sesion

- [ ] Login con correo valido.
- [ ] Login con movil valido.
- [ ] Mensaje correcto en credenciales invalidas.
- [ ] Logout limpia sesion y no permite volver a rutas protegidas.
- [ ] Guard de rutas protege pantallas internas.

## 5.2 Dashboard

- [ ] Muestra nombre del usuario actual.
- [ ] Muestra productos pendientes de entrega del usuario logueado.
- [ ] Muestra estado visual de pedido (badge por estado).
- [ ] Muestra pedidos abiertos.
- [ ] Permite aumentar/disminuir unidades solo en pedidos abiertos.
- [ ] No permite editar unidades en pedidos cerrados.
- [ ] Refleja cambios de unidades tras recarga.

## 5.3 Compras

- [ ] Muestra nombre, descripcion, precio e imagen.
- [ ] Muestra productor/proveedor de cada producto.
- [ ] Muestra periodicidad del pedido.
- [ ] Distingue visualmente pedido abierto/cerrado.
- [ ] Boton "Anadir" habilitado solo si pedido abierto.
- [ ] Al anadir producto, aparece en dashboard como pendiente.
- [ ] Si ya existe detalle, incrementa cantidad (no duplica incoherente).

## 5.4 Gestion de Usuarios (admin)

- [ ] Lista usuarios con estado y datos basicos.
- [ ] Crear usuario nuevo.
- [ ] Editar usuario existente.
- [ ] Activar/desactivar usuario.
- [ ] Eliminar usuario.
- [ ] Validacion de correo duplicado muestra error util.

## 5.5 Gestion de Proveedores

- [ ] Listado correcto de proveedores.
- [ ] Crear proveedor con frecuencia valida.
- [ ] Editar proveedor y persistir cambios.
- [ ] Activar/desactivar proveedor.
- [ ] Eliminar proveedor sin romper productos relacionados.

## 5.6 Gestion de Productos

- [ ] Lista productos con proveedor e imagen.
- [ ] Crear producto con imagen.
- [ ] Editar producto sin cambiar imagen (debe conservarse).
- [ ] Editar producto cambiando imagen.
- [ ] Activar/desactivar producto.
- [ ] Eliminar producto.

## 5.7 Gestion de Pedidos

- [ ] Listar pedidos con fechas y estado.
- [ ] Crear pedido (proveedor, encargado, fechas, estado).
- [ ] Editar pedido.
- [ ] Cambiar estado de pedido.
- [ ] Eliminar pedido.
- [ ] Validar que pedidos cerrados no permitan edicion de detalles en dashboard.

## 5.8 Historial y detalles (si aplica en sprint)

- [ ] Historial carga sin error.
- [ ] Detalle muestra productos, cantidades y estado.

## 6) Checklist de permisos y seguridad

- [ ] Usuario no admin no entra a gestion de usuarios.
- [ ] Usuario no autenticado no entra a rutas protegidas.
- [ ] Endpoint protegido responde 401 sin token.
- [ ] Endpoint admin responde 403 para usuario normal.

## 7) Checklist UIX y visual (evaluacion heuristica)

## 7.1 Claridad de interfaz

- [ ] Jerarquia visual clara (titulos, acciones primarias, estados).
- [ ] Feedback visible en acciones async (cargando, guardando, error, exito).
- [ ] Mensajes de error comprensibles para usuario final.

## 7.2 Consistencia

- [ ] Misma semantica de botones (`Guardar`, `Cancelar`, `Eliminar`).
- [ ] Misma paleta para estados (pendiente, proceso, entregado, cancelado).
- [ ] Formatos consistentes de fecha y moneda.

## 7.3 Accesibilidad basica

- [ ] Navegacion por teclado en formularios principales.
- [ ] Contraste suficiente en textos y badges.
- [ ] Labels asociados a inputs en formularios.

## 7.4 Responsive

- [ ] Vista movil <= 768px usable sin solapamientos.
- [ ] Tablas con comportamiento responsive.
- [ ] Modales visibles y operables en movil.

## 8) Pruebas tecnicas de soporte

- [ ] `npm run lint --workspace=frontend`
- [ ] `npm run test:frontend`
- [ ] `npm run test:backend`
- [ ] `npm run build --workspace=frontend`

## 9) Plantilla de reporte de incidencias

Usar este formato por cada bug detectado:

- ID: `BUG-XXX`
- Modulo: `Dashboard | Compras | Usuarios | ...`
- Severidad: `Bloqueante/Alta/Media/Baja`
- Rol probado: `admin/usuario`
- Pasos para reproducir:
  1. ...
  2. ...
  3. ...
- Resultado esperado: ...
- Resultado actual: ...
- Evidencia: screenshot/video/log
- Entorno: navegador, OS, fecha

## 10) Criterio de cierre de pruebas

- [ ] 0 bugs bloqueantes
- [ ] 0 bugs de severidad alta pendientes sin plan
- [ ] Bugs medios/bajos registrados y priorizados
- [ ] Checklist funcional completado >= 90%
- [ ] Checklist UIX/visual revisado y backlog generado
