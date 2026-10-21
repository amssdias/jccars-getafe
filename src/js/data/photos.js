// Fotos de Unsplash enlazadas a su CDN (hotlinking, como piden sus directrices).
// `author`/`username` alimentan la página de créditos.
const photo = (id, alt, author, username) => ({ id, alt, author, username });

export const PHOTOS = {
  hero: photo('photo-1625047509248-ec889cbff17f', 'Mecánico revisando el motor de un coche', 'Kate Ibragimova', 'kateibragimova'),
  about: photo('photo-1599256872237-5dcc0fbe9668', 'Trabajo en el taller', 'Nina Mercado', 'nina_mercado'),

  serviceMant: photo('photo-1711386689622-1cda23e10217', 'Mecánico trabajando en un coche en el taller', 'Joseph Pillado', 'rvisionmedia'),
  serviceAceite: photo('photo-1487754180451-c456f719a1fc', 'Rellenando aceite de motor', 'Tim Mossholder', 'timmossholder'),
  serviceDiag: photo('photo-1658351354155-e854d19233e0', 'Equipo de diagnosis conectado a un coche', 'Peter Poluch', 'peter85'),
  serviceFrenos: photo('photo-1696494561430-de087dd0bd69', 'Disco y pinza de freno', 'Toby Hall', 'toby_hall28'),
  serviceNeumaticos: photo('photo-1645445522156-9ac06bc7a767', 'Mecánico cambiando un neumático', 'Jimmy Nilsson Masth', 'jimmynilssonmasth'),
  serviceItv: photo('photo-1616761879141-f485e5fed5df', 'Faros de un coche encendidos', 'Douglas Fehr', 'roninfehr'),
  serviceMecanica: photo('photo-1619642751034-765dfdf7c58e', 'Manos con llave trabajando en un motor', 'Christian Buehner', 'christianbuehner'),
  serviceClima: photo('photo-1542399204-b8dd4af5113d', 'Salida de aire acondicionado de un coche', 'Olav Tvedt', 'olav_tvedt'),
  serviceEtech: photo('photo-1593941707874-ef25b8b4a92b', 'Cable de carga conectado a un coche eléctrico', 'CHUTTERSNAP', 'chuttersnap'),

  teamJose: photo('photo-1664263706365-a5512e38be67', 'Mecánico revisando los bajos de un coche', 'Jimmy Nilsson Masth', 'jimmynilssonmasth'),
  teamJulio: photo('photo-1504222490345-c075b6008014', 'Hombre abriendo el maletero de un coche', 'Quilia', 'heyquilia'),
  teamAdrian: photo('photo-1599474151975-1f978922fa02', 'Técnico sentado en el taller', 'Enis Yavuz', 'enisyavuz'),
  teamLucia: photo('photo-1687462970787-61d953508926', 'Mujer con una llave inglesa en el taller', 'Darren Richardson', 'campfire_guy'),

  installationLift: photo('photo-1791419542289-693087bd1044', 'Coche sobre un elevador hidráulico', 'SL Autowerkes', 'slautowerkes'),
  installationDiagnosis: photo('photo-1727893372771-b4ccae9b9f0b', 'Técnico con un portátil dentro de un coche', 'Mehmet Talha Onuk', 'mtonuk'),
  installationShowroom: photo('photo-1777175013302-eaf4b3ef785a', 'Coches nuevos en una exposición', 'Portafolio fotográfico automotriz', 'portafoliofotograficoautomotriz'),

  clioBlack: photo('photo-1666335009164-2597314da8e7', 'Renault Clio negro aparcado', 'Samy Mounichy', 'smithers131'),
  clioBlackSide: photo('photo-1666335009171-3ddc17937d6d', 'Renault Clio negro en un aparcamiento', 'Samy Mounichy', 'smithers131'),
  clioBlackRear: photo('photo-1666335009169-a9505c436d80', 'Renault Clio negro visto de lado', 'Samy Mounichy', 'smithers131'),
  clioAutumn: photo('photo-1605527072515-18d80e1433f5', 'Renault Clio en una carretera de otoño', 'RAIS', 'ghaitharst'),
  capturRed: photo('photo-1603233740324-f83f85fa0f08', 'Frontal de un Renault Captur rojo', 'Benjamin', 'pieter_benjamin'),
  capturWheel: photo('photo-1603116962580-c52ff4a2cf5a', 'Volante de un Renault Captur', 'Benjamin', 'pieter_benjamin'),
  capturMirror: photo('photo-1603116901496-9a10fe5fd7e5', 'Retrovisor de un Renault Captur', 'Benjamin', 'pieter_benjamin'),
  renaultBlack: photo('photo-1563455762146-d91d5ac83925', 'Renault compacto negro en carretera', 'Marcel Pirnay', 'marcel_'),
  meganeYellow: photo('photo-1679398175192-92238aac595b', 'Frontal de un Renault Megane amarillo', 'Marcel Hoberg', 'marcelhoberg'),
  blueRoad: photo('photo-1706283552448-d003e67e808b', 'Coche azul en una carretera junto al bosque', 'Mathew Antony', 'martuflex'),
  blueYellowRoad: photo('photo-1706283559385-83714a124439', 'Coche azul y amarillo en carretera', 'Mathew Antony', 'martuflex'),
  blueDark: photo('photo-1733028612453-e28160e2c271', 'Coche azul con fondo oscuro', 'Lukáš Parničan', 'lukasparnican'),
  garageCar: photo('photo-1669881241759-613659cd3c54', 'Coche aparcado en un garaje', 'Václav Pechar', 'venajeborec'),
  evCharging: photo('photo-1593941707882-a5bba14938c7', 'Coche eléctrico cargando', 'CHUTTERSNAP', 'chuttersnap'),
  showroomRed: photo('photo-1643142314913-0cf633d9bbb5', 'Coche rojo en un concesionario', 'Crosby Hinze', 'crosbyhinze'),
  interior: photo('photo-1658285226355-7490109e090f', 'Salpicadero de un coche', 'Mark Chan', 'markcjn'),
  dashboard: photo('photo-1611099711902-1228419f7113', 'Cuadro de instrumentos', 'Danny Sleeuwenhoek', 'sl33vo'),
  trunk: photo('photo-1688054004445-7c9108eb4005', 'Coche con el maletero abierto', 'Martin Baron', 'elmartinbaron'),
};

export const SERVICE_PHOTOS = {
  mant: 'serviceMant',
  aceite: 'serviceAceite',
  diag: 'serviceDiag',
  frenos: 'serviceFrenos',
  neumaticos: 'serviceNeumaticos',
  itv: 'serviceItv',
  mecanica: 'serviceMecanica',
  clima: 'serviceClima',
  etech: 'serviceEtech',
};

export const TEAM_PHOTOS = {
  jose: 'teamJose',
  julio: 'teamJulio',
  adrian: 'teamAdrian',
  lucia: 'teamLucia',
};

const GENERIC_GALLERY = ['interior', 'dashboard', 'trunk'];

// Foto principal + tres de galería por vehículo. Los que se añaden desde el
// panel de administración caen en la foto genérica de concesionario.
const VEHICLE_PHOTOS = {
  'n-clio': ['clioBlack', 'clioBlackSide', 'clioBlackRear', 'interior'],
  'n-captur': ['capturRed', 'capturWheel', 'capturMirror', 'trunk'],
  'n-austral': ['blueYellowRoad', ...GENERIC_GALLERY],
  'n-r5': ['evCharging', ...GENERIC_GALLERY],
  'n-symbioz': ['blueRoad', ...GENERIC_GALLERY],
  'u-clio': ['clioAutumn', ...GENERIC_GALLERY],
  'u-captur': ['renaultBlack', ...GENERIC_GALLERY],
  'u-megane': ['meganeYellow', ...GENERIC_GALLERY],
  'u-arkana': ['blueDark', ...GENERIC_GALLERY],
  'u-kadjar': ['garageCar', ...GENERIC_GALLERY],
};

export const vehiclePhotos = (vehicleId) => VEHICLE_PHOTOS[vehicleId] ?? ['showroomRed', ...GENERIC_GALLERY];

export const allCredits = () => {
  const seen = new Map();
  Object.values(PHOTOS).forEach((p) => {
    if (!seen.has(p.id)) seen.set(p.id, p);
  });
  return [...seen.values()];
};
