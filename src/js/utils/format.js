export const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const pad = (n) => String(n).padStart(2, '0');

export const isoOf = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseIso = (iso) => new Date(`${iso}T00:00:00`);

export const eur = (amount) => `${Number(amount).toLocaleString('es-ES')} €`;

export const km = (amount) => `${Number(amount).toLocaleString('es-ES')} km`;

export const longDate = (iso) =>
  parseIso(iso).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

export const shortDate = (iso) => parseIso(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

export const stamp = (date = new Date()) =>
  `${date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}, ${date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

export const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

export const onlyDigits = (value) => String(value).replace(/\D/g, '');
