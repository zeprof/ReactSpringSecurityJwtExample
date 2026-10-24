import { beforeAll, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Initialize localStorage if it doesn't exist (for happy-dom environment)
beforeAll(() => {
  if (!globalThis.localStorage) {
    const store = {};
    globalThis.localStorage = {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = value; },
      removeItem: (key) => { delete store[key]; },
      clear: () => {
        for (const key in store) {
          delete store[key];
        }
      },
      key: (index) => Object.keys(store)[index] || null,
      length: Object.keys(store).length,
    };
  }
});
