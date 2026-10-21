import { html } from '../core/html.js';
import { icon } from '../core/icons.js';
import { createModal } from '../components/lead-modal.js';
import { photo } from '../components/photo.js';
import { sampleNote } from '../components/ui.js';
import { isNew, vehicleBadges, vehicleName } from '../components/vehicle-card.js';
import { whatsappLink } from '../data/content.js';
import { vehiclePhotos } from '../data/photos.js';
import { eur, km } from '../utils/format.js';

const findVehicle = (state) => state.data.vehicles.find((v) => v.id === state.route.id);

export const title = (state) => {
  const v = findVehicle(state);
  return v ? `${vehicleName(v)} ${v.version}` : 'Vehículo no encontrado';
};

const GALLERY_LABELS = ['Foto principal', 'Detalle 1', 'Detalle 2', 'Detalle 3'];

const specs = (v) => [
  ['Año', String(v.year)],
  ['Kilómetros', v.km ? km(v.km) : '0 km'],
  ['Combustible', v.fuel],
  ['Cambio', v.gear],
  ['Potencia', `${v.hp} cv`],
  ['Color', v.color || 'Consultar'],
  ['Etiqueta DGT', v.label],
  ['Garantía', isNew(v) ? '5 años de fábrica' : '12 meses'],
];

const notFound = () => html`<div class="page container stack stack--lg">
  <a class="back-link" href="#/vehiculos">${icon('arrow-left')}Todos los vehículos</a>
  <div class="empty-state">
    <h1 class="empty-state__title">Este vehículo ya no está disponible</h1>
    <p class="empty-state__text">Puede que se haya vendido. Echa un vistazo al resto del stock.</p>
    <a class="button button--primary" href="#/vehiculos">Ver vehículos</a>
  </div>
</div>`;

export function render({ state }) {
  const v = findVehicle(state);
  if (!v) return notFound();

  const [main, ...gallery] = vehiclePhotos(v.id);
  const features = v.features?.length ? v.features : ['Consulta el equipamiento con nuestro equipo'];
  const waText = `Hola, me interesa el ${vehicleName(v)} ${v.version} (${eur(v.price)}). ¿Sigue disponible?`;

  return html`<div class="page page--compact container stack stack--xl">
    <a class="back-link" href="#/vehiculos">${icon('arrow-left')}Todos los vehículos</a>
    <div class="vehicle-detail">
      <div class="gallery" role="group" aria-label="Fotos del vehículo">
        <div class="gallery__main media">${photo(main, { ratio: '16:10', sizes: '(min-width: 1020px) 60vw, 100vw', eager: true })}</div>
        ${gallery.map(
          (key, i) => html`<div class="gallery__thumb media" title="${GALLERY_LABELS[i + 1]}">
            ${photo(key, { ratio: '4:3', sizes: '(min-width: 1020px) 20vw, 33vw', maxWidth: 800 })}
          </div>`,
        )}
      </div>

      <div class="vehicle-detail__info">
        ${vehicleBadges(v)}
        <div class="vehicle-detail__heading">
          <h1 class="heading-display heading-display--sm">${vehicleName(v)}</h1>
          <p class="vehicle-detail__version">${v.version}</p>
        </div>
        <div class="vehicle-detail__price-row">
          <span class="vehicle-detail__price">${eur(v.price)}</span>
          ${sampleNote('Precio de ejemplo')}
        </div>
        ${!isNew(v)
          ? html`<p class="vehicle-detail__warranty">${icon('shield-check')}Revisado en JC Cars, con 12 meses de garantía</p>`
          : ''}
        <dl class="spec-grid">
          ${specs(v).map(([k, val]) => html`<div class="spec-grid__item"><dt>${k}</dt><dd>${val}</dd></div>`)}
        </dl>
        <div class="button-group">
          <button class="button button--primary" type="button" data-action="vehicle:lead" data-value="test">
            ${icon('car-front')}Reservar prueba
          </button>
          <button class="button button--secondary" type="button" data-action="vehicle:lead" data-value="quote">Pedir presupuesto</button>
        </div>
        <div class="link-group">
          <button class="text-button" type="button" data-action="vehicle:lead" data-value="info">${icon('mail')}Solicitar información</button>
          <a class="text-link" href="${whatsappLink(waText)}" target="_blank" rel="noopener">${icon('message-circle')}WhatsApp</a>
        </div>
      </div>
    </div>

    <section class="stack stack--md" aria-labelledby="equipment-title">
      <h2 class="heading-sub" id="equipment-title">Equipamiento destacado</h2>
      <ul class="check-list" role="list">
        ${features.map((f) => html`<li class="check-list__item">${icon('check')}${f}</li>`)}
      </ul>
    </section>
  </div>`;
}

export const actions = {
  'vehicle:lead': (ctx, el) => {
    const v = findVehicle(ctx.state);
    if (!v) return;
    ctx.setState({ modal: createModal(el.dataset.value, `${vehicleName(v)} ${v.version}`) });
  },
};
