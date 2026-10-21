const STORAGE_KEY = 'jccars-getafe-demo';

// localStorage puede no estar disponible (modo privado, cookies bloqueadas):
// la web sigue funcionando con los datos de ejemplo en memoria.
export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data?.services && data?.vehicles ? data : null;
  } catch {
    return null;
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* sin persistencia */
  }
}

export function clearData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* sin persistencia */
  }
}
