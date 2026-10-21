import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  Car,
  CarFront,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleDot,
  ClipboardCheck,
  Clock,
  Disc,
  Droplet,
  Inbox,
  ListChecks,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Receipt,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Snowflake,
  Tag,
  Trash,
  Video,
  Wrench,
  X,
} from 'lucide';
import { escapeHtml, raw } from './html.js';

// Lucide 1.x ya no incluye logos de marcas; este es el trazo clásico de Instagram.
const Instagram = [
  ['rect', { x: '2', y: '2', width: '20', height: '20', rx: '5', ry: '5' }],
  ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' }],
  ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5' }],
];

const ICONS = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'badge-check': BadgeCheck,
  'battery-charging': BatteryCharging,
  'calendar-check': CalendarCheck,
  'calendar-clock': CalendarClock,
  'calendar-days': CalendarDays,
  car: Car,
  'car-front': CarFront,
  check: Check,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'circle-alert': CircleAlert,
  'circle-check': CircleCheck,
  'circle-dot': CircleDot,
  'clipboard-check': ClipboardCheck,
  clock: Clock,
  disc: Disc,
  droplet: Droplet,
  inbox: Inbox,
  instagram: Instagram,
  'list-checks': ListChecks,
  mail: Mail,
  'map-pin': MapPin,
  menu: Menu,
  'message-circle': MessageCircle,
  phone: Phone,
  plus: Plus,
  receipt: Receipt,
  'rotate-ccw': RotateCcw,
  'scan-line': ScanLine,
  'shield-check': ShieldCheck,
  snowflake: Snowflake,
  tag: Tag,
  trash: Trash,
  video: Video,
  wrench: Wrench,
  x: X,
};

const renderNode = ([tag, attrs]) =>
  `<${tag} ${Object.entries(attrs)
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(' ')}/>`;

export function icon(name, { className = '', label } = {}) {
  const node = ICONS[name];
  if (!node) throw new Error(`Icono desconocido: ${name}`);
  const a11y = label ? `role="img" aria-label="${escapeHtml(label)}"` : 'aria-hidden="true"';
  return raw(
    `<svg class="lucide ${className}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" ${a11y}>${node.map(renderNode).join('')}</svg>`,
  );
}
