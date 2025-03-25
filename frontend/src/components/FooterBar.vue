<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Contacto</h3>
        <p>Email: contacto@grupoconsumo.com</p>
        <p>Teléfono: +34 123 456 789</p>
      </div>
      <div class="footer-section">
        <h3>Enlaces Rápidos</h3>
        <router-link to="/" class="footer-link">Inicio</router-link>
        <router-link to="/soporte" class="footer-link">Soporte</router-link>
        <router-link to="/configuracion" class="footer-link">Configuración</router-link>
      </div>
      <div class="footer-section">
        <h3>Redes Sociales</h3>
        <a href="https://facebook.com" class="footer-link" aria-label="Visítanos en Facebook">Facebook</a>
       <a href="https://twitter.com" class="footer-link" aria-label="Síguenos en Twitter">Twitter</a>
        <a href="https://instagram.com" class="footer-link" aria-label="Síguenos en Instagram">Instagram</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 Grupo de Consumo. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterPart'
};
</script>

<style scoped>
.footer {
  background-color: #333;
  color: white;
  padding: 2rem 1rem;
  margin-top: auto;
  font-family: 'Open Sans', sans-serif; 
}

.footer-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-section h3 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.footer-link {
  display: block;
  color: white;
  text-decoration: none;
  margin-bottom: 0.5rem;
}

.footer-link:hover {
  text-decoration: underline;
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #444;
}
</style>