export const PAGES = [
  'inicio',
  'servicios',
  'reservar',
  'vehiculos',
  'vehiculo',
  'nosotros',
  'opiniones',
  'contacto',
  'admin',
  'creditos',
];

export function parseHash(hash = window.location.hash) {
  const [page, id] = hash.replace(/^#\/?/, '').split('/');
  return { page: PAGES.includes(page) ? page : 'inicio', id };
}

export const navigate = (page) => {
  window.location.hash = `#/${page}`;
};

export const onRouteChange = (callback) => {
  window.addEventListener('hashchange', () => callback(parseHash()));
};
