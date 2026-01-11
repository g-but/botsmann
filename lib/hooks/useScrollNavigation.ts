'use client';

import { useState, useEffect, useCallback } from 'react';
import type { BotMenuItem } from '@/types/bot';

interface UseScrollNavigationOptions {
  /** Menu items containing section IDs */
  menuItems: BotMenuItem[];
  /** Offset from top of viewport for active section detection */
  scrollOffset?: number;
  /** Whether section tracking is enabled */
  enabled?: boolean;
}

interface UseScrollNavigationReturn {
  /** Currently active section ID */
  activeSection: string;
  /** Current scroll position */
  scrollY: number;
  /** Whether page has been scrolled past threshold */
  isScrolled: boolean;
  /** Scroll to a specific section with smooth animation */
  scrollToSection: (sectionId: string | undefined) => void;
  /** Set active section manually */
  setActiveSection: (sectionId: string) => void;
}

/**
 * Hook for managing scroll-based navigation on bot pages
 * Handles active section detection and smooth scrolling
 *
 * @example
 * ```tsx
 * const { activeSection, scrollToSection, isScrolled } = useScrollNavigation({
 *   menuItems: botNavConfig.menuItems,
 *   scrollOffset: 300,
 * });
 * ```
 */
export const useScrollNavigation = ({
  menuItems,
  scrollOffset = 300,
  enabled = true,
}: UseScrollNavigationOptions): UseScrollNavigationReturn => {
  const [activeSection, setActiveSection] = useState('');
  const [scrollY, setScrollY] = useState(0);

  // Determine if page has been scrolled past threshold (for nav styling)
  const isScrolled = scrollY > 100;

  // Handle scroll events to track active section
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Get section IDs from menu items
      const sectionIds = menuItems
        .filter(item => item.section)
        .map(item => item.section as string);

      // Find section elements
      const sectionElements = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

      // Determine which section is in view (check from bottom to top)
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section && section.getBoundingClientRect().top <= scrollOffset) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuItems, scrollOffset, enabled]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string | undefined) => {
    if (!sectionId) return;

    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
    }
  }, []);

  return {
    activeSection,
    scrollY,
    isScrolled,
    scrollToSection,
    setActiveSection,
  };
};
