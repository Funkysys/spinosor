import '@testing-library/jest-dom';
import React from 'react';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock FormData
global.FormData = class FormData {
  constructor() {
    this.data = {};
  }
  
  append(key, value) {
    this.data[key] = value;
  }
  
  get(key) {
    return this.data[key];
  }
};

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />
}));

// Mock dynamic imports
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => null;
  DynamicComponent.displayName = 'DynamicComponent';
  return DynamicComponent;
});

// Mock window.URL.createObjectURL
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = jest.fn();
}

// Suppress React 18 console warnings
const originalError = console.error;
console.error = (...args) => {
  if (/Warning: ReactDOM.render is no longer supported in React 18./.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};
