import { html } from '../core/html.js';
import { vehiclePhotos } from '../data/photos.js';
import { eur, km } from '../utils/format.js';
import { photo } from './photo.js';
import { badge, sampleNote } from './ui.js';

export const isNew = (vehicle) => vehicle.cond === 'Nuevo';

// "Renault 5" ya lleva la marca en el nombre del modelo.
export const vehicleName = (vehicle) =>
  vehicle.model.startsWith('Renault') ? vehicle.model : `Renault ${vehicle.model}`;

export const specLine = (vehicle) =>
  isNew(vehicle)
    ? `${vehicle.fuel}, ${vehicle.gear}, ${vehicle.hp} cv`
    : `${vehicle.year}, ${km(vehicle.km)}, ${vehicle.fuel}`;

export const vehicleBadges = (vehicle) => html`<div class="badge-group">
  ${badge(vehicle.cond, isNew(vehicle) ? 'brand' : 'muted')}
  ${badge(`Etiqueta ${vehicle.label}`, 'neutral')}
  ${vehicle.status === 'Reservado' ? badge('Reservado', 'dark') : ''}
</div>`;

export function vehicleCard(vehicle, { sizes = '(min-width: 1020px) 33vw, (min-width: 600px) 50vw, 100vw' } = {}) {
  return html`<a class="vehicle-card" href="#/vehiculo/${vehicle.id}">
    <div class="vehicle-card__media media">${photo(vehiclePhotos(vehicle.id)[0], { ratio: '16:10', sizes, maxWidth: 800 })}</div>
    <div class="vehicle-card__body">
      ${vehicleBadges(vehicle)}
      <div class="vehicle-card__heading">
        <h3 class="vehicle-card__title">${vehicleName(vehicle)}</h3>
        <p class="vehicle-card__version">${vehicle.version}</p>
      </div>
      <p class="vehicle-card__specs mono">${specLine(vehicle)}</p>
      <div class="vehicle-card__footer">
        <span class="vehicle-card__price">${eur(vehicle.price)}</span>
        ${sampleNote('Precio de ejemplo')}
      </div>
    </div>
  </a>`;
}
