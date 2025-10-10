import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders field service app', () => {
  render(<App />);
  // The app shows a loading state initially, so test for that
  const loadingElement = screen.getByText(/loading/i);
  expect(loadingElement).toBeInTheDocument();
});

test('renders without crashing', () => {
  render(<App />);
  // Just test that the app renders without throwing an error
  expect(document.body).toBeInTheDocument();
});
