import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../../components/Footer';

describe('Footer', () => {
  beforeEach(() => {
    // Mock current year for consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders copyright text with current year', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2024 Botsmann\. All rights reserved\./)).toBeInTheDocument();
  });

  it('renders all footer links', () => {
    render(<Footer />);
    
    const links = [
      { text: 'Privacy', href: '/privacy' },
      { text: 'Terms', href: '/terms' },
      { text: 'Contact', href: '/contact' },
    ];

    links.forEach(({ text, href }) => {
      const link = screen.getByText(text);
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', href);
    });
  });

  it('has correct styling classes', () => {
    render(<Footer />);
    
    // Check footer container
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('p-4', 'bg-gray-800', 'text-white', 'mt-auto');

    // Check content container
    const container = footer.firstElementChild;
    expect(container).toHaveClass('max-w-6xl', 'mx-auto', 'flex', 'justify-between', 'items-center');

    // Check links container
    const linksContainer = screen.getByRole('navigation');
    expect(linksContainer).toHaveClass('space-x-4');
  });

  it('has hover styles on footer links', () => {
    render(<Footer />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass('hover:text-gray-300');
    });
  });
});
