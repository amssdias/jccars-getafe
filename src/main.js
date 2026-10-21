// Solo el subconjunto latino: la web está en español y así no se incrustan los demás alfabetos.
import '@fontsource/geist-sans/latin-400.css';
import '@fontsource/geist-sans/latin-500.css';
import '@fontsource/geist-sans/latin-600.css';
import '@fontsource/geist-mono/latin-400.css';
import '@fontsource/geist-mono/latin-500.css';
import './styles/main.scss';
import { createApp } from './js/app.js';

createApp(document.getElementById('app'));
