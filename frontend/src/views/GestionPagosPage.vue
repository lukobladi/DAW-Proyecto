<template>
  <div class="gestion-pagos-page">
    <div class="gestion-pagos-content container">
      <h2>Gestion de Pagos</h2>
      <p class="texto-ayuda">
        El deudor puede marcar un pago como enviado, pero la deuda solo se cierra cuando el acreedor
        confirma que ha recibido el dinero.
      </p>

      <div class="filtros">
        <label for="periodo" class="form-label">Periodo</label>
        <input id="periodo" v-model="periodo" type="month" class="form-control" />
        <button class="btn btn-outline-secondary" @click="cargarPagos">Actualizar</button>
      </div>

      <div v-if="cargando" class="estado">Cargando pagos...</div>
      <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>

      <div v-else-if="!deudasPendientes.length" class="estado">No hay pagos pendientes.</div>

      <div v-else class="lista-pagos">
        <article v-for="pago in deudasPendientes" :key="pago.id_pago" class="pago-card">
          <h3>Pago #{{ pago.id_pago }}</h3>
          <p v-if="esDeudor(pago)">
            Debes <strong>{{ formatMoney(pago.monto) }}</strong> a
            <strong>{{ pago.nombre_creditor }}</strong>
          </p>
          <p v-else>
            <strong>{{ pago.nombre_deudor }}</strong> te debe
            <strong>{{ formatMoney(pago.monto) }}</strong>
          </p>
          <p class="texto-secundario" v-if="pago.periodo">
            Periodo: {{ formatPeriodoDeuda(pago.periodo) }}
          </p>
          <p class="texto-secundario" v-if="pago.deudor_reporta_pagado && !esDeudor(pago)">
            El deudor ha indicado que ya pagó.
          </p>

          <button
            v-if="esDeudor(pago)"
            class="btn btn-outline-primary"
            :disabled="Boolean(pago.deudor_reporta_pagado) || pagoActualizandoId === pago.id_pago"
            @click="marcarPagado(pago)"
          >
            {{ pago.deudor_reporta_pagado ? 'Pendiente de confirmacion' : 'Marcar como pagado' }}
          </button>

          <button
            v-else
            class="btn btn-success"
            :disabled="pagoActualizandoId === pago.id_pago"
            @click="marcarRecibido(pago)"
          >
            Marcar como recibido
          </button>
        </article>
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
      cargando: false,
      errorCarga: '',
      pagoActualizandoId: null,
      periodo: new Date().toISOString().slice(0, 7),
      deudasPendientes: [],
    };
  },
  async created() {
    await this.cargarPagos();
  },
  methods: {
    formatMoney(value) {
      return `${Number(value || 0).toFixed(2)} EUR`;
    },
    formatPeriodoDeuda(periodo) {
      const raw = String(periodo || '');
      const periodoMes = raw.length >= 7 ? raw.slice(0, 7) : raw;
      const [year, month] = periodoMes.split('-');

      if (!year || !month) {
        return periodoMes || 'Sin periodo';
      }

      return `${month}/${year}`;
    },
    getUsuarioId() {
      const authStore = useAuthStore();
      return Number(authStore.user?.id_usuario);
    },
    esDeudor(pago) {
      return Number(pago.id_usuario_deudor) === this.getUsuarioId();
    },
    manejarSesionCaducada() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('authUser');
      alertStore.showAlert('Tu sesion ha caducado. Inicia sesion de nuevo.', 'danger');
      this.$router.push({ name: 'Login' });
    },
    async cargarPagos() {
      this.cargando = true;
      this.errorCarga = '';

      try {
        const response = await api.getResumenPagosMensual(this.periodo || undefined);
        this.deudasPendientes = response.data?.deudas_pendientes || [];
      } catch (error) {
        if (error.response?.status === 401) {
          this.manejarSesionCaducada();
          return;
        }

        this.errorCarga = 'No se pudieron cargar los pagos pendientes.';
      } finally {
        this.cargando = false;
      }
    },
    async marcarPagado(pago) {
      this.pagoActualizandoId = pago.id_pago;

      try {
        await api.marcarPagoEnviado(pago.id_pago);
        alertStore.showAlert('Has marcado el pago como enviado.', 'success');
        await this.cargarPagos();
      } catch (error) {
        if (error.response?.status === 401) {
          this.manejarSesionCaducada();
          return;
        }

        alertStore.showAlert('No se pudo marcar el pago como enviado.', 'danger');
      } finally {
        this.pagoActualizandoId = null;
      }
    },
    async marcarRecibido(pago) {
      this.pagoActualizandoId = pago.id_pago;

      try {
        await api.marcarPagoRecibido(pago.id_pago);
        alertStore.showAlert('Pago confirmado como recibido.', 'success');
        await this.cargarPagos();
      } catch (error) {
        if (error.response?.status === 401) {
          this.manejarSesionCaducada();
          return;
        }

        alertStore.showAlert('No se pudo confirmar el pago como recibido.', 'danger');
      } finally {
        this.pagoActualizandoId = null;
      }
    },
  },
};
</script>

<style scoped>
.gestion-pagos-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.gestion-pagos-content {
  flex: 1;
  padding: var(--spacing-xl);
}

.texto-ayuda {
  color: var(--color-text-light);
  margin-bottom: var(--spacing-md);
}

.filtros {
  display: flex;
  align-items: end;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.filtros .form-control {
  width: 190px;
}

.lista-pagos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.pago-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  background: var(--color-bg);
}

.pago-card p {
  margin-bottom: var(--spacing-xs);
}

.texto-secundario {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}

@media (max-width: 576px) {
  .filtros {
    flex-direction: column;
    align-items: stretch;
  }

  .filtros .form-control {
    width: 100%;
  }
}
</style>
