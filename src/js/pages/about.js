import { cx, html } from '../core/html.js';
import { photo } from '../components/photo.js';
import { sampleNote } from '../components/ui.js';
import { HISTORY, INSTALLATIONS, TEAM } from '../data/content.js';
import { TEAM_PHOTOS } from '../data/photos.js';

export const title = 'Sobre nosotros';

const intro = () => html`<section class="section section--first">
  <div class="container about-intro">
    <div class="about-intro__content">
      <h1 class="heading-display">Especialistas en Renault, en Getafe.</h1>
      <p class="page-intro__lead">
        JC Cars es un taller familiar dedicado a Renault. Conocemos cada modelo, usamos equipo de diagnosis específico y te
        explicamos siempre lo que hacemos y por qué.
      </p>
      ${sampleNote('Historia y equipo de ejemplo')}
    </div>
    <div class="about-intro__media media media--rounded">
      ${photo('about', { ratio: '4:3', sizes: '(min-width: 1020px) 50vw, 100vw', eager: true })}
    </div>
  </div>
</section>`;

const history = () => html`<section class="section section--muted">
  <div class="container stack stack--lg">
    <h2 class="heading-section">Nuestra historia</h2>
    <ol class="timeline" role="list">
      ${HISTORY.map(
        (h) => html`<li class="${cx('timeline__item', h.highlight && 'timeline__item--highlight')}">
          <span class="timeline__year mono">${h.year}</span>
          <h3 class="timeline__title">${h.title}</h3>
          <p class="timeline__text">${h.text}</p>
        </li>`,
      )}
    </ol>
  </div>
</section>`;

const team = () => html`<section class="section section--tight-bottom">
  <div class="container stack stack--lg">
    <h2 class="heading-section">El equipo</h2>
    <ul class="card-grid card-grid--narrow" role="list">
      ${TEAM.map(
        (t) => html`<li class="team-card">
          <div class="team-card__media media">
            ${photo(TEAM_PHOTOS[t.id], { ratio: '4:5', sizes: '(min-width: 1020px) 25vw, (min-width: 600px) 50vw, 100vw', maxWidth: 800 })}
          </div>
          <h3 class="team-card__name">${t.name}</h3>
          <p class="team-card__role">${t.role}</p>
          <p class="team-card__text">${t.text}</p>
        </li>`,
      )}
    </ul>
  </div>
</section>`;

const installations = () => {
  const [main, ...side] = INSTALLATIONS;
  const figure = (item, ratio, modifier) => html`<figure class="${cx('installations__figure', modifier)}">
    <div class="installations__media media">${photo(item.photo, { ratio, sizes: '(min-width: 1020px) 50vw, 100vw' })}</div>
    <figcaption class="installations__caption">${item.caption}</figcaption>
  </figure>`;

  return html`<section class="section">
    <div class="container stack stack--lg">
      <h2 class="heading-section">Instalaciones</h2>
      <div class="installations">
        ${figure(main, '16:10', 'installations__figure--main')}
        <div class="installations__side">${side.map((item) => figure(item, '4:3'))}</div>
      </div>
    </div>
  </section>`;
};

export const render = () => html`<div class="page page--flush">${intro()} ${history()} ${team()} ${installations()}</div>`;

export const actions = {};
