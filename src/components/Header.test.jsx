import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the name and tagline', () => {
    render(<Header />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('SCOTT TWEDE');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('UX');
  });

  it('renders the bolt icon with alt text', () => {
    render(<Header />);
    expect(screen.getByAltText('🗲')).toBeInTheDocument();
  });
});
