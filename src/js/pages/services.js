import { html } from '../core/html.js';
import { icon } from '../core/icons.js';
import { photo } from '../components/photo.js';
import { iconTile, sampleNote } from '../components/ui.js';
import { SERVICE_PHOTOS } from '../data/photos.js';
import { activeServices } from '../state.js';
import { eur } from '../utils/format.js';

export const title = 'Servicios del taller';

const serviceCard = (s) => html`<article class="service-card">
  <div class="service-card__media media">
    ${photo(SERVICE_PHOTOS[s.id], { ratio: '16:9', sizes: '(min-width: 1020px) 33vw, (min-width: 600px) 50vw, 100vw', maxWidth: 800 })}
  </div>
  <div class="service-card__body">
    <div class="service-card__heading">
      ${iconTile(s.icon, 'sm')}
      <h2 class="service-card__title">${s.name}</h2>
    </div>
    <p class="service-card__text">${s.text}</p>
    <dl class="service-card__meta">
      <div class="service-card__meta-item service-card__meta-item--strong">
        <dt>${icon('tag', { label: 'Precio' })}</dt>
        <dd>Desde ${eur(s.price)}</dd>
      </div>
      <div class="service-card__meta-item">
        <dt>${icon('clock', { label: 'Duración' })}</dt>
        <dd>${s.duration} min</dd>
      </div>
    </dl>
    <button class="button button--primary service-card__button" type="button" data-action="booking:start" data-value="${s.id}">
      Reservar este servicio
    </button>
  </div>
</article>`;

export const render = ({ state }) => html`<div class="page container stack stack--xl">
  <header class="page-intro">
    <h1 class="heading-display">Servicios del taller</h1>
    <p class="page-intro__lead">
      Todo lo que necesita tu Renault, con equipo de diagnosis específico y presupuesto cerrado antes de empezar.
    </p>
  </header>
  <div class="card-grid card-grid--wide">${activeServices(state.data).map(serviceCard)}</div>
  ${sampleNote('Precios orientativos de ejemplo')}
</div>`;

export const actions = {};
