import { onlyDigits } from './format.js';

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const isPhone = (value) => onlyDigits(value).length === 9;

export const isFilled = (value) => value.trim().length > 0;

export const hasErrors = (errors) => Object.values(errors).some(Boolean);
