import { html, cx } from '../core/html.js';
import { PHOTOS } from '../data/photos.js';

const CDN = 'https://images.unsplash.com/';
const WIDTHS = [480, 800, 1200, 1600];

const ratioValue = (ratio) => {
  const [w, h] = ratio.split(':').map(Number);
  return w / h;
};

const photoUrl = (id, width, ratio) => `${CDN}${id}?auto=format&fit=crop&w=${width}&ar=${ratio}&q=70`;

// <img> responsive recortada en el CDN con la misma proporción que su marco CSS.
export function photo(key, { ratio = '16:10', sizes = '100vw', eager = false, maxWidth = 1600, className } = {}) {
  const p = PHOTOS[key];
  const widths = WIDTHS.filter((w) => w <= maxWidth);
  const largest = widths[widths.length - 1];
  return html`<img
    class="${cx('media__img', className)}"
    src="${photoUrl(p.id, 800 <= maxWidth ? 800 : largest, ratio)}"
    srcset="${widths.map((w) => `${photoUrl(p.id, w, ratio)} ${w}w`).join(', ')}"
    sizes="${sizes}"
    width="${largest}"
    height="${Math.round(largest / ratioValue(ratio))}"
    alt="${p.alt}"
    loading="${eager ? 'eager' : 'lazy'}"
    fetchpriority="${eager ? 'high' : 'auto'}"
    decoding="async"
  />`;
}
