import { attrs, cx, html } from '../core/html.js';
import { icon } from '../core/icons.js';
import { CONTACT } from '../data/content.js';
import { openingHours } from '../utils/schedule.js';

export const STATUS_VARIANTS = {
  Pendiente: 'brand',
  Confirmada: 'success',
  Completada: 'muted',
  Cancelada: 'danger',
  Disponible: 'success',
  Reservado: 'brand',
  Vendido: 'muted',
  Nueva: 'solid',
  Atendida: 'muted',
};

export const badge = (text, variant = 'neutral', className) =>
  html`<span class="${cx('badge', `badge--${variant}`, className)}">${text}</span>`;

// Etiqueta pequeña que marca el contenido de ejemplo de la demo.
export const sampleNote = (text) => badge(text, 'note');

export const stars = (rating) =>
  html`<span class="stars" role="img" aria-label="${rating} de 5 estrellas">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</span>`;

export function ratingSummary(reviews, { boxed = false } = {}) {
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(1, reviews.length);
  return html`<div class="${cx('rating', boxed && 'rating--boxed')}">
    <span class="rating__score">${average.toFixed(1).replace('.', ',')}</span>
    <span class="rating__meta">
      <span class="rating__stars" aria-hidden="true">★★★★★</span>
      <span class="rating__count">${reviews.length} opiniones</span>
    </span>
  </div>`;
}

export const hoursList = (now) => html`<dl class="hours">
  ${openingHours(now).map(
    (row) => html`<div class="${cx('hours__row', row.today && 'hours__row--today')}">
      <dt>${row.day}</dt>
      <dd>${row.time}</dd>
    </div>`,
  )}
</dl>`;

export const contactList = ({ withEmail = false } = {}) => html`<ul class="contact-list" role="list">
  <li class="contact-list__item">${icon('map-pin', { className: 'contact-list__icon' })}${CONTACT.address}</li>
  <li class="contact-list__item">
    <a class="contact-list__link contact-list__link--strong" href="${CONTACT.phoneHref}">${icon('phone', { className: 'contact-list__icon' })}${CONTACT.phone}</a>
  </li>
  ${withEmail
    ? html`<li class="contact-list__item">
        <a class="contact-list__link" href="mailto:${CONTACT.email}">${icon('mail', { className: 'contact-list__icon' })}${CONTACT.email}</a>
      </li>`
    : ''}
</ul>`;

export const mapEmbed = (className) =>
  html`<iframe
    class="${cx('map', className)}"
    title="Mapa: JC Cars, C/ Ferrocarril 15, Getafe"
    src="${CONTACT.mapEmbed}"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
  ></iframe>`;

export const segmented = ({ label, items, variant }) => html`<div class="${cx('segmented', variant && `segmented--${variant}`)}" role="group" aria-label="${label}">
  ${items.map(
    (item) => html`<button
      ${attrs({
        type: 'button',
        class: cx('segmented__item', item.active && 'segmented__item--active'),
        'aria-pressed': item.active ? 'true' : 'false',
        'data-action': item.action,
        'data-value': item.value,
      })}
    >
      ${item.label}
    </button>`,
  )}
</div>`;

export const iconTile = (name, variant) =>
  html`<span class="${cx('icon-tile', variant && `icon-tile--${variant}`)}">${icon(name)}</span>`;

export const sectionHead = (title, aside, { level = 'h2', narrow } = {}) => html`<div class="section-head">
  ${level === 'h1'
    ? html`<h1 class="${cx('section-head__title', narrow && 'section-head__title--narrow')}">${title}</h1>`
    : html`<h2 class="${cx('section-head__title', narrow && 'section-head__title--narrow')}">${title}</h2>`}
  ${aside ? html`<div class="section-head__aside">${aside}</div>` : ''}
</div>`;
