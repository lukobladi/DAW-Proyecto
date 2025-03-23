Aquí tienes la documentación actualizada con los componentes y estilos que hemos creado:

---

# Diseño Visual para Ekonsumo Taldea

## 1. Guía de Estilo

### Paleta de Colores
- **Color Primario**: `#4CAF50` (Verde) - Representa la sostenibilidad y la ecología.
- **Color Secundario**: `#FF9800` (Naranja) - Para botones y elementos destacados.
- **Color de Fondo**: `#FFFFFF` (Blanco) - Para una apariencia limpia y moderna.
- **Color de Texto**: `#333333` (Gris oscuro) - Para asegurar buena legibilidad.
- **Color de Enlaces**: `#007BFF` (Azul) - Para enlaces y acciones interactivas.
- **Color de Error**: `#DC3545` (Rojo) - Para mensajes de error y advertencias.

### Tipografía
- **Fuente Principal**: 
  - **Nombre**: `Open Sans`
  - **Estilo**: Regular
  - **Tamaño**: `16px` para texto normal, `24px` para encabezados.
  
- **Fuente Secundaria**: 
  - **Nombre**: `Roboto`
  - **Estilo**: Italic
  - **Tamaño**: `14px` para subtítulos y notas.

### Iconografía
- Utiliza iconos de **Font Awesome** o **Material Icons** para mantener la coherencia visual.
- Asegúrate de que los iconos sean simples y fáciles de entender.

---

## 2. Elementos de Interfaz

### Botones
- **Estilo**: 
  - Bordes redondeados (`5px` de radio).
  - Sombra sutil para dar profundidad (`box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)`).
- **Colores**: 
  - Fondo: Color secundario (`#FF9800`).
  - Texto: Blanco (`#FFFFFF`).
- **Efecto Hover**: 
  - Cambiar a un tono más oscuro del color secundario (`#E68900`).
- **Ejemplo**:
  ```css
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #FF9800;
    color: white;
    transition: background-color 0.3s ease;
  }
  .btn:hover {
    background-color: #E68900;
  }
  ```

### Formularios
- **Estilo de Campos**: 
  - Bordes redondeados (`5px` de radio).
  - Sombra ligera para destacar (`box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)`).
- **Colores**: 
  - Fondo: Blanco (`#FFFFFF`).
  - Texto: Gris oscuro (`#333333`).
- **Efecto Focus**: 
  - Resaltar el borde con el color primario (`#4CAF50`).
- **Ejemplo**:
  ```css
  input, textarea {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  input:focus, textarea:focus {
    border-color: #4CAF50;
    outline: none;
  }
  ```

### Tarjetas de Producto
- **Estilo**: 
  - Bordes redondeados (`10px` de radio).
  - Sombra para dar un efecto de elevación (`box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)`).
- **Colores**: 
  - Fondo: Blanco (`#FFFFFF`).
  - Texto: Gris oscuro (`#333333`).
- **Elementos**: 
  - Imagen del producto en la parte superior.
  - Nombre del producto y precio debajo de la imagen.
- **Ejemplo**:
  ```css
  .producto-card {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  .producto-card:hover {
    transform: translateY(-5px);
  }
  ```

---

## 3. Diseño de Pantallas Clave

### Pantalla de Inicio (`HomePage.vue`)
- **Encabezado**: Logo a la izquierda, menú de navegación a la derecha.
- **Cuerpo**: Descripción del grupo centrada, botones de inicio de sesión y registro debajo.
- **Ejemplo**:
  ```vue
  <template>
    <div class="home-page">
      <NavBar />
      <div class="hero-section">
        <h1>Bienvenido al Grupo de Consumo</h1>
        <p>Un espacio para comprar productos locales y ecológicos de manera colaborativa.</p>
        <div class="buttons">
          <router-link to="/login" class="btn btn-primary">Iniciar Sesión</router-link>
          <router-link to="/register" class="btn btn-secondary">Registrarse</router-link>
        </div>
      </div>
      <Footer />
    </div>
  </template>
  ```

### Pantalla de Registro (`RegisterPage.vue`)
- **Formulario**: Campos alineados verticalmente, con etiquetas encima.
- **Botón de Registro**: Centrado debajo del formulario.
- **Ejemplo**:
  ```vue
  <template>
    <div class="register-page">
      <NavBar />
      <div class="register-form">
        <h2>Registro</h2>
        <form @submit.prevent="register">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="nombre" required>
          </div>
          <div class="form-group">
            <label for="correo">Correo Electrónico</label>
            <input type="email" id="correo" v-model="correo" required>
          </div>
          <div class="form-group">
            <label for="contraseña">Contraseña</label>
            <input type="password" id="contraseña" v-model="contraseña" required>
          </div>
          <div class="form-group">
            <label for="confirmar-contraseña">Confirmar Contraseña</label>
            <input type="password" id="confirmar-contraseña" v-model="confirmarContraseña" required>
          </div>
          <button type="submit" class="btn btn-primary">Registrarse</button>
        </form>
        <p>¿Ya tienes una cuenta? <router-link to="/login">Inicia Sesión</router-link></p>
      </div>
      <Footer />
    </div>
  </template>
  ```

### Pantalla de Dashboard (`DashboardPage.vue`)
- **Resumen de Pedidos**: Tarjetas que muestran información de pedidos recientes.
- **Notificaciones**: Sección en la parte inferior con mensajes importantes.
- **Ejemplo**:
  ```vue
  <template>
    <div class="dashboard-page">
      <NavBar />
      <div class="dashboard-content">
        <h2>Dashboard</h2>
        <div class="cesta-mensual">
          <h3>Cesta Mensual</h3>
          <p>Aquí puedes ver los productos que has pedido este mes.</p>
        </div>
        <div class="acceso-rapido">
          <router-link to="/compras" class="btn btn-primary">Adquirir Productos</router-link>
        </div>
        <div class="productos-disponibles">
          <h3>Productos Disponibles</h3>
        </div>
        <div class="notificaciones">
          <h3>Notificaciones</h3>
        </div>
      </div>
      <Footer />
    </div>
  </template>
  ```

### Pantalla de Productos (`ComprasPage.vue`)
- **Lista de Productos**: Disposición en cuadrícula, con tarjetas para cada producto.
- **Botón de Añadir**: Visible y destacado en cada tarjeta.
- **Ejemplo**:
  ```vue
  <template>
    <div class="compras-page">
      <NavBar />
      <div class="compras-content">
        <h2>Compras</h2>
        <div class="lista-productos">
          <div v-for="producto in productos" :key="producto.id" class="producto-card">
            <h3>{{ producto.nombre }}</h3>
            <p>{{ producto.descripcion }}</p>
            <p>Precio: {{ producto.precio }}€</p>
            <button @click="añadirACesta(producto)" class="btn btn-primary">Añadir a la cesta</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </template>
  ```

