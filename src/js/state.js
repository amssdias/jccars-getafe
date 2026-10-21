import { parseHash } from './core/router.js';
import { loadData } from './core/storage.js';
import { createSeed } from './data/seed.js';

export const emptyBooking = () => ({
  step: 1,
  serviceId: '',
  date: '',
  time: '',
  name: '',
  phone: '',
  email: '',
  plate: '',
  model: '',
  year: '',
  notes: '',
  errors: {},
  alert: '',
  monthOffset: 0,
  done: null,
});

export const emptyContact = () => ({ name: '', phone: '', email: '', reason: '', message: '', consent: false, errors: {}, sent: false });

export const emptyReview = () => ({ name: '', rating: 5, text: '', errors: {}, sent: false });

export const emptyNewVehicle = () => ({ model: 'Clio', version: '', cond: 'Ocasión', fuel: 'Gasolina', year: '', km: '', price: '', errors: {} });

export const defaultFilters = (sort = 'price-asc') => ({ cond: 'Todos', model: '', fuel: '', price: '0', sort });

export const createInitialState = () => ({
  route: parseHash(),
  menuOpen: false,
  now: new Date(),
  data: loadData() ?? createSeed(),
  homeCond: 'Nuevo',
  filters: defaultFilters(),
  bk: emptyBooking(),
  modal: null,
  ct: emptyContact(),
  rv: emptyReview(),
  adminTab: 'citas',
  nc: emptyNewVehicle(),
});

export const activeServices = (data) => data.services.filter((s) => s.active);

export const visibleVehicles = (data) => data.vehicles.filter((v) => v.status !== 'Vendido');

export const serviceById = (data, id) => data.services.find((s) => s.id === id);
