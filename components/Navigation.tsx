'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { NavItem, MobileNav } from './navigation';
import { menuItems, getNavItems, getButtonItems } from '@/data/menuItems';

/**
 * Main site navigation component
 * Renders desktop megamenu navigation and mobile drawer
 *
 * Architecture:
 * - NavItem: Handles individual nav items (links, dropdowns, buttons)
 * - MobileNav: Handles mobile drawer navigation
 * - menuItems: SSOT for navigation structure
 */
export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = getNavItems();
  const buttonItems = getButtonItems();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-8">
        <div className="flex-1 flex items-center space-x-8">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              isActive={pathname === item.path}
            />
          ))}
        </div>
        <div className="flex-shrink-0 flex items-center gap-3">
          {buttonItems.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              isActive={pathname === item.path}
            />
          ))}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="lg:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        items={menuItems}
        currentPath={pathname ?? ''}
      />
    </>
  );
}

/**
 * Hamburger menu icon
 */
function MenuIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
