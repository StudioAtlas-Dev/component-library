import '@testing-library/jest-dom';

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveStyleRule(property: string, value: string): R;
    }
  }
}
