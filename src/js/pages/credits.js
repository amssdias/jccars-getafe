import { html } from '../core/html.js';
import { allCredits } from '../data/photos.js';

export const title = 'Créditos de fotos';

const UTM = 'utm_source=jccars_getafe&utm_medium=referral';

export const render = () => html`<div class="page container stack stack--lg">
  <header class="page-intro">
    <h1 class="heading-display heading-display--md">Créditos de fotos</h1>
    <p class="page-intro__lead">
      Las fotografías de esta demo son de <a href="https://unsplash.com/?${UTM}" target="_blank" rel="noopener">Unsplash</a> y se
      sustituirán por fotos reales del taller.
    </p>
  </header>
  <ul class="credits" role="list">
    ${allCredits().map(
      (p) => html`<li class="credits__item">
        <span class="credits__alt">${p.alt}</span>
        <a href="https://unsplash.com/@${p.username}?${UTM}" target="_blank" rel="noopener">${p.author}</a>
      </li>`,
    )}
  </ul>
</div>`;

export const actions = {};
