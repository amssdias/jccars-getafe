import { html } from '../core/html.js';
import { icon } from '../core/icons.js';
import { longDate, stamp } from '../utils/format.js';
import { hasErrors, isEmail, isPhone } from '../utils/validation.js';
import { textareaField, textField } from './field.js';

const TYPES = {
  info: { title: 'Solicitar información', cta: 'Enviar solicitud', done: 'Solicitud enviada', lead: 'Información' },
  quote: { title: 'Pedir presupuesto', cta: 'Pedir presupuesto', done: 'Presupuesto solicitado', lead: 'Presupuesto' },
  test: { title: 'Reservar prueba de conducción', cta: 'Reservar prueba', done: 'Prueba solicitada', lead: 'Prueba de conducción' },
};

export const createModal = (type, vehicle) => ({
  type,
  vehicle,
  name: '',
  phone: '',
  email: '',
  date: '',
  message: '',
  errors: {},
  sent: false,
});

export function leadModal(modal, { entering = false } = {}) {
  if (!modal) return '';
  const t = TYPES[modal.type];
  const e = modal.errors;

  const body = modal.sent
    ? html`<div class="modal__done">
        <span class="icon-tile icon-tile--solid icon-tile--lg">${icon('check')}</span>
        <p class="modal__done-title">${t.done}</p>
        <p class="modal__text">Te contactamos en menos de 24 horas laborables.</p>
        <button class="button button--secondary" type="button" data-action="modal:close">Cerrar</button>
      </div>`
    : html`<form class="form" data-submit="modal:submit" novalidate>
        ${textField({ id: 'm-name', label: 'Nombre', model: 'modal.name', value: modal.name, autocomplete: 'name', error: e.name, errorText: 'Escribe tu nombre.' })}
        <div class="form__row">
          ${textField({ id: 'm-phone', label: 'Teléfono', model: 'modal.phone', value: modal.phone, type: 'tel', inputmode: 'tel', autocomplete: 'tel', error: e.phone, errorText: 'Teléfono de 9 cifras.' })}
          ${textField({ id: 'm-email', label: 'Email', model: 'modal.email', value: modal.email, type: 'email', autocomplete: 'email', error: e.email, errorText: 'Revisa el email.' })}
        </div>
        ${modal.type === 'test'
          ? textField({ id: 'm-date', label: 'Día preferido para la prueba', model: 'modal.date', value: modal.date, type: 'date', error: e.date, errorText: 'Elige un día.' })
          : ''}
        ${textareaField({
          id: 'm-message',
          label: 'Mensaje',
          model: 'modal.message',
          value: modal.message,
          hint: 'Opcional',
          placeholder: modal.type === 'quote' ? 'Por ejemplo: quiero financiar o entregar mi coche actual' : null,
        })}
        <button class="button button--primary" type="submit">${t.cta}</button>
      </form>`;

  return html`<div class="${entering ? 'modal modal--enter' : 'modal'}" data-action="modal:backdrop">
    <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal__header">
        <div class="modal__heading">
          <h2 class="modal__title" id="modal-title">${t.title}</h2>
          <p class="modal__subtitle">${modal.vehicle}</p>
        </div>
        <button class="button button--secondary button--square button--small" type="button" data-action="modal:close" aria-label="Cerrar">
          ${icon('x')}
        </button>
      </div>
      ${body}
    </div>
  </div>`;
}

export const modalActions = {
  'modal:close': (ctx) => ctx.setState({ modal: null }),

  'modal:backdrop': (ctx, el, event) => {
    if (event.target === el) ctx.setState({ modal: null });
  },

  'modal:submit': (ctx) => {
    const m = ctx.state.modal;
    const errors = {
      name: !m.name.trim(),
      phone: !isPhone(m.phone),
      email: !isEmail(m.email),
      date: m.type === 'test' && !m.date,
    };
    if (hasErrors(errors)) {
      ctx.setState({ modal: { ...m, errors } });
      return;
    }
    const prefix = m.type === 'test' ? `Prueba el ${longDate(m.date)}. ` : '';
    ctx.setData((data) => ({
      ...data,
      leads: [
        ...data.leads,
        {
          id: `L${Date.now()}`,
          type: TYPES[m.type].lead,
          name: m.name.trim(),
          contact: `${m.phone}, ${m.email.trim()}`,
          subject: m.vehicle,
          message: prefix + m.message.trim(),
          created: stamp(),
          status: 'Nueva',
        },
      ],
    }));
    ctx.setState({ modal: { ...m, sent: true } });
  },
};
