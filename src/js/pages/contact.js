import { html } from '../core/html.js';
import { icon } from '../core/icons.js';
import { checkboxField, selectField, textareaField, textField } from '../components/field.js';
import { contactList, hoursList, mapEmbed } from '../components/ui.js';
import { CONTACT, CONTACT_REASONS, whatsappLink } from '../data/content.js';
import { emptyContact } from '../state.js';
import { stamp } from '../utils/format.js';
import { hasErrors, isEmail, isPhone } from '../utils/validation.js';

export const title = 'Contacto';

const contactForm = (ct) => {
  if (ct.sent) {
    return html`<div class="confirmation confirmation--plain">
      <span class="icon-tile icon-tile--solid icon-tile--lg">${icon('check')}</span>
      <h2 class="confirmation__title confirmation__title--sm">Mensaje enviado</h2>
      <p class="confirmation__text">Te respondemos hoy mismo en horario de taller.</p>
      <button class="button button--secondary" type="button" data-action="contact:reset">Enviar otro mensaje</button>
    </div>`;
  }
  const e = ct.errors;
  return html`<form class="form" data-submit="contact:submit" novalidate>
    <div class="form__grid">
      ${textField({ id: 'ct-name', label: 'Nombre', model: 'ct.name', value: ct.name, autocomplete: 'name', error: e.name, errorText: 'Escribe tu nombre.' })}
      ${textField({ id: 'ct-phone', label: 'Teléfono', model: 'ct.phone', value: ct.phone, type: 'tel', inputmode: 'tel', autocomplete: 'tel', error: e.phone, errorText: 'Necesitamos un teléfono de 9 cifras.' })}
      ${textField({ id: 'ct-email', label: 'Email', model: 'ct.email', value: ct.email, type: 'email', autocomplete: 'email', error: e.email, errorText: 'Revisa el email, parece incompleto.' })}
      ${selectField({ id: 'ct-reason', label: 'Motivo de la consulta', model: 'ct.reason', value: ct.reason, options: CONTACT_REASONS, placeholder: 'Elige un motivo', error: e.reason, errorText: 'Elige un motivo.' })}
    </div>
    ${textareaField({ id: 'ct-message', label: 'Mensaje', model: 'ct.message', value: ct.message, rows: 5, error: e.message, errorText: 'Escribe tu mensaje.' })}
    ${checkboxField({
      id: 'ct-consent',
      model: 'ct.consent',
      checked: ct.consent,
      label: 'Acepto que JC Cars use mis datos para responder a esta consulta.',
      error: e.consent,
      errorText: 'Necesitamos tu permiso para responderte.',
    })}
    <button class="button button--primary form__submit" type="submit">Enviar mensaje</button>
  </form>`;
};

export const render = ({ state }) => html`<div class="page container stack stack--xl">
  <h1 class="heading-display">Contacto</h1>
  <div class="split split--contact">
    <div class="split__main panel panel--roomy">${contactForm(state.ct)}</div>
    <div class="split__aside stack stack--md">
      <a class="whatsapp-card" href="${whatsappLink('Hola, quería hacer una consulta.')}" target="_blank" rel="noopener">
        <span class="icon-tile icon-tile--solid icon-tile--lg">${icon('message-circle')}</span>
        <span class="whatsapp-card__body">
          <span class="whatsapp-card__title">Escríbenos por WhatsApp</span>
          <span class="whatsapp-card__text">${CONTACT.whatsappLabel}, respuesta rápida</span>
        </span>
      </a>
      <div class="panel stack stack--sm">${contactList({ withEmail: true })} <div class="divider"></div> ${hoursList(state.now)}</div>
      ${mapEmbed('map--short')}
    </div>
  </div>
</div>`;

export const actions = {
  'contact:reset': (ctx) => ctx.setState({ ct: emptyContact() }),

  'contact:submit': (ctx) => {
    const ct = ctx.state.ct;
    const errors = {
      name: !ct.name.trim(),
      phone: !isPhone(ct.phone),
      email: !isEmail(ct.email),
      reason: !ct.reason,
      message: !ct.message.trim(),
      consent: !ct.consent,
    };
    if (hasErrors(errors)) {
      ctx.setState({ ct: { ...ct, errors } });
      return;
    }
    ctx.setData((data) => ({
      ...data,
      leads: [
        ...data.leads,
        {
          id: `L${Date.now()}`,
          type: 'Contacto',
          name: ct.name.trim(),
          contact: `${ct.phone}, ${ct.email.trim()}`,
          subject: ct.reason,
          message: ct.message.trim(),
          created: stamp(),
          status: 'Nueva',
        },
      ],
    }));
    ctx.setState({ ct: { ...ct, sent: true } });
  },
};
