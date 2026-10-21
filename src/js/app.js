import { html } from './core/html.js';
import { navigate, onRouteChange } from './core/router.js';
import { saveData } from './core/storage.js';
import { createStore } from './core/store.js';
import { demoBanner, siteFooter, siteHeader } from './components/layout.js';
import { leadModal, modalActions } from './components/lead-modal.js';
import * as about from './pages/about.js';
import * as admin from './pages/admin.js';
import * as booking from './pages/booking.js';
import * as contact from './pages/contact.js';
import * as credits from './pages/credits.js';
import * as home from './pages/home.js';
import * as reviews from './pages/reviews.js';
import * as services from './pages/services.js';
import * as vehicle from './pages/vehicle.js';
import * as vehicles from './pages/vehicles.js';
import { createInitialState } from './state.js';

const PAGES = {
  inicio: home,
  servicios: services,
  reservar: booking,
  vehiculos: vehicles,
  vehiculo: vehicle,
  nosotros: about,
  opiniones: reviews,
  contacto: contact,
  admin,
  creditos: credits,
};

const SITE_NAME = 'JC Cars Getafe';
const CLOCK_INTERVAL_MS = 60_000;

const appActions = {
  'menu:toggle': (ctx) => ctx.setState({ menuOpen: !ctx.state.menuOpen }),
  'app:skip': () => document.getElementById('main')?.focus(),
};

const ACTIONS = {
  ...appActions,
  ...modalActions,
  ...Object.values(PAGES).reduce((all, page) => ({ ...all, ...page.actions }), {}),
};

const pageTitle = (page, state) => {
  const title = typeof page.title === 'function' ? page.title(state) : page.title;
  return page === home ? `${SITE_NAME} | ${title}` : `${title} | ${SITE_NAME}`;
};

// Como cada cambio de estado repinta el HTML, guardamos qué control tenía el
// foco (por id o por su acción) para devolvérselo tras el render.
const focusKey = (el) => {
  if (!el || el === document.body) return null;
  if (el.id) return `#${CSS.escape(el.id)}`;
  if (el.dataset.action) {
    const value = el.dataset.value ? `[data-value="${CSS.escape(el.dataset.value)}"]` : '';
    return `[data-action="${CSS.escape(el.dataset.action)}"]${value}`;
  }
  return null;
};

const captureFocus = (root) => {
  const el = document.activeElement;
  if (!root.contains(el)) return null;
  const key = focusKey(el);
  if (!key) return null;
  let selection = null;
  try {
    selection = el.selectionStart !== undefined ? [el.selectionStart, el.selectionEnd] : null;
  } catch {
    /* inputs como email no exponen la selección */
  }
  return { key, selection };
};

const restoreFocus = (root, focus) => {
  if (!focus) return;
  const el = root.querySelector(focus.key);
  if (!el || el.disabled) return;
  el.focus({ preventScroll: true });
  if (focus.selection && focus.selection[0] !== null) {
    try {
      el.setSelectionRange(...focus.selection);
    } catch {
      /* idem */
    }
  }
};

export function createApp(root) {
  const store = createStore(createInitialState());

  const ctx = {
    get state() {
      return store.getState();
    },
    setState: store.setState,
    setData(updater) {
      const data = updater(store.getState().data);
      saveData(data);
      store.setState({ data });
    },
    navigate,
  };

  let modalOpener = null;
  let renderedRoute = null;

  const render = () => {
    const state = store.getState();
    const page = PAGES[state.route.page];
    const hadModal = Boolean(root.querySelector('.modal'));
    let focus = captureFocus(root);

    if (state.modal && !hadModal) modalOpener = focus;

    // La animación de entrada solo se reproduce al cambiar de página, no en cada repintado.
    const routeKey = `${state.route.page}/${state.route.id ?? ''}`;
    const entering = routeKey !== renderedRoute;
    renderedRoute = routeKey;

    root.innerHTML = String(html`<button class="skip-link" type="button" data-action="app:skip">Saltar al contenido</button>
      ${demoBanner()} ${siteHeader(state)}
      <main id="main" class="${entering ? 'main main--enter' : 'main'}" tabindex="-1">${page.render(ctx)}</main>
      ${siteFooter()} ${leadModal(state.modal, { entering: !hadModal })}`);

    if (state.modal && !hadModal) {
      (root.querySelector('.modal input') ?? root.querySelector('.modal button'))?.focus();
      focus = null;
    } else if (!state.modal && hadModal) {
      focus = modalOpener;
      modalOpener = null;
    }

    restoreFocus(root, focus);
    document.documentElement.classList.toggle('is-locked', Boolean(state.modal));
    document.title = pageTitle(page, state);
  };

  // Agrupa varios setState del mismo evento en un único repintado.
  let queued = false;
  store.subscribe(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      render();
    });
  });

  const runAction = (name, el, event) => {
    const handler = ACTIONS[name];
    if (!handler) throw new Error(`Acción no registrada: ${name}`);
    handler(ctx, el, event);
  };

  const updateModel = (el) => {
    const [slice, key] = el.dataset.model.split('.');
    const current = store.getState()[slice];
    if (!current) return;

    let value = el.type === 'checkbox' ? el.checked : el.value;
    if (el.dataset.transform === 'upper' && value !== value.toUpperCase()) {
      const { selectionStart, selectionEnd } = el;
      value = value.toUpperCase();
      el.value = value;
      el.setSelectionRange(selectionStart, selectionEnd);
    }

    const next = { ...current, [key]: value };
    const clearsError = Boolean(current.errors?.[key]);
    const clearsAlert = Boolean(current.alert);
    if (clearsError) next.errors = { ...current.errors, [key]: false };
    if (clearsAlert) next.alert = '';

    store.setState({ [slice]: next }, { silent: !(clearsError || clearsAlert || el.hasAttribute('data-live')) });
  };

  const isChangeControl = (el) => el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'date';

  root.addEventListener('click', (event) => {
    const el = event.target.closest('[data-action]');
    if (el && root.contains(el)) runAction(el.dataset.action, el, event);
  });

  root.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-submit]');
    if (!form) return;
    event.preventDefault();
    runAction(form.dataset.submit, form, event);
  });

  root.addEventListener('input', (event) => {
    const el = event.target;
    if (el.dataset.model && !isChangeControl(el)) updateModel(el);
  });

  root.addEventListener('change', (event) => {
    const el = event.target;
    if (el.dataset.model && isChangeControl(el)) updateModel(el);
    if (el.dataset.change) runAction(el.dataset.change, el, event);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const { modal, menuOpen } = store.getState();
    if (modal) store.setState({ modal: null });
    else if (menuOpen) store.setState({ menuOpen: false });
  });

  onRouteChange((route) => {
    store.setState({ route, menuOpen: false, modal: null });
    window.scrollTo({ top: 0, behavior: 'instant' });
    queueMicrotask(() => document.getElementById('main')?.focus({ preventScroll: true }));
  });

  setInterval(() => store.setState({ now: new Date() }), CLOCK_INTERVAL_MS);

  render();
}
