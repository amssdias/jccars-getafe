import { attrs, cx, html } from '../core/html.js';

const describedBy = (id, error, hint, errorText) => (error && errorText ? `${id}-error` : hint ? `${id}-hint` : null);

const message = (id, error, errorText, hint) => {
  // Sin texto (p. ej. el formulario compacto del panel) el error se marca solo con el borde.
  if (error && errorText) return html`<span class="field__error" id="${id}-error">${errorText}</span>`;
  if (hint) return html`<span class="field__hint" id="${id}-hint">${hint}</span>`;
  return '';
};

const wrapper = (variant, content) => html`<div class="${cx('field', variant && `field--${variant}`)}">${content}</div>`;

const controlClass = (error) => cx('field__control', error && 'field__control--invalid');

export function textField({ id, label, model, value = '', type = 'text', error, errorText, hint, variant, live, ...rest }) {
  return wrapper(
    variant,
    html`<label class="field__label" for="${id}">${label}</label>
      <input
        ${attrs({
          id,
          class: controlClass(error),
          type,
          value,
          'data-model': model,
          'data-live': live,
          'aria-invalid': error ? 'true' : null,
          'aria-describedby': describedBy(id, error, hint, errorText),
          ...rest,
        })}
      />
      ${message(id, error, errorText, hint)}`,
  );
}

export function textareaField({ id, label, model, value = '', rows = 3, error, errorText, hint, variant, ...rest }) {
  return wrapper(
    variant,
    html`<label class="field__label" for="${id}">${label}</label>
      <textarea
        ${attrs({
          id,
          class: cx(controlClass(error), 'field__control--multiline'),
          rows,
          'data-model': model,
          'aria-invalid': error ? 'true' : null,
          'aria-describedby': describedBy(id, error, hint, errorText),
          ...rest,
        })}
      >${value}</textarea>
      ${message(id, error, errorText, hint)}`,
  );
}

const normalizeOption = (option) => (typeof option === 'string' ? { value: option, label: option } : option);

export function selectField({ id, label, model, value = '', options, placeholder, error, errorText, variant, live, ...rest }) {
  const items = options.map(normalizeOption);
  return wrapper(
    variant,
    html`<label class="field__label" for="${id}">${label}</label>
      <select
        ${attrs({
          id,
          class: cx(controlClass(error), 'field__control--select'),
          'data-model': model,
          'data-live': live,
          'aria-invalid': error ? 'true' : null,
          'aria-describedby': describedBy(id, error, null, errorText),
          ...rest,
        })}
      >
        ${placeholder !== undefined ? html`<option value="">${placeholder}</option>` : ''}
        ${items.map(
          (o) => html`<option ${attrs({ value: o.value, selected: String(o.value) === String(value) })}>${o.label}</option>`,
        )}
      </select>
      ${message(id, error, errorText)}`,
  );
}

export function checkboxField({ id, model, checked, label, error, errorText }) {
  return html`<div class="field">
    <label class="checkbox" for="${id}">
      <input ${attrs({ id, class: 'checkbox__input', type: 'checkbox', checked, 'data-model': model, 'aria-invalid': error ? 'true' : null })} />
      <span class="checkbox__label">${label}</span>
    </label>
    ${message(id, error, errorText)}
  </div>`;
}
