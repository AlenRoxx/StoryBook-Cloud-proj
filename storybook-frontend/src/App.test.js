import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the storybook generator heading', () => {
  render(<App />);
  expect(screen.getByText(/AI Storybook Generator/i)).toBeInTheDocument();
});
