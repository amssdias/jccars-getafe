const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export class SafeHtml {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);

const serialize = (value) => {
  if (value === null || value === undefined || value === false) return '';
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(serialize).join('');
  return escapeHtml(value);
};

// Tagged template: todo lo interpolado se escapa salvo otros fragmentos html``.
// Así los datos que vienen de formularios o de localStorage nunca se inyectan como HTML.
export const html = (strings, ...values) =>
  new SafeHtml(strings.reduce((out, chunk, i) => out + chunk + (i < values.length ? serialize(values[i]) : ''), ''));

export const raw = (value) => new SafeHtml(String(value));

export const cx = (...parts) => parts.flat().filter(Boolean).join(' ');

// Atributos opcionales: se omiten null/undefined/false y `true` queda como atributo booleano.
export const attrs = (map) =>
  raw(
    Object.entries(map)
      .filter(([, value]) => value !== null && value !== undefined && value !== false)
      .map(([key, value]) => (value === true ? key : `${key}="${escapeHtml(value)}"`))
      .join(' '),
  );
