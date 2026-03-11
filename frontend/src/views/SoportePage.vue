<template>
  <div class="container py-4">
    <h2 class="mb-4">Soporte y Ayuda</h2>

    <ul class="nav nav-tabs mb-4" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#intro" type="button" role="tab">
          Introduccion
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#conceptos" type="button" role="tab">
          Conceptos Basicos
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#roles" type="button" role="tab">
          Guias por Rol
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#flujos" type="button" role="tab">
          Flujos de Trabajo
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#faq" type="button" role="tab">
          Preguntas Frecuentes
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#glosario" type="button" role="tab">
          Glosario
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#contacto" type="button" role="tab">
          Contacto
        </button>
      </li>
    </ul>

    <div class="tab-content">
      <!-- INTRODUCCION -->
      <div class="tab-pane fade show active" id="intro" role="tabpanel">
        <div class="card p-4">
          <h4 class="mb-3">Que es Ekonsumo</h4>
          <p>
            <strong>Ekonsumo</strong> es una aplicacion web disenada para gestionar un grupo de consumo local y ecologico.
            Nuestro grupo esta formado por aproximadamente <strong>40 familias</strong> y <strong>15 productores</strong>
            que trabajan juntos para acceder a alimentos frescos, ecologicos y a precios justos.
          </p>

          <h5 class="mt-4 mb-2">Objetivos del grupo</h5>
          <ul>
            <li>Conectar directamente familias con productores locales</li>
            <li>Obtener productos frescos y de temporada a precios justos</li>
            <li>Fomentar el comercio local y la economia circular</li>
            <li>Reducir intermediarios y embalajes innecesarios</li>
            <li>Crear comunidad en torno a la alimentacion responsable</li>
          </ul>

          <h5 class="mt-4 mb-2">Como funciona el grupo</h5>
          <p>
            El grupo funciona de forma cooperativa: las familias se organizan para hacer pedidos conjuntos a los productores.
            Cada familia puede asumir la responsabilidad de gestionar uno o mas proveedores, actuando como enlace entre
            el productor y el resto del grupo.
          </p>
          <p>
            Los pedidos se realizan de forma periodica (semanal, quincenal o mensual segun el proveedor).
            Una vez que el pedido cierra, la familia gestora contacta con el productor, confirma la disponibilidad
            y coordina la entrega.
          </p>

          <div class="alert alert-info mt-3">
            <strong>Nota:</strong> Esta aplicacion sustituye el sistema anterior basado en hojas de calculo compartidas,
            ofreciendo una interfaz mas amigable y eficiente para todos los miembros del grupo.
          </div>
        </div>
      </div>

      <!-- CONCEPTOS BASICOS -->
      <div class="tab-pane fade" id="conceptos" role="tabpanel">
        <div class="card p-4">
          <h4 class="mb-3">Conceptos Basicos</h4>

          <div class="accordion" id="accordionConceptos">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#concepto1">
                  Que es una Familia
                </button>
              </h2>
              <div id="concepto1" class="accordion-collapse collapse show" data-bs-parent="#accordionConceptos">
                <div class="accordion-body">
                  <p>
                    Una <strong>familia</strong> es la unidad basica del grupo de consumo. Cada usuario pertenece a una familia,
                    identificada por un numero. Por ejemplo: "Familia Garcia" podria ser la familia numero 5.
                  </p>
                  <p>Tipos de familias:</p>
                  <ul>
                    <li><strong>Familia consumidora:</strong> Realiza pedidos de productos pero no gestiona ningun proveedor.</li>
                    <li><strong>Familia gestora:</strong> Ademas de realizar pedidos, se encarga de coordinar uno o mas proveedores.</li>
                  </ul>
                  <p>
                    Todos los miembros de una misma familia comparten la gestion de los proveedores asignados.
                    Esto permite que varias personas de una misma familia colaboren en las tareas de coordinacion.
                  </p>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#concepto2">
                  Que es un Proveedor
                </button>
              </h2>
              <div id="concepto2" class="accordion-collapse collapse" data-bs-parent="#accordionConceptos">
                <div class="accordion-body">
                  <p>
                    Un <strong>proveedor</strong> es un productor o grupo de productos. Por ejemplo:
                  </p>
                  <ul>
                    <li>"Verduras Eco" - Productor de verduras ecologicas</li>
                    <li>"Panaderia Artesanal" - Panadero local</li>
                    <li>"Lacteos del Valle" - Quesos y yogures artesanales</li>
                  </ul>
                  <p>
                    Cada proveedor tiene asignada una familia gestora que se encarga de:
                  </p>
                  <ul>
                    <li>Abrir y cerrar los pedidos periodicos</li>
                    <li>Actualizar el catalogo de productos</li>
                    <li>Contactar con el productor para confirmar pedidos</li>
                    <li>Coordinar la entrega de productos</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#concepto3">
                  Que es un Pedido Abierto
                </button>
              </h2>
              <div id="concepto3" class="accordion-collapse collapse" data-bs-parent="#accordionConceptos">
                <div class="accordion-body">
                  <p>
                    Un <strong>pedido abierto</strong> es un periodo de tiempo durante el cual los usuarios pueden
                    anadir, modificar o eliminar productos de su pedido.
                  </p>
                  <p>Un pedido tiene las siguientes fechas importantes:</p>
                  <ul>
                    <li><strong>Fecha de apertura:</strong> Momento en que el pedido se abre para realizar compras.</li>
                    <li><strong>Fecha de cierre:</strong> Momento en que el pedido se cierra y ya no se pueden hacer cambios.</li>
                    <li><strong>Fecha de entrega:</strong> Dia estimado en que llegaran los productos.</li>
                  </ul>
                  <div class="alert alert-warning">
                    <strong>Importante:</strong> Solo puedes modificar tu pedido mientras este abierto.
                    Una vez cerrado, no podras anadir ni quitar productos.
                  </div>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#concepto4">
                  Estados de un Pedido
                </button>
              </h2>
              <div id="concepto4" class="accordion-collapse collapse" data-bs-parent="#accordionConceptos">
                <div class="accordion-body">
                  <p>Los pedidos pasan por diferentes estados durante su ciclo de vida:</p>
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Estado</th>
                        <th>Descripcion</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span class="badge bg-warning text-dark">Pendiente</span></td>
                        <td>El pedido esta abierto y se pueden hacer cambios.</td>
                      </tr>
                      <tr>
                        <td><span class="badge bg-info">En proceso</span></td>
                        <td>El pedido ha cerrado y se esta preparando con el productor.</td>
                      </tr>
                      <tr>
                        <td><span class="badge bg-primary">Entregado</span></td>
                        <td>Los productos han llegado al punto de entrega.</td>
                      </tr>
                      <tr>
                        <td><span class="badge bg-success">Repartido</span></td>
                        <td>Los productos han sido recogidos por las familias.</td>
                      </tr>
                      <tr>
                        <td><span class="badge bg-danger">Cancelado</span></td>
                        <td>El pedido ha sido cancelado.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#concepto5">
                  Sistema de Pagos
                </button>
              </h2>
              <div id="concepto5" class="accordion-collapse collapse" data-bs-parent="#accordionConceptos">
                <div class="accordion-body">
                  <p>
                    El grupo utiliza un sistema de <strong>saldos</strong> para gestionar los pagos entre miembros:
                  </p>
                  <ul>
                    <li><strong>Saldo:</strong> Cantidad de dinero que tienes en tu cuenta del grupo.</li>
                    <li><strong>Deuda:</strong> Cantidad que debes a otro miembro del grupo.</li>
                    <li><strong>Credito:</strong> Cantidad que otro miembro te debe a ti.</li>
                  </ul>
                  <p>Como funciona:</p>
                  <ol>
                    <li>Cuando haces un pedido, se genera una deuda a favor de la familia gestora.</li>
                    <li>El deudor marca el pago como "enviado" cuando realiza la transferencia.</li>
                    <li>El acreedor confirma que ha recibido el pago.</li>
                    <li>La deuda se cierra automaticamente.</li>
                  </ol>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#concepto6">
                  Pedidos Periodicos
                </button>
              </h2>
              <div id="concepto6" class="accordion-collapse collapse" data-bs-parent="#accordionConceptos">
                <div class="accordion-body">
                  <p>
                    Algunos productos se piden de forma <strong>automatica y periodica</strong> (por ejemplo, cada semana).
                    Esto permite que no tengas que estar pendiente de anadir los mismos productos cada vez.
                  </p>
                  <p>Caracteristicas:</p>
                  <ul>
                    <li>Se configuran una vez y se repiten automaticamente.</li>
                    <li>Puedes activarlos o desactivarlos cuando quieras.</li>
                    <li>Ideal para productos de consumo habitual (pan, leche, huevos...).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GUIAS POR ROL -->
      <div class="tab-pane fade" id="roles" role="tabpanel">
        <div class="card p-4">
          <h4 class="mb-3">Guias por Rol</h4>

          <ul class="nav nav-pills mb-3" role="tablist">
            <li class="nav-item">
              <button class="nav-link active" data-bs-toggle="pill" data-bs-target="#rol-usuario" type="button">
                Usuario Regular
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="pill" data-bs-target="#rol-gestor" type="button">
                Usuario Gestor
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="pill" data-bs-target="#rol-admin" type="button">
                Administrador
              </button>
            </li>
          </ul>

          <div class="tab-content">
            <div class="tab-pane fade show active" id="rol-usuario">
              <h5>Funcionalidades disponibles</h5>
              <ul>
                <li>Iniciar sesion y registrarse</li>
                <li>Recuperar contrasena</li>
                <li>Ver productos disponibles</li>
                <li>Anadir productos a pedidos abiertos</li>
                <li>Modificar cantidades de tu pedido</li>
                <li>Ver historial de pedidos</li>
                <li>Gestionar tus pagos y deudas</li>
                <li>Actualizar tu perfil</li>
                <li>Configurar notificaciones</li>
              </ul>

              <h5 class="mt-4">Secciones del menu</h5>
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Seccion</th>
                    <th>Funcion</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Dashboard</td>
                    <td>Resumen de tu actividad, pedidos pendientes y resumen financiero.</td>
                  </tr>
                  <tr>
                    <td>Compras</td>
                    <td>Catalogo de productos disponibles para pedir.</td>
                  </tr>
                  <tr>
                    <td>Historial</td>
                    <td>Listado de todos tus pedidos anteriores.</td>
                  </tr>
                  <tr>
                    <td>Pagos</td>
                    <td>Gestion de deudas y saldos con otros miembros.</td>
                  </tr>
                  <tr>
                    <td>Configuracion</td>
                    <td>Editar tu perfil y preferencias.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="tab-pane fade" id="rol-gestor">
              <h5>Funcionalidades adicionales</h5>
              <p>Como usuario gestor de un proveedor, tienes acceso a:</p>
              <ul>
                <li><strong>Gestion de Productos:</strong> Crear, editar y eliminar productos de tu proveedor.</li>
                <li><strong>Gestion de Pedidos:</strong> Abrir y cerrar pedidos, cambiar estados.</li>
                <li><strong>Ver todos los pedidos:</strong> Acceso a los pedidos de todas las familias a tu proveedor.</li>
              </ul>

              <h5 class="mt-4">Responsabilidades</h5>
              <ol>
                <li>Mantener actualizado el catalogo de productos (precios, disponibilidad).</li>
                <li>Abrir los pedidos en las fechas acordadas.</li>
                <li>Cerrar los pedidos y enviar el resumen al productor.</li>
                <li>Coordinar la entrega con el productor.</li>
                <li>Actualizar el estado de los pedidos (en proceso, entregado, repartido).</li>
                <li>Gestionar los pagos de las familias a tu cargo.</li>
              </ol>

              <div class="alert alert-info mt-3">
                <strong>Consejo:</strong> Comunica siempre las fechas de apertura y cierre con antelacion
                para que las familias puedan organizar sus pedidos.
              </div>
            </div>

            <div class="tab-pane fade" id="rol-admin">
              <h5>Funcionalidades completas</h5>
              <p>Como administrador tienes acceso total a todas las funcionalidades:</p>
              <ul>
                <li><strong>Gestion de Usuarios:</strong> Crear, editar, activar/desactivar usuarios.</li>
                <li><strong>Gestion de Proveedores:</strong> Crear y configurar proveedores, asignar familias gestoras.</li>
                <li><strong>Gestion de Productos:</strong> Acceso a todos los productos de todos los proveedores.</li>
                <li><strong>Gestion de Pedidos:</strong> Ver y administrar todos los pedidos del grupo.</li>
                <li><strong>Pedidos Periodicos:</strong> Configurar la automatizacion de pedidos.</li>
                <li><strong>Gestion de Saldos:</strong> Ver y ajustar saldos de todos los usuarios.</li>
                <li><strong>Notificaciones:</strong> Enviar comunicados a todos los miembros.</li>
              </ul>

              <h5 class="mt-4">Tareas administrativas</h5>
              <ul>
                <li>Generar liquidaciones mensuales de pagos.</li>
                <li>Supervisar el correcto funcionamiento del grupo.</li>
                <li>Resolver incidencias entre miembros.</li>
                <li>Actualizar informacion de proveedores.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- FLUJOS DE TRABAJO -->
      <div class="tab-pane fade" id="flujos" role="tabpanel">
        <div class="card p-4">
          <h4 class="mb-3">Flujos de Trabajo</h4>

          <div class="accordion" id="accordionFlujos">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flujo1">
                  Como hacer un pedido semanal
                </button>
              </h2>
              <div id="flujo1" class="accordion-collapse collapse show" data-bs-parent="#accordionFlujos">
                <div class="accordion-body">
                  <ol>
                    <li>Entra en la seccion <strong>Compras</strong> desde el menu.</li>
                    <li>Usa los filtros para ver solo productos con <strong>"Pedido abierto"</strong>.</li>
                    <li>Navega por los productos agrupados por proveedor.</li>
                    <li>Cuando encuentres un producto que quieras, pulsa <strong>"Anadir a la cesta"</strong>.</li>
                    <li>El producto se anadira con cantidad 1. Puedes pulsar varias veces para anadir mas.</li>
                    <li>Ve a <strong>Dashboard</strong> para ver un resumen de tus pedidos pendientes.</li>
                    <li>Desde Dashboard puedes modificar las cantidades con los botones <strong>+</strong> y <strong>-</strong>.</li>
                    <li>Si pones la cantidad a 0, el producto se eliminara de tu pedido.</li>
                  </ol>
                  <div class="alert alert-warning">
                    <strong>Recuerda:</strong> Solo puedes modificar tu pedido mientras el pedido este abierto.
                    Revisa las fechas de cierre en cada proveedor.
                  </div>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flujo2">
                  Como consultar mi historial de pedidos
                </button>
              </h2>
              <div id="flujo2" class="accordion-collapse collapse" data-bs-parent="#accordionFlujos">
                <div class="accordion-body">
                  <ol>
                    <li>Entra en la seccion <strong>Historial</strong> desde el menu.</li>
                    <li>Veras un listado de todos tus pedidos anteriores.</li>
                    <li>Cada tarjeta muestra: proveedor, estado, numero de productos, importe total.</li>
                    <li>Pulsa <strong>"Ver detalles"</strong> para ver los productos de un pedido concreto.</li>
                    <li>En la vista de detalles veras las imagenes, cantidades y precios de cada producto.</li>
                  </ol>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flujo3">
                  Como gestionar mis pagos y deudas
                </button>
              </h2>
              <div id="flujo3" class="accordion-collapse collapse" data-bs-parent="#accordionFlujos">
                <div class="accordion-body">
                  <h6>Si debes dinero a alguien:</h6>
                  <ol>
                    <li>Entra en <strong>Pagos</strong> desde el menu.</li>
                    <li>Veras las deudas donde apareces como deudor.</li>
                    <li>Realiza la transferencia al acreedor (datos de contacto en la tarjeta).</li>
                    <li>Pulsa <strong>"Marcar como pagado"</strong> para indicar que has enviado el dinero.</li>
                    <li>El acreedor debera confirmar la recepcion para cerrar la deuda.</li>
                  </ol>

                  <h6 class="mt-3">Si alguien te debe dinero:</h6>
                  <ol>
                    <li>Entra en <strong>Pagos</strong> desde el menu.</li>
                    <li>Veras las deudas donde apareces como acreedor.</li>
                    <li>Cuando el deudor marque el pago como enviado, veras un aviso.</li>
                    <li>Verifica que has recibido el dinero.</li>
                    <li>Pulsa <strong>"Marcar como recibido"</strong> para cerrar la deuda.</li>
                  </ol>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flujo4">
                  Como gestionar un proveedor (para gestores)
                </button>
              </h2>
              <div id="flujo4" class="accordion-collapse collapse" data-bs-parent="#accordionFlujos">
                <div class="accordion-body">
                  <h6>Abrir un nuevo pedido:</h6>
                  <ol>
                    <li>Entra en <strong>Gestion de Pedidos</strong>.</li>
                    <li>Pulsa <strong>"Crear pedido"</strong>.</li>
                    <li>Selecciona tu proveedor.</li>
                    <li>Establece la <strong>fecha de apertura</strong> (cuando empieza el periodo de pedidos).</li>
                    <li>Establece la <strong>fecha de cierre</strong> (cuando termina el periodo de pedidos).</li>
                    <li>Establece la <strong>fecha de entrega</strong> estimada.</li>
                    <li>Guarda el pedido. El estado sera "pendiente" y estara abierto.</li>
                  </ol>

                  <h6 class="mt-3">Cerrar un pedido:</h6>
                  <ol>
                    <li>Entra en <strong>Gestion de Pedidos</strong>.</li>
                    <li>Busca el pedido que quieres cerrar.</li>
                    <li>Pulsa <strong>"Editar"</strong> y cambia el estado a <strong>"En proceso"</strong>.</li>
                    <li>Descarga o exporta el resumen del pedido para enviarlo al productor.</li>
                  </ol>

                  <h6 class="mt-3">Actualizar productos:</h6>
                  <ol>
                    <li>Entra en <strong>Gestion de Productos</strong>.</li>
                    <li>Veras los productos de tu proveedor.</li>
                    <li>Puedes crear nuevos productos, editar precios o desactivar productos.</li>
                  </ol>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flujo5">
                  Como configurar pedidos periodicos (para admins)
                </button>
              </h2>
              <div id="flujo5" class="accordion-collapse collapse" data-bs-parent="#accordionFlujos">
                <div class="accordion-body">
                  <ol>
                    <li>Entra en <strong>Pedidos Periodicos</strong> desde el menu (solo administradores).</li>
                    <li>Pulsa <strong>"Crear pedido periodico"</strong>.</li>
                    <li>Selecciona el <strong>proveedor</strong>.</li>
                    <li>Introduce la <strong>periodicidad</strong> en dias (ej: 7 para semanal).</li>
                    <li>Configura los dias del mes para apertura, cierre y entrega.</li>
                    <li>Activa el pedido periodico.</li>
                    <li>El sistema creara automaticamente los pedidos segun la configuracion.</li>
                  </ol>
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flujo6">
                  Como actualizar mi perfil
                </button>
              </h2>
              <div id="flujo6" class="accordion-collapse collapse" data-bs-parent="#accordionFlujos">
                <div class="accordion-body">
                  <ol>
                    <li>Entra en <strong>Configuracion</strong> desde el menu.</li>
                    <li>Modifica los campos que desees (nombre, telefono, etc.).</li>
                    <li>Si quieres cambiar la contrasena, introduce la actual y la nueva.</li>
                    <li>Pulsa <strong>"Guardar cambios"</strong>.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div class="tab-pane fade" id="faq" role="tabpanel">
        <div class="card p-4">
          <h4 class="mb-3">Preguntas Frecuentes</h4>

          <div class="accordion" id="accordionFaq">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                  Como anado productos a mi pedido?
                </button>
              </h2>
              <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#accordionFaq">
                <div class="accordion-body">
                  Entra en <strong>Compras</strong>, busca productos con pedido abierto y pulsa "Anadir a la cesta".
                  Puedes filtrar por estado para ver solo los productos disponibles.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                  Por que no puedo editar unidades en el dashboard?
                </button>
              </h2>
              <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#accordionFaq">
                <div class="accordion-body">
                  Solo se permite editar unidades cuando el pedido correspondiente esta abierto.
                  Una vez que el pedido cierra, no puedes hacer cambios. Revisa la fecha de cierre en la tarjeta del pedido.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                  Donde veo el estado de mis pedidos?
                </button>
              </h2>
              <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#accordionFaq">
                <div class="accordion-body">
                  En <strong>Dashboard</strong> puedes ver los pedidos pendientes de entrega.
                  En <strong>Historial</strong> puedes ver todos tus pedidos anteriores con su estado actual.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                  Como funciona la gestion de pagos?
                </button>
              </h2>
              <div id="faq4" class="accordion-collapse collapse" data-bs-parent="#accordionFaq">
                <div class="accordion-body">
                  El deudor marca el pago como enviado cuando realiza la transferencia.
                  El acreedor debe confirmar la recepcion para cerrar la deuda.
                  Ambas partes deben confirmar para evitar malentendidos.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                  Que hago si un producto no tiene imagen?
                </button>
              </h2>
              <div id="faq5" class="accordion-collapse collapse" data-bs-parent="#accordionFaq">
                <div class="accordion-body">
                  Si un producto no tiene imagen, se mostrara un icono generico.
                  Puedes contactar con la familia gestora del proveedor para que actualicen la imagen.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq6">
                  Puedo ver los pedidos de otras familias?
                </button>
              </h2>
              <div id="faq6" class="accordion-collapse collapse" data-bs-parent="#accordionFaq">
                <div class="accordion-body">
                  No. Por privacidad, solo puedes ver tus propios pedidos.
                  Los gestores de proveedores pueden ver los pedidos a su proveedor (sin detalles de otras familias).
                  Los administradores tienen acceso completo.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq7">
                  Como se que productos estan disponibles?
                </button>
              </h2>
              <div id="faq7" class="accordion-collapse collapse" data-bs-parent="#accordionFaq">
                <div class="accordion-body">
                  En <strong>Compras</strong>, los productos con "Pedido abierto" estan disponibles para pedir.
                  Los productos con "Pedido cerrado" no se pueden anadir hasta que se abra un nuevo pedido.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq8">
                  Que significa el badge con numero en el menu?
                </button>
              </h2>
              <div id="faq8" class="accordion-collapse collapse" data-bs-parent="#accordionFaq">
                <div class="accordion-body">
                  El icono de caja con un numero indica cuantos productos tienes pendientes de entrega.
                  Te lleva directamente al Dashboard donde puedes ver el detalle.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq9">
                  Como puedo ser gestor de un proveedor?
                </button>
              </h2>
              <div id="faq9" class="accordion-collapse collapse" data-bs-parent="#accordionFaq">
                <div class="accordion-body">
                  Contacta con un administrador del grupo. El administrador puede asignar tu familia
                  como gestora de un proveedor. Todos los miembros de tu familia tendran acceso a la gestion.
                </div>
              </div>
            </div>

            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq10">
                  He olvidado mi contrasena, como la recupero?
                </button>
              </h2>
              <div id="faq10" class="accordion-collapse collapse" data-bs-parent="#accordionFaq">
                <div class="accordion-body">
                  En la pagina de login, pulsa <strong>"Has olvidado tu contrasena?"</strong>.
                  Introduce tu correo y recibiras un enlace para restablecerla.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GLOSARIO -->
      <div class="tab-pane fade" id="glosario" role="tabpanel">
        <div class="card p-4">
          <h4 class="mb-3">Glosario de Terminos</h4>

          <table class="table">
            <thead>
              <tr>
                <th>Termino</th>
                <th>Definicion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Acreedor</strong></td>
                <td>Persona que tiene derecho a recibir un pago.</td>
              </tr>
              <tr>
                <td><strong>Dashboard</strong></td>
                <td>Pagina principal con resumen de actividad y pedidos pendientes.</td>
              </tr>
              <tr>
                <td><strong>Deudor</strong></td>
                <td>Persona que tiene la obligacion de realizar un pago.</td>
              </tr>
              <tr>
                <td><strong>Detalle de pedido</strong></td>
                <td>Cada linea de producto dentro de un pedido (producto, cantidad, precio).</td>
              </tr>
              <tr>
                <td><strong>Familia</strong></td>
                <td>Unidad basica del grupo de consumo, identificada por un numero.</td>
              </tr>
              <tr>
                <td><strong>Familia gestora</strong></td>
                <td>Familia responsable de coordinar uno o mas proveedores.</td>
              </tr>
              <tr>
                <td><strong>Liquidacion mensual</strong></td>
                <td>Resumen de pagos y deudas generado automaticamente cada mes.</td>
              </tr>
              <tr>
                <td><strong>Pedido</strong></td>
                <td>Conjunto de productos solicitados a un proveedor en un periodo determinado.</td>
              </tr>
              <tr>
                <td><strong>Pedido abierto</strong></td>
                <td>Pedido en periodo de edicion donde se pueden anadir/modificar productos.</td>
              </tr>
              <tr>
                <td><strong>Pedido periodico</strong></td>
                <td>Pedido que se genera automaticamente de forma recurrente.</td>
              </tr>
              <tr>
                <td><strong>Producto</strong></td>
                <td>Articulo disponible para pedir, asociado a un proveedor.</td>
              </tr>
              <tr>
                <td><strong>Proveedor</strong></td>
                <td>Productor o grupo de productos (ej: verduras, pan, lacteos).</td>
              </tr>
              <tr>
                <td><strong>Saldo</strong></td>
                <td>Cantidad de dinero disponible en la cuenta del usuario dentro del grupo.</td>
              </tr>
              <tr>
                <td><strong>Usuario gestor</strong></td>
                <td>Usuario que pertenece a una familia gestora y puede administrar proveedores.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CONTACTO -->
      <div class="tab-pane fade" id="contacto" role="tabpanel">
        <div class="card p-4">
          <h4 class="mb-3">Contacto y Soporte</h4>

          <div class="row">
            <div class="col-md-6 mb-4">
              <h5>Enviar consulta</h5>
              <form @submit.prevent="enviarConsulta">
                <div class="mb-3">
                  <label class="form-label" for="nombre">Nombre</label>
                  <input id="nombre" v-model="form.nombre" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label" for="correo">Correo</label>
                  <input id="correo" v-model="form.correo" type="email" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label" for="mensaje">Mensaje</label>
                  <textarea id="mensaje" v-model="form.mensaje" class="form-control" rows="5" required />
                </div>
                <div class="d-flex gap-2 flex-wrap">
                  <button class="btn btn-primary" type="submit" :disabled="enviando">
                    {{ enviando ? 'Enviando...' : 'Enviar consulta' }}
                  </button>
                  <a class="btn btn-outline-secondary" :href="mailtoLink">Abrir cliente de correo</a>
                </div>
              </form>
            </div>

            <div class="col-md-6 mb-4">
              <h5>Otras formas de contacto</h5>
              <div class="card bg-light">
                <div class="card-body">
                  <p class="mb-2">
                    <i class="fas fa-envelope me-2"></i>
                    <strong>Email:</strong> soporte@ekonsumo.local
                  </p>
                  <p class="mb-2">
                    <i class="fas fa-phone me-2"></i>
                    <strong>Telefono:</strong> Contacta con tu familia gestora
                  </p>
                  <p class="mb-0">
                    <i class="fas fa-users me-2"></i>
                    <strong>Reuniones:</strong> Consulta el calendario del grupo
                  </p>
                </div>
              </div>

              <h5 class="mt-4">Horario de atencion</h5>
              <p>
                Las consultas se responden en un plazo de <strong>24-48 horas</strong> laborables.
                Para urgencias, contacta directamente con tu familia gestora o un administrador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { useAuthStore } from '@/store';
import { alertStore } from '@/store/alertStore';

export default {
  data() {
    return {
      enviando: false,
      form: {
        nombre: '',
        correo: '',
        mensaje: '',
      },
    };
  },
  computed: {
    mailtoLink() {
      const asunto = encodeURIComponent('Consulta soporte Ekonsumo');
      const cuerpo = encodeURIComponent(
        `Nombre: ${this.form.nombre}\nCorreo: ${this.form.correo}\n\nMensaje:\n${this.form.mensaje}`
      );
      return `mailto:soporte@ekonsumo.local?subject=${asunto}&body=${cuerpo}`;
    },
  },
  created() {
    const authStore = useAuthStore();
    this.form.nombre = authStore.user?.nombre || '';
    this.form.correo = authStore.user?.correo || '';
  },
  methods: {
    async enviarConsulta() {
      this.enviando = true;
      try {
        const authStore = useAuthStore();
        const idUsuario = Number(authStore.user?.id_usuario);

        if (!idUsuario) {
          alertStore.showAlert('No se pudo identificar el usuario de sesion.', 'danger');
          return;
        }

        const mensaje = `[SOPORTE] ${this.form.mensaje}\nContacto: ${this.form.nombre} (${this.form.correo})`;

        await api.enviarNotificacion({
          id_usuario: idUsuario,
          mensaje,
        });

        alertStore.showAlert('Consulta enviada correctamente.', 'success');
        this.form.mensaje = '';
      } catch {
        alertStore.showAlert('No se pudo enviar la consulta desde la app.', 'danger');
      } finally {
        this.enviando = false;
      }
    },
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #dee2e6;
  border-radius: 10px;
}

.accordion-button:not(.collapsed) {
  background-color: #e7f1ff;
  color: #0d6efd;
}

.nav-tabs .nav-link {
  color: #495057;
}

.nav-tabs .nav-link.active {
  font-weight: 600;
}

.nav-pills .nav-link {
  color: #495057;
}

.nav-pills .nav-link.active {
  background-color: #0d6efd;
  color: #fff;
}
</style>
