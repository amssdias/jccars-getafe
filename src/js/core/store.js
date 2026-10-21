export function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => state,

    // `silent` actualiza el estado sin repintar: lo usan los campos de texto
    // para no perder el cursor en cada pulsación.
    setState(update, { silent = false } = {}) {
      const patch = typeof update === 'function' ? update(state) : update;
      state = { ...state, ...patch };
      if (!silent) listeners.forEach((listener) => listener(state));
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
