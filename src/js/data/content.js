export const CONTACT = {
  phone: '637 203 671',
  phoneHref: 'tel:+34637203671',
  whatsappNumber: '34647637566',
  whatsappLabel: '647 637 566',
  email: 'jccarsgetafe@gmail.com',
  address: 'C/ Ferrocarril 15, 28901 Getafe, Madrid',
  addressShort: 'C/ Ferrocarril 15, 28901 Getafe',
  instagram: 'https://www.instagram.com/jccarsgetafe/',
  instagramHandle: '@jccarsgetafe',
  mapEmbed: 'https://maps.google.com/maps?q=Calle%20Ferrocarril%2015%2C%2028901%20Getafe&z=16&output=embed',
};

export const whatsappLink = (text) => `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`;

export const NAV_LINKS = [
  { page: 'servicios', label: 'Servicios' },
  { page: 'vehiculos', label: 'Vehículos' },
  { page: 'nosotros', label: 'Nosotros' },
  { page: 'opiniones', label: 'Opiniones' },
  { page: 'contacto', label: 'Contacto' },
];

export const MODELS = [
  'Clio',
  'Captur',
  'Megane',
  'Austral',
  'Arkana',
  'Symbioz',
  'Scenic',
  'Renault 5',
  'Kangoo',
  'Kadjar',
  'Twingo',
  'Otro',
];

export const FUELS = ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP'];

export const ADVANTAGES = [
  { icon: 'badge-check', title: 'Especialistas Renault', text: 'Equipo de diagnosis específico y técnicos que conocen cada modelo.' },
  { icon: 'receipt', title: 'Presupuesto cerrado', text: 'Sabes lo que vas a pagar antes de que toquemos el coche.' },
  { icon: 'video', title: 'Vídeo de cada reparación', text: 'Te enseñamos lo que hemos cambiado y por qué.' },
  { icon: 'shield-check', title: '12 meses de garantía', text: 'En reparaciones y en todos los vehículos de ocasión.' },
];

export const TEAM = [
  { id: 'jose', name: 'José', role: 'Jefe de taller', text: 'Más de veinte años con Renault. Se encarga de la diagnosis y te la explica sin tecnicismos.' },
  { id: 'julio', name: 'Julio', role: 'Venta de vehículos', text: 'Te asesora en la compra, la tasación de tu coche y la financiación.' },
  { id: 'adrian', name: 'Adrián', role: 'Técnico E-Tech', text: 'Formado en híbridos y eléctricos de alta tensión.' },
  { id: 'lucia', name: 'Lucía', role: 'Recepción y citas', text: 'Organiza las citas y te avisa en cuanto el coche está listo.' },
];

export const HISTORY = [
  { year: '2008', title: 'Abrimos en Getafe', text: 'Un pequeño taller de mecánica general en la calle Ferrocarril.' },
  { year: '2014', title: 'Especialistas Renault', text: 'Nos centramos en la marca e invertimos en equipo de diagnosis específico.' },
  { year: '2019', title: 'Venta de vehículos', text: 'Empezamos a vender Renault de ocasión revisados en nuestro propio taller.' },
  { year: '2025', title: 'Área E-Tech', text: 'Nueva zona para híbridos y eléctricos, con técnicos certificados.', highlight: true },
];

export const CONTACT_REASONS = [
  'Cita en el taller',
  'Presupuesto de reparación',
  'Compra de un vehículo',
  'Vender o tasar mi coche',
  'Otro',
];

export const INSTALLATIONS = [
  { photo: 'installationLift', caption: 'Zona de taller con cuatro elevadores.' },
  { photo: 'installationDiagnosis', caption: 'Diagnosis con equipo específico Renault.' },
  { photo: 'installationShowroom', caption: 'Exposición de vehículos nuevos y de ocasión.' },
];
