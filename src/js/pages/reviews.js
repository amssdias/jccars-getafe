import { attrs, html } from '../core/html.js';
import { textareaField, textField } from '../components/field.js';
import { ratingSummary, sampleNote, stars } from '../components/ui.js';
import { emptyReview } from '../state.js';
import { MONTHS } from '../utils/format.js';
import { hasErrors } from '../utils/validation.js';

export const title = 'Opiniones de clientes';

const MIN_TEXT_LENGTH = 15;

const reviewCard = (r) => html`<figure class="review-card">
  <div class="review-card__top">${stars(r.rating)}<span class="review-card__date">${r.date}</span></div>
  <blockquote class="review-card__text">${r.text}</blockquote>
  <figcaption class="review-card__author">${r.name}<span class="review-card__service">, ${r.service}</span></figcaption>
</figure>`;

const ratingPicker = (rating) => html`<fieldset class="rating-picker">
  <legend class="field__label">Valoración</legend>
  <div class="rating-picker__options">
    ${[1, 2, 3, 4, 5].map(
      (n) => html`<button
        ${attrs({
          type: 'button',
          class: n <= rating ? 'rating-picker__star rating-picker__star--on' : 'rating-picker__star',
          'aria-label': `${n} ${n === 1 ? 'estrella' : 'estrellas'}`,
          'aria-pressed': n === rating ? 'true' : 'false',
          'data-action': 'reviews:rating',
          'data-value': n,
        })}
      >
        ★
      </button>`,
    )}
  </div>
</fieldset>`;

const reviewForm = (rv) => {
  if (rv.sent) {
    return html`<div class="stack stack--sm">
      <h2 class="panel__title">Gracias por tu opinión</h2>
      <p class="panel__text">Ya aparece en la lista. En la web real pasaría primero por revisión.</p>
      <button class="button button--secondary" type="button" data-action="reviews:reset">Escribir otra</button>
    </div>`;
  }
  return html`<form class="form" data-submit="reviews:submit" novalidate>
    <h2 class="panel__title">Deja tu opinión</h2>
    ${ratingPicker(rv.rating)}
    ${textField({ id: 'rv-name', label: 'Nombre', model: 'rv.name', value: rv.name, autocomplete: 'name', error: rv.errors.name, errorText: 'Escribe tu nombre.' })}
    ${textareaField({ id: 'rv-text', label: 'Tu experiencia', model: 'rv.text', value: rv.text, rows: 4, error: rv.errors.text, errorText: `Cuéntanos un poco más (mínimo ${MIN_TEXT_LENGTH} caracteres).` })}
    <button class="button button--primary" type="submit">Publicar opinión</button>
  </form>`;
};

export const render = ({ state }) => html`<div class="page container stack stack--xl">
  <div class="reviews-header">
    <div class="stack stack--sm">
      <h1 class="heading-display">Opiniones de clientes</h1>
      ${sampleNote('Opiniones de ejemplo')}
    </div>
    ${ratingSummary(state.data.reviews, { boxed: true })}
  </div>
  <div class="split">
    <div class="split__main masonry">${[...state.data.reviews].reverse().map(reviewCard)}</div>
    <div class="split__aside panel panel--sticky">${reviewForm(state.rv)}</div>
  </div>
</div>`;

const shortName = (fullName) => {
  const [first, last] = fullName.trim().split(/\s+/);
  return last ? `${first} ${last[0]}.` : first;
};

export const actions = {
  'reviews:rating': (ctx, el) => ctx.setState({ rv: { ...ctx.state.rv, rating: Number(el.dataset.value) } }),

  'reviews:reset': (ctx) => ctx.setState({ rv: emptyReview() }),

  'reviews:submit': (ctx) => {
    const rv = ctx.state.rv;
    const errors = { name: !rv.name.trim(), text: rv.text.trim().length < MIN_TEXT_LENGTH };
    if (hasErrors(errors)) {
      ctx.setState({ rv: { ...rv, errors } });
      return;
    }
    const now = new Date();
    ctx.setData((data) => ({
      ...data,
      reviews: [
        ...data.reviews,
        {
          id: `r${Date.now()}`,
          name: shortName(rv.name),
          rating: rv.rating,
          service: 'Cliente del taller',
          date: `${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
          text: rv.text.trim(),
        },
      ],
    }));
    ctx.setState({ rv: { ...rv, sent: true } });
  },
};
