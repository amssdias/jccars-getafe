import { cx, html } from '../core/html.js';
import { icon } from '../core/icons.js';
import { photo } from '../components/photo.js';
import { contactList, hoursList, iconTile, mapEmbed, ratingSummary, sampleNote, sectionHead, segmented, stars } from '../components/ui.js';
import { vehicleCard } from '../components/vehicle-card.js';
import { ADVANTAGES, whatsappLink } from '../data/content.js';
import { SERVICE_PHOTOS } from '../data/photos.js';
import { activeServices, visibleVehicles } from '../state.js';
import { eur } from '../utils/format.js';
import { openStatus } from '../utils/schedule.js';

export const title = 'Taller especialista Renault y venta de vehículos';

// Orden visual del bento: la primera tarjeta es la destacada con foto.
const BENTO_VARIANTS = ['featured', 'brand', 'outline', 'muted', 'photo'];

const hero = (now) => {
  const status = openStatus(now);
  return html`<section class="hero">
    <div class="hero__inner">
      <div class="hero__content">
        <span class="status-pill">
          <span class="${cx('status-pill__dot', status.isOpen && 'status-pill__dot--open')}"></span>${status.text}
        </span>
        <h1 class="hero__title">Tu Renault, en manos de especialistas.</h1>
        <p class="hero__lead">
          Mantenimiento, reparación y venta de Renault nuevos y de ocasión en Getafe. Presupuesto cerrado antes de empezar.
        </p>
        <div class="button-group">
          <a class="button button--primary button--large" href="#/reservar">${icon('calendar-check')}Reservar cita</a>
          <a class="button button--secondary button--large" href="#/vehiculos">Ver vehículos</a>
        </div>
      </div>
      <div class="hero__visual">
        <div class="hero__accent" aria-hidden="true"></div>
        <div class="hero__media media">${photo('hero', { ratio: '4:3', sizes: '(min-width: 1020px) 600px, 100vw', eager: true })}</div>
      </div>
    </div>
  </section>`;
};

const advantages = () => html`<section class="section section--tight-bottom">
  <div class="container">
    <ul class="features" role="list">
      ${ADVANTAGES.map(
        (a) => html`<li class="feature">
          ${iconTile(a.icon)}
          <div class="feature__body">
            <h2 class="feature__title">${a.title}</h2>
            <p class="feature__text">${a.text}</p>
          </div>
        </li>`,
      )}
    </ul>
  </div>
</section>`;

const bentoItem = (service, variant) => html`<article class="${cx('bento__item', `bento__item--${variant}`)}">
  ${variant === 'featured' || variant === 'photo'
    ? html`<div class="bento__media media">
        ${photo(SERVICE_PHOTOS[service.id], { ratio: variant === 'featured' ? '16:9' : '16:10', sizes: '(min-width: 1020px) 50vw, 100vw', maxWidth: 1200 })}
      </div>`
    : ''}
  <div class="bento__body">
    ${icon(service.icon, { className: 'bento__icon' })}
    <h3 class="bento__title">${service.name}</h3>
    <p class="bento__text">${service.text}</p>
    <div class="bento__footer">
      <span class="bento__price">Desde ${eur(service.price)}</span>
      <button class="bento__link" type="button" data-action="booking:start" data-value="${service.id}">
        Reservar${icon('arrow-right')}
      </button>
    </div>
  </div>
</article>`;

const services = (data) => html`<section class="section section--tight-bottom">
  <div class="container stack stack--lg">
    ${sectionHead(
      'Servicios para tu Renault',
      html`<a class="button button--secondary" href="#/servicios">Todos los servicios${icon('arrow-right')}</a>`,
      { narrow: true },
    )}
    <div class="bento">${activeServices(data).slice(0, 5).map((s, i) => bentoItem(s, BENTO_VARIANTS[i]))}</div>
  </div>
</section>`;

const vehicles = (data, cond) => {
  const cars = visibleVehicles(data).filter((v) => v.cond === cond);
  return html`<section class="section section--tight-bottom">
    <div class="container stack stack--lg">
      ${sectionHead(
        'Renault nuevos y de ocasión',
        html`${segmented({
          label: 'Tipo de vehículo',
          items: [
            { label: 'Nuevos', value: 'Nuevo', active: cond === 'Nuevo', action: 'home:cond' },
            { label: 'Ocasión', value: 'Ocasión', active: cond === 'Ocasión', action: 'home:cond' },
          ],
        })}
        <a class="button button--secondary" href="#/vehiculos">Ver todos${icon('arrow-right')}</a>`,
        { narrow: true },
      )}
      <ul class="rail" role="list">
        ${cars.map((v) => html`<li class="rail__item">${vehicleCard(v, { sizes: '330px' })}</li>`)}
      </ul>
    </div>
  </section>`;
};

const cta = () => html`<section class="section section--tight-bottom">
  <div class="container">
    <div class="cta-banner">
      <div class="cta-banner__accent" aria-hidden="true"></div>
      <div class="cta-banner__content">
        <h2 class="cta-banner__title">Reserva tu cita en menos de un minuto.</h2>
        <ul class="cta-banner__steps" role="list">
          <li class="cta-banner__step">${icon('list-checks')}Elige el servicio</li>
          <li class="cta-banner__step">${icon('calendar-days')}Día y hora libres</li>
          <li class="cta-banner__step">${icon('circle-check')}Confirmación al momento</li>
        </ul>
      </div>
      <a class="button button--primary button--xl cta-banner__button" href="#/reservar">Reservar cita</a>
    </div>
  </div>
</section>`;

const reviewsTeaser = (data) => {
  const latest = data.reviews.slice(-2).reverse();
  return html`<section class="section section--tight-bottom">
    <div class="container reviews-teaser">
      <div class="reviews-teaser__intro">
        <h2 class="heading-section">Lo que dicen nuestros clientes</h2>
        ${ratingSummary(data.reviews)}
        ${sampleNote('Opiniones de ejemplo')}
        <a class="text-link" href="#/opiniones">Ver todas las opiniones${icon('arrow-right')}</a>
      </div>
      <div class="reviews-teaser__list">
        ${latest.map(
          (r) => html`<figure class="quote-card">
            ${stars(r.rating)}
            <blockquote class="quote-card__text">“${r.text}”</blockquote>
            <figcaption class="quote-card__author">${r.name}, ${r.service}</figcaption>
          </figure>`,
        )}
      </div>
    </div>
  </section>`;
};

const location = (now) => html`<section class="section">
  <div class="container">
    <div class="location">
      <div class="location__info">
        <h2 class="location__title">Ubicación y horarios</h2>
        ${contactList()}
        ${hoursList(now)}
        <div class="button-group location__actions">
          <a class="button button--primary" href="#/reservar">Reservar cita</a>
          <a class="button button--secondary" href="${whatsappLink('Hola, quería hacer una consulta.')}" target="_blank" rel="noopener">
            ${icon('message-circle')}WhatsApp
          </a>
        </div>
      </div>
      <div class="location__map">${mapEmbed()}</div>
    </div>
  </div>
</section>`;

export function render({ state }) {
  return html`<div class="page page--flush">
    ${hero(state.now)} ${advantages()} ${services(state.data)} ${vehicles(state.data, state.homeCond)} ${cta()}
    ${reviewsTeaser(state.data)} ${location(state.now)}
  </div>`;
}

export const actions = {
  'home:cond': (ctx, el) => ctx.setState({ homeCond: el.dataset.value }),
};
