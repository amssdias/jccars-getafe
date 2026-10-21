import { attrs, cx, html } from '../core/html.js';
import { icon } from '../core/icons.js';
import { clearData } from '../core/storage.js';
import { selectField, textField } from '../components/field.js';
import { STATUS_VARIANTS } from '../components/ui.js';
import { specLine, vehicleName } from '../components/vehicle-card.js';
import { FUELS, MODELS } from '../data/content.js';
import { createSeed } from '../data/seed.js';
import { emptyNewVehicle, serviceById } from '../state.js';
import { eur, onlyDigits, parseIso, shortDate } from '../utils/format.js';

export const title = 'Panel de administración';

const TABS = [
  ['citas', 'Citas'],
  ['vehiculos', 'Vehículos'],
  ['servicios', 'Servicios'],
  ['solicitudes', 'Solicitudes'],
];

const BOOKING_STATUSES = ['Pendiente', 'Confirmada', 'Completada', 'Cancelada'];
const VEHICLE_CYCLE = { Disponible: 'Reservado', Reservado: 'Vendido', Vendido: 'Disponible' };

const statusClass = (status) => cx('status-chip', `status-chip--${STATUS_VARIANTS[status]}`);

const kpis = (data, now) => {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const items = [
    { icon: 'calendar-clock', label: 'Citas pendientes', tab: 'citas', value: data.bookings.filter((b) => b.status === 'Pendiente').length },
    {
      icon: 'calendar-days',
      label: 'Citas en 7 días',
      tab: 'citas',
      value: data.bookings.filter((b) => {
        const d = parseIso(b.date);
        return d >= today && d <= weekEnd && b.status !== 'Cancelada';
      }).length,
    },
    { icon: 'car', label: 'Vehículos disponibles', tab: 'vehiculos', value: data.vehicles.filter((v) => v.status === 'Disponible').length },
    { icon: 'inbox', label: 'Solicitudes nuevas', tab: 'solicitudes', value: data.leads.filter((l) => l.status === 'Nueva').length },
  ];
  return html`<div class="kpi-grid">
    ${items.map(
      (k) => html`<button class="kpi" type="button" data-action="admin:tab" data-value="${k.tab}">
        <span class="kpi__label">${icon(k.icon, { className: 'kpi__icon' })}${k.label}</span>
        <span class="kpi__value">${k.value}</span>
      </button>`,
    )}
  </div>`;
};

const tabs = (active) => html`<div class="tabs" role="tablist" aria-label="Secciones del panel">
  ${TABS.map(
    ([id, label]) => html`<button
      ${attrs({
        type: 'button',
        role: 'tab',
        id: `tab-${id}`,
        class: cx('tabs__item', active === id && 'tabs__item--active'),
        'aria-selected': active === id ? 'true' : 'false',
        'aria-controls': `panel-${id}`,
        'data-action': 'admin:tab',
        'data-value': id,
      })}
    >
      ${label}
    </button>`,
  )}
</div>`;

const emptyRow = (text) => html`<p class="admin-list__empty">${text}</p>`;

const bookingsPanel = (data) => {
  const sorted = [...data.bookings].sort((a, b) =>
    `${a.date}${a.time.padStart(5, '0')}`.localeCompare(`${b.date}${b.time.padStart(5, '0')}`),
  );
  if (!sorted.length) return html`<div class="admin-list">${emptyRow('No hay citas. Las nuevas reservas de la web aparecerán aquí.')}</div>`;
  return html`<ul class="admin-list" role="list">
    ${sorted.map(
      (b) => html`<li class="admin-row">
        <div class="admin-row__cell admin-row__cell--sm">
          <span class="admin-row__meta mono">${b.id}</span>
          <span class="admin-row__strong">${shortDate(b.date)}, ${b.time}</span>
        </div>
        <div class="admin-row__cell">
          <span class="admin-row__strong">${b.name}</span>
          <span class="admin-row__meta">${b.phone}</span>
        </div>
        <div class="admin-row__cell admin-row__cell--lg">
          <span class="admin-row__medium">${serviceById(data, b.serviceId)?.name ?? 'Servicio'}</span>
          <span class="admin-row__meta">Renault ${b.model}, ${b.plate}</span>
        </div>
        <select
          class="${cx(statusClass(b.status), 'status-chip--select')}"
          aria-label="Estado de la cita ${b.id}"
          data-change="admin:booking-status"
          data-id="${b.id}"
        >
          ${BOOKING_STATUSES.map((s) => html`<option ${attrs({ value: s, selected: s === b.status })}>${s}</option>`)}
        </select>
      </li>`,
    )}
  </ul>`;
};

const newVehicleForm = (nc) => {
  const e = nc.errors;
  return html`<form class="panel stack stack--sm" data-submit="admin:add-vehicle" novalidate>
    <h2 class="panel__title panel__title--sm">Añadir vehículo</h2>
    <div class="admin-form">
      ${selectField({ id: 'nc-model', label: 'Modelo', model: 'nc.model', value: nc.model, options: MODELS.filter((m) => m !== 'Otro'), variant: 'compact' })}
      ${textField({ id: 'nc-version', label: 'Versión', model: 'nc.version', value: nc.version, placeholder: 'TCe 90 Evolution', variant: 'compact', error: e.version })}
      ${selectField({ id: 'nc-cond', label: 'Tipo', model: 'nc.cond', value: nc.cond, options: ['Nuevo', 'Ocasión'], variant: 'compact' })}
      ${selectField({ id: 'nc-fuel', label: 'Combustible', model: 'nc.fuel', value: nc.fuel, options: FUELS, variant: 'compact' })}
      ${textField({ id: 'nc-year', label: 'Año', model: 'nc.year', value: nc.year, inputmode: 'numeric', variant: 'compact', error: e.year })}
      ${textField({ id: 'nc-km', label: 'Km', model: 'nc.km', value: nc.km, inputmode: 'numeric', variant: 'compact' })}
      ${textField({ id: 'nc-price', label: 'Precio (€)', model: 'nc.price', value: nc.price, inputmode: 'numeric', variant: 'compact', error: e.price })}
      <button class="button button--primary button--compact admin-form__submit" type="submit">${icon('plus')}Añadir</button>
    </div>
    ${e.version || e.year || e.price
      ? html`<p class="field__error" role="alert">Completa versión, año y precio con valores válidos.</p>`
      : ''}
  </form>`;
};

const vehiclesPanel = (data, nc) => html`${newVehicleForm(nc)}
  <ul class="admin-list" role="list">
    ${data.vehicles.map(
      (v) => html`<li class="admin-row">
        <div class="admin-row__cell admin-row__cell--xl">
          <span class="admin-row__strong">${vehicleName(v)} <span class="admin-row__soft">${v.version}</span></span>
          <span class="admin-row__meta">${v.cond}, ${specLine(v)}</span>
        </div>
        <span class="admin-row__price">${eur(v.price)}</span>
        <button
          class="${statusClass(v.status)}"
          type="button"
          data-action="admin:vehicle-status"
          data-id="${v.id}"
          aria-label="Estado: ${v.status}. Cambiar a ${VEHICLE_CYCLE[v.status]}"
        >
          ${v.status}
        </button>
        <a class="admin-row__link" href="#/vehiculo/${v.id}">Ver ficha</a>
        <button class="icon-button icon-button--danger" type="button" data-action="admin:vehicle-delete" data-id="${v.id}" aria-label="Eliminar ${vehicleName(v)} ${v.version}">
          ${icon('trash')}
        </button>
      </li>`,
    )}
  </ul>`;

const servicesPanel = (data) => html`<ul class="admin-list" role="list">
  ${data.services.map(
    (s) => html`<li class="${cx('admin-row', !s.active && 'admin-row--inactive')}">
      <span class="admin-row__cell admin-row__cell--xl admin-row__title">${icon(s.icon, { className: 'admin-row__icon' })}${s.name}</span>
      <label class="inline-input">
        Desde
        <input class="inline-input__control" value="${s.price}" inputmode="numeric" aria-label="Precio desde, ${s.name}" data-change="admin:service-field" data-id="${s.id}" data-field="price" />
        €
      </label>
      <label class="inline-input">
        Duración
        <input class="inline-input__control inline-input__control--sm" value="${s.duration}" inputmode="numeric" aria-label="Duración en minutos, ${s.name}" data-change="admin:service-field" data-id="${s.id}" data-field="duration" />
        min
      </label>
      <button class="${cx('status-chip', s.active ? 'status-chip--success' : 'status-chip--muted')}" type="button" data-action="admin:service-toggle" data-id="${s.id}" aria-pressed="${s.active ? 'true' : 'false'}">
        ${s.active ? 'Visible en la web' : 'Oculto'}
      </button>
    </li>`,
  )}
</ul>`;

const leadsPanel = (data) => {
  if (!data.leads.length) return html`<div class="admin-list">${emptyRow('No hay solicitudes todavía.')}</div>`;
  return html`<ul class="admin-list" role="list">
    ${[...data.leads].reverse().map(
      (l) => html`<li class="admin-row admin-row--top">
        <span class="badge badge--brand">${l.type}</span>
        <div class="admin-row__cell">
          <span class="admin-row__strong">${l.name}</span>
          <span class="admin-row__meta">${l.contact}</span>
        </div>
        <div class="admin-row__cell admin-row__cell--xl">
          <span class="admin-row__medium">${l.subject}</span>
          <span class="admin-row__meta">${l.message || 'Sin mensaje'}</span>
        </div>
        <span class="admin-row__meta">${l.created}</span>
        <button class="${statusClass(l.status)}" type="button" data-action="admin:lead-toggle" data-id="${l.id}">${l.status}</button>
      </li>`,
    )}
  </ul>`;
};

export function render({ state }) {
  const { data, adminTab, nc, now } = state;
  const panels = {
    citas: () => bookingsPanel(data),
    vehiculos: () => vehiclesPanel(data, nc),
    servicios: () => servicesPanel(data),
    solicitudes: () => leadsPanel(data),
  };
  return html`<div class="admin">
    <div class="page container stack stack--lg">
      <div class="admin__header">
        <div class="stack stack--xs">
          <h1 class="admin__title">Panel de administración</h1>
          <p class="admin__subtitle">Demo: los cambios se guardan en este navegador.</p>
        </div>
        <button class="button button--secondary button--compact" type="button" data-action="admin:reset">
          ${icon('rotate-ccw')}Restablecer datos de ejemplo
        </button>
      </div>
      ${kpis(data, now)} ${tabs(adminTab)}
      <div class="stack stack--md" role="tabpanel" id="panel-${adminTab}" aria-labelledby="tab-${adminTab}">${panels[adminTab]()}</div>
    </div>
  </div>`;
}

const updateItem = (list, id, patch) => list.map((item) => (item.id === id ? { ...item, ...patch(item) } : item));

const fuelLabel = (fuel) => {
  if (fuel === 'Eléctrico') return '0';
  if (fuel === 'Híbrido' || fuel === 'GLP') return 'ECO';
  return 'C';
};

export const actions = {
  'admin:tab': (ctx, el) => ctx.setState({ adminTab: el.dataset.value }),

  'admin:reset': (ctx) => {
    clearData();
    ctx.setState({ data: createSeed() });
  },

  'admin:booking-status': (ctx, el) =>
    ctx.setData((d) => ({ ...d, bookings: updateItem(d.bookings, el.dataset.id, () => ({ status: el.value })) })),

  'admin:vehicle-status': (ctx, el) =>
    ctx.setData((d) => ({ ...d, vehicles: updateItem(d.vehicles, el.dataset.id, (v) => ({ status: VEHICLE_CYCLE[v.status] })) })),

  'admin:vehicle-delete': (ctx, el) => ctx.setData((d) => ({ ...d, vehicles: d.vehicles.filter((v) => v.id !== el.dataset.id) })),

  'admin:service-toggle': (ctx, el) =>
    ctx.setData((d) => ({ ...d, services: updateItem(d.services, el.dataset.id, (s) => ({ active: !s.active })) })),

  'admin:service-field': (ctx, el) =>
    ctx.setData((d) => ({
      ...d,
      services: updateItem(d.services, el.dataset.id, () => ({ [el.dataset.field]: Number(onlyDigits(el.value)) || 0 })),
    })),

  'admin:lead-toggle': (ctx, el) =>
    ctx.setData((d) => ({
      ...d,
      leads: updateItem(d.leads, el.dataset.id, (l) => ({ status: l.status === 'Nueva' ? 'Atendida' : 'Nueva' })),
    })),

  'admin:add-vehicle': (ctx) => {
    const nc = ctx.state.nc;
    const year = Number(nc.year);
    const price = Number(onlyDigits(nc.price));
    const errors = { version: !nc.version.trim(), year: !(year >= 2000 && year <= 2027), price: !(price > 500) };
    if (errors.version || errors.year || errors.price) {
      ctx.setState({ nc: { ...nc, errors } });
      return;
    }
    const vehicle = {
      id: `x${Date.now()}`,
      cond: nc.cond,
      model: nc.model,
      version: nc.version.trim(),
      year,
      km: nc.cond === 'Nuevo' ? 0 : Number(onlyDigits(nc.km)) || 0,
      fuel: nc.fuel,
      gear: nc.fuel === 'Híbrido' || nc.fuel === 'Eléctrico' ? 'Automático' : 'Manual',
      hp: 100,
      price,
      label: fuelLabel(nc.fuel),
      color: '',
      status: 'Disponible',
      features: [],
    };
    ctx.setData((d) => ({ ...d, vehicles: [vehicle, ...d.vehicles] }));
    ctx.setState({ nc: emptyNewVehicle() });
  },
};
