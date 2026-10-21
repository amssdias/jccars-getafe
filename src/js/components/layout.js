import logoUrl from '../../assets/logo-jccars.jpeg';
import { cx, html } from '../core/html.js';
import { icon } from '../core/icons.js';
import { CONTACT, NAV_LINKS } from '../data/content.js';

const activeSection = (page) => (page === 'vehiculo' ? 'vehiculos' : page);

export const demoBanner = () => html`<div class="demo-banner">
  <span>Demo para JC Cars. Vehículos, precios, citas y opiniones son contenido de ejemplo.</span>
  <a class="demo-banner__link" href="#/admin">Abrir panel de administración</a>
</div>`;

const navLinks = (active, modifier) =>
  NAV_LINKS.map(
    (link) => html`<a
      class="${cx('nav__link', `nav__link--${modifier}`, active === link.page && 'nav__link--active')}"
      href="#/${link.page}"
      aria-current="${active === link.page ? 'page' : 'false'}"
      >${link.label}</a
    >`,
  );

export function siteHeader({ route, menuOpen }) {
  const active = activeSection(route.page);
  return html`<header class="header">
    <div class="header__bar">
      <a class="logo logo--header" href="#/" aria-label="JC Cars, inicio">
        <img class="logo__img" src="${logoUrl}" alt="" width="1179" height="1171" />
      </a>
      <nav class="nav header__nav" aria-label="Principal">${navLinks(active, 'desktop')}</nav>
      <div class="header__actions">
        <a class="header__phone" href="${CONTACT.phoneHref}">${icon('phone', { className: 'header__phone-icon' })}${CONTACT.phone}</a>
        <a class="button button--primary button--compact" href="#/reservar">Reservar cita</a>
        <button
          class="button button--secondary button--square header__toggle"
          type="button"
          data-action="menu:toggle"
          aria-expanded="${menuOpen ? 'true' : 'false'}"
          aria-controls="mobile-menu"
          aria-label="${menuOpen ? 'Cerrar menú' : 'Abrir menú'}"
        >
          ${icon(menuOpen ? 'x' : 'menu')}
        </button>
      </div>
    </div>
    <nav id="mobile-menu" class="${cx('mobile-nav', menuOpen && 'mobile-nav--open')}" aria-label="Principal (móvil)">
      ${navLinks(active, 'mobile')}
      <a class="mobile-nav__phone" href="${CONTACT.phoneHref}">${icon('phone')}${CONTACT.phone}</a>
    </nav>
  </header>`;
}

export const siteFooter = () => html`<footer class="footer">
  <div class="footer__inner">
    <div class="footer__grid">
      <span class="logo logo--footer">
        <img class="logo__img" src="${logoUrl}" alt="JC Cars, calidad y servicio" width="1179" height="1171" loading="lazy" />
      </span>
      <nav class="footer__col" aria-label="Taller">
        <span class="footer__title">Taller</span>
        <a class="footer__link" href="#/servicios">Servicios</a>
        <a class="footer__link" href="#/reservar">Reservar cita</a>
        <a class="footer__link" href="#/opiniones">Opiniones</a>
      </nav>
      <nav class="footer__col" aria-label="JC Cars">
        <span class="footer__title">JC Cars</span>
        <a class="footer__link" href="#/vehiculos">Vehículos Renault</a>
        <a class="footer__link" href="#/nosotros">Sobre nosotros</a>
        <a class="footer__link" href="#/contacto">Contacto</a>
      </nav>
      <div class="footer__col">
        <span class="footer__title">Visítanos</span>
        <span>${CONTACT.addressShort}</span>
        <a class="footer__link" href="${CONTACT.phoneHref}">${CONTACT.phone}</a>
        <a class="footer__link footer__link--icon" href="${CONTACT.instagram}" target="_blank" rel="noopener">
          ${icon('instagram')}${CONTACT.instagramHandle}
        </a>
      </div>
    </div>
    <div class="footer__legal">
      <span>JC Cars Getafe. Taller independiente especializado en Renault.</span>
      <a class="footer__legal-link" href="#/admin">Panel de administración</a>
      <a class="footer__legal-link" href="#/creditos">Créditos de fotos</a>
      <a class="footer__legal-link" href="#/">Aviso legal</a>
      <a class="footer__legal-link" href="#/">Privacidad</a>
    </div>
  </div>
</footer>`;
