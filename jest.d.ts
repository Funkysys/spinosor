import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}
