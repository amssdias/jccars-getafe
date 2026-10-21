import { html } from '../core/html.js';
import { icon } from '../core/icons.js';
import { selectField } from '../components/field.js';
import { segmented } from '../components/ui.js';
import { vehicleCard } from '../components/vehicle-card.js';
import { FUELS, whatsappLink } from '../data/content.js';
import { defaultFilters, visibleVehicles } from '../state.js';
import { eur, plural } from '../utils/format.js';

export const title = 'Vehículos Renault nuevos y de ocasión';

const SORTERS = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  year: (a, b) => b.year - a.year,
  km: (a, b) => a.km - b.km,
};

const COND_TABS = [
  ['Todos', 'Todos'],
  ['Nuevo', 'Nuevos'],
  ['Ocasión', 'Ocasión'],
];

const applyFilters = (vehicles, f) => {
  const maxPrice = Number(f.price);
  return vehicles
    .filter(
      (v) =>
        (f.cond === 'Todos' || v.cond === f.cond) &&
        (!f.model || v.model === f.model) &&
        (!f.fuel || v.fuel === f.fuel) &&
        (!maxPrice || v.price <= maxPrice),
    )
    .sort(SORTERS[f.sort]);
};

const isFiltered = (f) => Boolean(f.model || f.fuel || Number(f.price) || f.cond !== 'Todos');

const searchMessage = (f) => {
  const maxPrice = Number(f.price);
  return `Hola, busco un Renault${f.model ? ` ${f.model}` : ''}${f.fuel ? ` ${f.fuel.toLowerCase()}` : ''}${
    maxPrice ? ` de hasta ${eur(maxPrice)}` : ''
  }. ¿Me avisáis si entra alguno?`;
};

const filtersPanel = (f, models) => html`<div class="filters" role="search" aria-label="Filtrar vehículos">
  ${selectField({ id: 'vf-model', label: 'Modelo', model: 'filters.model', value: f.model, options: models, placeholder: 'Todos', variant: 'soft', live: true })}
  ${selectField({ id: 'vf-fuel', label: 'Combustible', model: 'filters.fuel', value: f.fuel, options: FUELS, placeholder: 'Todos', variant: 'soft', live: true })}
  ${selectField({
    id: 'vf-price',
    label: 'Precio máximo',
    model: 'filters.price',
    value: f.price,
    variant: 'soft',
    live: true,
    options: [
      { value: '0', label: 'Cualquiera' },
      ...[15000, 20000, 25000, 30000].map((p) => ({ value: String(p), label: eur(p) })),
    ],
  })}
  ${selectField({
    id: 'vf-sort',
    label: 'Ordenar',
    model: 'filters.sort',
    value: f.sort,
    variant: 'soft',
    live: true,
    options: [
      { value: 'price-asc', label: 'Precio más bajo' },
      { value: 'price-desc', label: 'Precio más alto' },
      { value: 'year', label: 'Más recientes' },
      { value: 'km', label: 'Menos kilómetros' },
    ],
  })}
</div>`;

const emptyState = (f) => html`<div class="empty-state">
  <h2 class="empty-state__title">No hay vehículos con estos filtros</h2>
  <p class="empty-state__text">Dinos qué Renault buscas y te avisamos en cuanto entre uno que encaje.</p>
  <div class="button-group">
    <a class="button button--primary" href="${whatsappLink(searchMessage(f))}" target="_blank" rel="noopener">${icon('message-circle')}WhatsApp</a>
    <button class="button button--secondary" type="button" data-action="vehicles:reset">Quitar filtros</button>
  </div>
</div>`;

export function render({ state }) {
  const f = state.filters;
  const visible = visibleVehicles(state.data);
  const cars = applyFilters(visible, f);
  const models = [...new Set(visible.map((v) => v.model))].sort();

  return html`<div class="page container stack stack--lg">
    <header class="page-intro">
      <h1 class="heading-display">Vehículos Renault</h1>
      <p class="page-intro__lead">
        Renault nuevos y de ocasión. Los de ocasión pasan por nuestro taller y se entregan con 12 meses de garantía.
      </p>
    </header>
    ${segmented({
      label: 'Tipo de vehículo',
      variant: 'large',
      items: COND_TABS.map(([value, label]) => ({
        value,
        label: `${label} (${visible.filter((v) => value === 'Todos' || v.cond === value).length})`,
        active: f.cond === value,
        action: 'vehicles:cond',
      })),
    })}
    ${filtersPanel(f, models)}
    <div class="results-bar">
      <p class="results-bar__count" aria-live="polite">${plural(cars.length, 'vehículo', 'vehículos')}</p>
      ${isFiltered(f) ? html`<button class="text-button" type="button" data-action="vehicles:reset">Quitar filtros</button>` : ''}
    </div>
    ${cars.length
      ? html`<ul class="card-grid" role="list">${cars.map((v) => html`<li class="card-grid__item">${vehicleCard(v)}</li>`)}</ul>`
      : emptyState(f)}
  </div>`;
}

export const actions = {
  'vehicles:cond': (ctx, el) => ctx.setState({ filters: { ...ctx.state.filters, cond: el.dataset.value } }),
  'vehicles:reset': (ctx) => ctx.setState({ filters: defaultFilters(ctx.state.filters.sort) }),
};
