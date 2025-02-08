import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../../../components/Header';

describe('Header', () => {
  it('renders the logo text', () => {
    render(<Header />);
    expect(screen.getByText('Botsmann')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Header />);
    
    const links = [
      { text: 'Home', href: '/' },
      { text: 'About', href: '/about' },
      { text: 'Bots', href: '/bots' },
      { text: 'Blog', href: '/blog' },
    ];

    links.forEach(({ text, href }) => {
      const link = screen.getByText(text);
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', href);
    });
  });

  it('has correct styling classes', () => {
    render(<Header />);
    
    // Check header container
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('p-4', 'bg-gray-800', 'text-white');

    // Check navigation container
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('flex', 'justify-between', 'items-center', 'max-w-6xl', 'mx-auto');

    // Check logo
    const logo = screen.getByText('Botsmann');
    expect(logo).toHaveClass('text-xl', 'font-bold');

    // Check navigation links container
    const linksContainer = screen.getByRole('navigation').children[1];
    expect(linksContainer).toHaveClass('space-x-4');
  });

  it('has hover styles on navigation links', () => {
    render(<Header />);
    
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveClass('hover:text-gray-300');
    });
  });
});
