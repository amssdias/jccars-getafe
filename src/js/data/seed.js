import { nextWorkingDay } from '../utils/schedule.js';

// Datos de ejemplo de la demo. El panel de administración los modifica y se
// guardan en localStorage; "Restablecer" vuelve a este estado.
export function createSeed(today = new Date()) {
  const day = (offset) => nextWorkingDay(today, offset);

  return {
    services: [
      { id: 'mant', icon: 'clipboard-check', name: 'Mantenimiento oficial Renault', text: 'Revisiones según el plan del fabricante, con recambios de calidad original y sello en el libro.', price: 129, duration: 90, active: true },
      { id: 'aceite', icon: 'droplet', name: 'Cambio de aceite y filtros', text: 'Aceite homologado por Renault para tu motor y filtros de aceite, aire y habitáculo.', price: 69, duration: 45, active: true },
      { id: 'diag', icon: 'scan-line', name: 'Diagnosis electrónica', text: 'Lectura de centralitas con equipo específico Renault y explicación clara de cada fallo.', price: 39, duration: 30, active: true },
      { id: 'frenos', icon: 'disc', name: 'Frenos', text: 'Pastillas, discos y líquido de frenos. Revisamos el sistema en cada visita.', price: 89, duration: 60, active: true },
      { id: 'neumaticos', icon: 'circle-dot', name: 'Neumáticos', text: 'Montaje, equilibrado y alineado con las principales marcas.', price: 25, duration: 45, active: true },
      { id: 'itv', icon: 'badge-check', name: 'Revisión pre-ITV', text: 'Comprobamos todo lo que mira la ITV para que pases a la primera.', price: 35, duration: 40, active: true },
      { id: 'mecanica', icon: 'wrench', name: 'Mecánica general', text: 'Motor, distribución, embrague, suspensión y dirección de cualquier Renault.', price: 45, duration: 60, active: true },
      { id: 'clima', icon: 'snowflake', name: 'Aire acondicionado', text: 'Carga de gas, detección de fugas y limpieza del circuito.', price: 59, duration: 45, active: true },
      { id: 'etech', icon: 'battery-charging', name: 'Híbridos y eléctricos E-Tech', text: 'Mantenimiento de la gama E-Tech con técnicos formados en alta tensión.', price: 99, duration: 60, active: true },
    ],
    vehicles: [
      { id: 'n-clio', cond: 'Nuevo', model: 'Clio', version: 'Techno TCe 90', year: 2026, km: 0, fuel: 'Gasolina', gear: 'Manual', hp: 90, price: 19990, label: 'C', color: 'Gris Schiste', status: 'Disponible', features: ['Pantalla multimedia de 9,3 pulgadas', 'Navegador con Google integrado', 'Cámara de visión trasera', 'Climatizador automático', 'Faros full LED', 'Llantas de aleación de 17 pulgadas'] },
      { id: 'n-captur', cond: 'Nuevo', model: 'Captur', version: 'Techno E-Tech full hybrid 145', year: 2026, km: 0, fuel: 'Híbrido', gear: 'Automático', hp: 145, price: 27450, label: 'ECO', color: 'Azul Iron', status: 'Disponible', features: ['Etiqueta ECO', 'Banqueta trasera deslizante', 'Cargador inalámbrico', 'Control de crucero adaptativo', 'Sensores de aparcamiento delanteros y traseros', 'Pantalla de 10,4 pulgadas'] },
      { id: 'n-austral', cond: 'Nuevo', model: 'Austral', version: 'Techno E-Tech full hybrid 200', year: 2026, km: 0, fuel: 'Híbrido', gear: 'Automático', hp: 200, price: 36900, label: 'ECO', color: 'Blanco Nacarado', status: 'Disponible', features: ['Pantalla OpenR de 12 pulgadas', 'Asistente de conducción en autopista', 'Head-up display', 'Asientos delanteros calefactables', 'Portón eléctrico', 'Audio Harman Kardon'] },
      { id: 'n-r5', cond: 'Nuevo', model: 'Renault 5', version: 'E-Tech eléctrico 150 cv', year: 2026, km: 0, fuel: 'Eléctrico', gear: 'Automático', hp: 150, price: 32990, label: '0', color: 'Amarillo Pop', status: 'Reservado', features: ['Etiqueta CERO', 'Autonomía de hasta 410 km (WLTP)', 'Carga rápida en corriente continua', 'Bomba de calor', 'Pantalla OpenR Link', 'Planificador de rutas con puntos de carga'] },
      { id: 'n-symbioz', cond: 'Nuevo', model: 'Symbioz', version: 'Evolution E-Tech full hybrid 145', year: 2026, km: 0, fuel: 'Híbrido', gear: 'Automático', hp: 145, price: 29600, label: 'ECO', color: 'Gris Rafale', status: 'Disponible', features: ['Etiqueta ECO', 'Maletero de hasta 624 litros', 'Banqueta trasera deslizante', 'Cámara 360 grados', 'Climatizador bizona', 'Llantas de 18 pulgadas'] },
      { id: 'u-clio', cond: 'Ocasión', model: 'Clio', version: 'Zen TCe 90', year: 2021, km: 39800, fuel: 'Gasolina', gear: 'Manual', hp: 90, price: 12300, label: 'C', color: 'Rojo Flame', status: 'Disponible', features: ['Un solo propietario', 'Libro de mantenimiento sellado', 'Pantalla multimedia con Android Auto y CarPlay', 'Sensores de aparcamiento traseros', 'Limitador y regulador de velocidad'] },
      { id: 'u-captur', cond: 'Ocasión', model: 'Captur', version: 'Intens TCe 100 GLP', year: 2020, km: 58200, fuel: 'GLP', gear: 'Manual', hp: 100, price: 14900, label: 'ECO', color: 'Naranja Atacama', status: 'Disponible', features: ['Etiqueta ECO', 'Bifuel gasolina y GLP', 'Cámara de visión trasera', 'Navegador', 'Climatizador automático'] },
      { id: 'u-megane', cond: 'Ocasión', model: 'Megane', version: 'Limited Blue dCi 115', year: 2019, km: 92400, fuel: 'Diésel', gear: 'Manual', hp: 115, price: 12800, label: 'C', color: 'Gris Titanio', status: 'Disponible', features: ['Distribución cambiada en JC Cars', 'Navegador R-Link 2', 'Tarjeta manos libres', 'Llantas de 16 pulgadas', 'Climatizador bizona'] },
      { id: 'u-arkana', cond: 'Ocasión', model: 'Arkana', version: 'Techno E-Tech 145', year: 2022, km: 31500, fuel: 'Híbrido', gear: 'Automático', hp: 145, price: 22400, label: 'ECO', color: 'Negro Estrella', status: 'Disponible', features: ['Etiqueta ECO', 'Garantía oficial vigente hasta 2027', 'Pantalla vertical de 9,3 pulgadas', 'Control de crucero adaptativo', 'Asientos calefactables'] },
      { id: 'u-kadjar', cond: 'Ocasión', model: 'Kadjar', version: 'Zen Blue dCi 115', year: 2019, km: 88000, fuel: 'Diésel', gear: 'Manual', hp: 115, price: 15300, label: 'C', color: 'Azul Cosmos', status: 'Disponible', features: ['Libro de mantenimiento sellado', 'Navegador', 'Sensores delanteros y traseros', 'Barras de techo', 'Neumáticos nuevos'] },
    ],
    bookings: [
      { id: 'JC-4821', serviceId: 'aceite', date: day(1), time: '9:30', name: 'Lucía Fernández', phone: '612 448 903', email: 'lucia.f@example.com', plate: '4821 KLM', model: 'Captur', year: '2020', notes: '', status: 'Confirmada', created: 'Ayer' },
      { id: 'JC-4836', serviceId: 'diag', date: day(2), time: '16:30', name: 'Andrés Molina', phone: '655 107 284', email: 'amolina@example.com', plate: '7710 JHB', model: 'Megane', year: '2017', notes: 'Testigo de motor encendido', status: 'Pendiente', created: 'Hoy' },
      { id: 'JC-4840', serviceId: 'itv', date: day(4), time: '11:00', name: 'Rocío Paredes', phone: '699 321 570', email: 'rocio.p@example.com', plate: '2093 LCD', model: 'Clio', year: '2019', notes: '', status: 'Pendiente', created: 'Hoy' },
    ],
    leads: [
      { id: 'L1', type: 'Prueba de conducción', name: 'Sergio Navas', contact: '634 882 015, snavas@example.com', subject: 'Renault Austral Techno E-Tech full hybrid 200', message: 'Me gustaría probarlo el sábado por la mañana.', created: 'Hoy, 10:12', status: 'Nueva' },
      { id: 'L2', type: 'Contacto', name: 'Elena Ruiz', contact: '622 570 931, elena.ruiz@example.com', subject: 'Vender o tasar mi coche', message: 'Tengo un Scenic de 2016 y quiero saber cuánto me daríais.', created: 'Ayer, 18:40', status: 'Atendida' },
    ],
    reviews: [
      { id: 'r1', name: 'Marta G.', rating: 5, service: 'Mantenimiento oficial Renault', date: 'Octubre 2026', text: 'Me explicaron cada punto de la revisión y me mandaron vídeo del cambio de pastillas. Precio cerrado, sin sorpresas.' },
      { id: 'r2', name: 'Raúl P.', rating: 5, service: 'Compra de un Captur de ocasión', date: 'Septiembre 2026', text: 'El coche estaba impecable y me lo entregaron con la ITV recién pasada. Muy transparentes con el historial.' },
      { id: 'r3', name: 'Nuria S.', rating: 4, service: 'Diagnosis electrónica', date: 'Septiembre 2026', text: 'Encontraron en media hora un fallo que en otro taller no veían. Tuve que esperar un día por la pieza.' },
      { id: 'r4', name: 'Javier M.', rating: 5, service: 'Cambio de aceite y filtros', date: 'Agosto 2026', text: 'Reservé por la web a las once de la noche y a las nueve del día siguiente ya estaba dentro. Rápido y amables.' },
      { id: 'r5', name: 'Carmen L.', rating: 5, service: 'Frenos', date: 'Julio 2026', text: 'Me dijeron qué era urgente y qué podía esperar. Eso no te lo dice todo el mundo.' },
      { id: 'r6', name: 'Óscar T.', rating: 5, service: 'Prueba de un Austral', date: 'Julio 2026', text: 'Me dejaron probar el Austral con calma y sin presión. Al final me lo llevé.' },
      { id: 'r7', name: 'Pilar R.', rating: 4, service: 'Aire acondicionado', date: 'Junio 2026', text: 'Buen trabajo y buen precio. La recepción a primera hora estaba algo llena.' },
      { id: 'r8', name: 'Daniel C.', rating: 5, service: 'Revisión pre-ITV', date: 'Mayo 2026', text: 'Pasé la ITV a la primera después de la revisión. Volveré seguro.' },
    ],
  };
}
