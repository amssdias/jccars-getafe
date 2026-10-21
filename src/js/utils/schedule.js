import { isoOf, pad, parseIso } from './format.js';

const toClock = (minutes) => `${Math.floor(minutes / 60)}:${pad(minutes % 60)}`;

// Franjas en minutos desde medianoche: L-V 9-14 y 16-19, sábado 9-14.
const openingSlots = (weekday) => {
  if (weekday >= 1 && weekday <= 5) return [[540, 840], [960, 1140]];
  if (weekday === 6) return [[540, 840]];
  return [];
};

export function openStatus(now) {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const slots = openingSlots(now.getDay());
  const open = slots.find(([start, end]) => minutes >= start && minutes < end);
  if (open) return { isOpen: true, text: `Abierto ahora, hasta las ${toClock(open[1])}` };
  const later = slots.find(([start]) => minutes < start);
  if (later) return { isOpen: false, text: `Cerrado. Abrimos hoy a las ${toClock(later[0])}` };
  return { isOpen: false, text: `Cerrado. Abrimos ${now.getDay() === 6 ? 'el lunes' : 'mañana'} a las 9:00` };
}

export function openingHours(now) {
  const weekday = now.getDay();
  return [
    { day: 'Lunes a viernes', time: '9:00-14:00 y 16:00-19:00', today: weekday >= 1 && weekday <= 5 },
    { day: 'Sábados', time: '9:00-14:00', today: weekday === 6 },
    { day: 'Domingos', time: 'Cerrado', today: weekday === 0 },
  ];
}

// Ocupación simulada y estable por día/hora para que la demo tenga huecos tachados.
const pseudoTaken = (key) => {
  let h = 7;
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) % 9973;
  return h % 5 === 0;
};

export function slotsFor(iso, bookings, now = new Date()) {
  const weekday = parseIso(iso).getDay();
  const times = [];
  const push = (hour, minute) => times.push(`${hour}:${pad(minute)}`);
  for (let hour = 9; hour < 14; hour += 1) {
    push(hour, 0);
    push(hour, 30);
  }
  if (weekday >= 1 && weekday <= 5) {
    for (let hour = 16; hour < 19; hour += 1) {
      push(hour, 0);
      push(hour, 30);
    }
  }

  const isToday = iso === isoOf(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return times.map((time) => {
    const [h, m] = time.split(':').map(Number);
    const past = isToday && h * 60 + m <= nowMinutes + 30;
    const booked = bookings.some((b) => b.date === iso && b.time === time && b.status !== 'Cancelada');
    return { time, disabled: past || booked || pseudoTaken(iso + time) };
  });
}

export function nextWorkingDay(from, offset) {
  const date = new Date(from);
  date.setDate(date.getDate() + offset);
  while (date.getDay() === 0) date.setDate(date.getDate() + 1);
  return isoOf(date);
}
