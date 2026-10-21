import { attrs, cx, html } from '../core/html.js';
import { icon } from '../core/icons.js';
import { selectField, textareaField, textField } from '../components/field.js';
import { MODELS } from '../data/content.js';
import { activeServices, emptyBooking, serviceById } from '../state.js';
import { MONTHS, eur, isoOf, longDate, stamp } from '../utils/format.js';
import { slotsFor } from '../utils/schedule.js';
import { hasErrors, isEmail, isPhone } from '../utils/validation.js';

export const title = 'Reserva tu cita';

const STEP_NAMES = ['Servicio', 'Día y hora', 'Tus datos'];
const MAX_DAYS_AHEAD = 60;
const MAX_MONTH_OFFSET = 2;
const WEEKDAYS = [
  ['L', 'Lunes'],
  ['M', 'Martes'],
  ['X', 'Miércoles'],
  ['J', 'Jueves'],
  ['V', 'Viernes'],
  ['S', 'Sábado'],
  ['D', 'Domingo'],
];

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const steps = (current) => html`<ol class="steps" role="list">
  ${STEP_NAMES.map((label, i) => {
    const n = i + 1;
    const state = n === current ? 'current' : n < current ? 'done' : 'todo';
    return html`<li class="${cx('steps__item', `steps__item--${state}`)}" aria-current="${state === 'current' ? 'step' : 'false'}">
      <span class="steps__number">${state === 'done' ? icon('check') : n}</span>${label}
    </li>`;
  })}
</ol>`;

const serviceStep = (bk, services) => html`<h2 class="panel__title">¿Qué necesita tu coche?</h2>
  <div class="choice-grid">
    ${services.map(
      (s) => html`<button
        type="button"
        class="${cx('choice', bk.serviceId === s.id && 'choice--selected')}"
        aria-pressed="${bk.serviceId === s.id ? 'true' : 'false'}"
        data-action="booking:service"
        data-value="${s.id}"
      >
        <span class="choice__title">${icon(s.icon, { className: 'choice__icon' })}${s.name}</span>
        <span class="choice__meta">Desde ${eur(s.price)}, ${s.duration} min</span>
      </button>`,
    )}
  </div>`;

const calendar = (bk, now) => {
  const today = startOfDay(now);
  const maxDay = new Date(today);
  maxDay.setDate(maxDay.getDate() + MAX_DAYS_AHEAD);
  const monthStart = new Date(today.getFullYear(), today.getMonth() + bk.monthOffset, 1);
  const leading = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < leading; i += 1) days.push(html`<span class="calendar__blank"></span>`);
  for (let d = 1; d <= daysInMonth; d += 1) {
    const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), d);
    const iso = isoOf(date);
    const disabled = date < today || date > maxDay || date.getDay() === 0;
    days.push(html`<button
      ${attrs({
        type: 'button',
        class: cx(
          'calendar__day',
          bk.date === iso && 'calendar__day--selected',
          date.getTime() === today.getTime() && 'calendar__day--today',
        ),
        disabled,
        'aria-label': longDate(iso),
        'aria-pressed': bk.date === iso ? 'true' : 'false',
        'data-action': 'booking:date',
        'data-value': iso,
      })}
    >
      ${d}
    </button>`);
  }

  return html`<div class="calendar">
    <div class="calendar__header">
      <button
        ${attrs({ type: 'button', class: 'button button--secondary button--square button--small', 'data-action': 'booking:month', 'data-value': '-1', 'aria-label': 'Mes anterior', disabled: bk.monthOffset === 0 })}
      >
        ${icon('chevron-left')}
      </button>
      <span class="calendar__title" aria-live="polite">${MONTHS[monthStart.getMonth()]} ${monthStart.getFullYear()}</span>
      <button
        ${attrs({ type: 'button', class: 'button button--secondary button--square button--small', 'data-action': 'booking:month', 'data-value': '1', 'aria-label': 'Mes siguiente', disabled: bk.monthOffset >= MAX_MONTH_OFFSET })}
      >
        ${icon('chevron-right')}
      </button>
    </div>
    <div class="calendar__weekdays" aria-hidden="true">${WEEKDAYS.map(([short]) => html`<span>${short}</span>`)}</div>
    <div class="calendar__grid">${days}</div>
  </div>`;
};

const slotsPanel = (bk, bookings, now) => html`<div class="slots">
  <h3 class="slots__title">${bk.date ? `Horas libres el ${longDate(bk.date)}` : 'Horas libres'}</h3>
  ${bk.date
    ? html`<div class="slots__grid">
          ${slotsFor(bk.date, bookings, now).map(
            (slot) => html`<button
              ${attrs({
                type: 'button',
                class: cx('slots__item', bk.time === slot.time && 'slots__item--selected'),
                disabled: slot.disabled,
                'aria-pressed': bk.time === slot.time ? 'true' : 'false',
                'aria-label': slot.disabled ? `${slot.time}, ocupada` : slot.time,
                'data-action': 'booking:time',
                'data-value': slot.time,
              })}
            >
              ${slot.time}
            </button>`,
          )}
        </div>
        <p class="slots__hint">Las horas tachadas ya están reservadas.</p>`
    : html`<p class="empty-hint">Elige un día en el calendario para ver las horas libres. Abrimos de lunes a sábado.</p>`}
</div>`;

const dateStep = (bk, data, now) => html`<h2 class="panel__title">Elige día y hora</h2>
  <div class="date-picker">${calendar(bk, now)} ${slotsPanel(bk, data.bookings, now)}</div>`;

const detailsStep = (bk) => {
  const e = bk.errors;
  return html`<h2 class="panel__title">Tus datos y los del coche</h2>
    <div class="form__grid">
      ${textField({ id: 'bk-name', label: 'Nombre y apellidos', model: 'bk.name', value: bk.name, autocomplete: 'name', error: e.name, errorText: 'Escribe tu nombre.' })}
      ${textField({ id: 'bk-phone', label: 'Teléfono', model: 'bk.phone', value: bk.phone, type: 'tel', inputmode: 'tel', autocomplete: 'tel', error: e.phone, errorText: 'Necesitamos un teléfono de 9 cifras.' })}
      ${textField({ id: 'bk-email', label: 'Email', model: 'bk.email', value: bk.email, type: 'email', autocomplete: 'email', error: e.email, errorText: 'Revisa el email, parece incompleto.' })}
      ${textField({ id: 'bk-plate', label: 'Matrícula', model: 'bk.plate', value: bk.plate, placeholder: '1234 ABC', maxlength: 8, autocapitalize: 'characters', 'data-transform': 'upper', error: e.plate, errorText: 'Escribe la matrícula.' })}
      ${selectField({ id: 'bk-model', label: 'Modelo', model: 'bk.model', value: bk.model, options: MODELS, placeholder: 'Elige el modelo', error: e.model, errorText: 'Elige el modelo de tu coche.' })}
      ${textField({ id: 'bk-year', label: 'Año', model: 'bk.year', value: bk.year, inputmode: 'numeric', maxlength: 4, placeholder: '2019', hint: 'Opcional' })}
    </div>
    ${textareaField({ id: 'bk-notes', label: '¿Algo que debamos saber?', model: 'bk.notes', value: bk.notes, hint: 'Por ejemplo: ruido al frenar o un testigo encendido.' })}`;
};

const summary = (bk, data) => {
  const s = serviceById(data, bk.serviceId);
  const rows = [
    ['Servicio', s ? s.name : 'Sin elegir'],
    ['Día', bk.date ? longDate(bk.date) : 'Sin elegir'],
    ['Hora', bk.time || 'Sin elegir'],
    ['Duración aprox.', s ? `${s.duration} min` : '-'],
    ['Precio', s ? `Desde ${eur(s.price)}` : '-'],
  ];
  return html`<aside class="summary" aria-label="Resumen de la reserva">
    <h2 class="summary__title">Resumen</h2>
    <dl class="summary__list">
      ${rows.map(([k, v]) => html`<div class="summary__row"><dt>${k}</dt><dd>${v}</dd></div>`)}
    </dl>
    <p class="summary__note">Pagas en el taller. Si hay que hacer algo más, te llamamos antes con el presupuesto.</p>
  </aside>`;
};

const doneCard = (booking, data) => {
  const rows = [
    ['Código de reserva', booking.id],
    ['Servicio', serviceById(data, booking.serviceId)?.name ?? ''],
    ['Día', longDate(booking.date)],
    ['Hora', booking.time],
    ['Vehículo', `Renault ${booking.model}, ${booking.plate}`],
    ['Teléfono', booking.phone],
  ];
  return html`<div class="confirmation">
    <span class="icon-tile icon-tile--solid icon-tile--xl">${icon('check')}</span>
    <h2 class="confirmation__title">Cita reservada, ${booking.name.split(' ')[0]}.</h2>
    <p class="confirmation__text">
      Te hemos enviado la confirmación a ${booking.email}. Si necesitas cambiarla, llámanos o escríbenos por WhatsApp.
    </p>
    <dl class="confirmation__details">
      ${rows.map(([k, v]) => html`<div class="confirmation__item"><dt>${k}</dt><dd>${v}</dd></div>`)}
    </dl>
    <div class="button-group">
      <button class="button button--primary" type="button" data-action="booking:reset">Reservar otra cita</button>
      <a class="button button--secondary" href="#/">Volver al inicio</a>
    </div>
  </div>`;
};

export function render({ state }) {
  const { bk, data, now } = state;
  if (bk.done) {
    return html`<div class="page container stack stack--lg">
      <h1 class="heading-display heading-display--md">Reserva tu cita</h1>
      ${doneCard(bk.done, data)}
    </div>`;
  }

  const stepContent = {
    1: () => serviceStep(bk, activeServices(data)),
    2: () => dateStep(bk, data, now),
    3: () => detailsStep(bk),
  }[bk.step]();

  return html`<div class="page container stack stack--lg">
    <h1 class="heading-display heading-display--md">Reserva tu cita</h1>
    ${steps(bk.step)}
    <div class="booking">
      <form class="panel booking__panel" data-submit="booking:next" novalidate>
        ${stepContent}
        ${bk.alert ? html`<p class="form-alert" role="alert">${icon('circle-alert')}${bk.alert}</p>` : ''}
        <div class="panel__footer">
          ${bk.step > 1
            ? html`<button class="button button--secondary" type="button" data-action="booking:back">${icon('arrow-left')}Atrás</button>`
            : html`<span></span>`}
          <button class="button button--primary" type="submit">
            ${bk.step === 3 ? 'Confirmar reserva' : 'Continuar'}${icon('arrow-right')}
          </button>
        </div>
      </form>
      ${summary(bk, data)}
    </div>
  </div>`;
}

const patchBooking = (ctx, patch) => ctx.setState({ bk: { ...ctx.state.bk, ...patch } });

const nextBookingId = (bookings) => {
  const highest = bookings.reduce((max, b) => Math.max(max, Number(b.id.replace(/\D/g, '')) || 0), 4840);
  return `JC-${highest + 1}`;
};

export const actions = {
  'booking:start': (ctx, el) => {
    ctx.setState({ bk: { ...emptyBooking(), serviceId: el.dataset.value, step: 2 } });
    ctx.navigate('reservar');
  },

  'booking:service': (ctx, el) => patchBooking(ctx, { serviceId: el.dataset.value, alert: '' }),

  'booking:month': (ctx, el) => {
    const offset = ctx.state.bk.monthOffset + Number(el.dataset.value);
    patchBooking(ctx, { monthOffset: Math.min(MAX_MONTH_OFFSET, Math.max(0, offset)) });
  },

  'booking:date': (ctx, el) => patchBooking(ctx, { date: el.dataset.value, time: '', alert: '' }),

  'booking:time': (ctx, el) => patchBooking(ctx, { time: el.dataset.value, alert: '' }),

  'booking:back': (ctx) => patchBooking(ctx, { step: Math.max(1, ctx.state.bk.step - 1), alert: '' }),

  'booking:reset': (ctx) => ctx.setState({ bk: emptyBooking() }),

  'booking:next': (ctx) => {
    const { bk, data } = ctx.state;

    if (bk.step === 1) {
      if (!bk.serviceId) return patchBooking(ctx, { alert: 'Elige un servicio para continuar.' });
      return patchBooking(ctx, { step: 2, alert: '' });
    }

    if (bk.step === 2) {
      if (!bk.date || !bk.time) return patchBooking(ctx, { alert: 'Elige un día y una hora libres.' });
      return patchBooking(ctx, { step: 3, alert: '' });
    }

    const errors = {
      name: !bk.name.trim(),
      phone: !isPhone(bk.phone),
      email: !isEmail(bk.email),
      plate: bk.plate.trim().length < 4,
      model: !bk.model,
    };
    if (hasErrors(errors)) return patchBooking(ctx, { errors, alert: 'Revisa los campos marcados.' });

    const booking = {
      id: nextBookingId(data.bookings),
      serviceId: bk.serviceId,
      date: bk.date,
      time: bk.time,
      name: bk.name.trim(),
      phone: bk.phone,
      email: bk.email.trim(),
      plate: bk.plate,
      model: bk.model,
      year: bk.year,
      notes: bk.notes,
      status: 'Pendiente',
      created: stamp(),
    };
    ctx.setData((d) => ({ ...d, bookings: [...d.bookings, booking] }));
    return patchBooking(ctx, { done: booking, alert: '' });
  },
};
