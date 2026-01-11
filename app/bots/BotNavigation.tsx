'use client';

import React, { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { BotSwitcher, SiteMenuDropdown } from '@/components/navigation';
import { menuItems } from '@/data/menuItems';

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  section?: string;
}

interface BotNavigationProps {
  botSlug: string;
  botTitle: string;
  botEmoji: string;
  botDescription?: string;
  accentColor?: string;
  menuItems: MenuItem[];
  chatLink?: string;
  sections?: boolean;
}

/**
 * Reusable navigation component for bot detail pages
 */
const BotNavigation: React.FC<BotNavigationProps> = ({
  botSlug,
  botTitle,
  botEmoji,
  botDescription: _botDescription = '',
  accentColor = 'blue',
  menuItems: sectionMenuItems,
  chatLink,
  sections = true,
}) => {
  const _pathname = usePathname();
  const [activeSection, setActiveSection] = useState('');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter site nav items (exclude button items like "Contact Us")
  const siteNavItems = menuItems.filter(item => !item.isButton);

  // Handle scroll events to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine active section when sections are enabled
      if (sections) {
        const sectionIds = sectionMenuItems
          .filter(item => item.section)
          .map(item => item.section as string);

        // Find which section is currently in view
        const sectionElements = sectionIds
          .map(id => document.getElementById(id))
          .filter(Boolean);

        for (let i = sectionElements.length - 1; i >= 0; i--) {
          const section = sectionElements[i];
          if (section && section.getBoundingClientRect().top <= 300) {
            setActiveSection(section.id);
            break;
          }
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, sectionMenuItems, sections]);

  // Handle smooth scrolling when clicking a menu item
  const scrollToSection = (sectionId: string | undefined) => {
    if (!sectionId) return;

    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
      // Close mobile menu after clicking
      setIsMobileMenuOpen(false);
    }
  };

  const colorClasses = {
    blue: {
      logo: 'bg-blue-100',
      title: 'text-blue-900',
      active: 'text-blue-700 bg-blue-50',
      hover: 'hover:text-blue-700 hover:bg-blue-50',
      accent: 'bg-blue-600 hover:bg-blue-700',
      border: 'border-blue-300',
    },
    green: {
      logo: 'bg-green-100',
      title: 'text-green-900',
      active: 'text-green-700 bg-green-50',
      hover: 'hover:text-green-700 hover:bg-green-50',
      accent: 'bg-green-600 hover:bg-green-700',
      border: 'border-green-300',
    },
    indigo: {
      logo: 'bg-indigo-100',
      title: 'text-indigo-900',
      active: 'text-indigo-700 bg-indigo-50',
      hover: 'hover:text-indigo-700 hover:bg-indigo-50',
      accent: 'bg-indigo-600 hover:bg-indigo-700',
      border: 'border-indigo-300',
    },
    red: {
      logo: 'bg-red-100',
      title: 'text-red-900',
      active: 'text-red-700 bg-red-50',
      hover: 'hover:text-red-700 hover:bg-red-50',
      accent: 'bg-red-600 hover:bg-red-700',
      border: 'border-red-300',
    },
    amber: {
      logo: 'bg-amber-100',
      title: 'text-amber-900',
      active: 'text-amber-700 bg-amber-50',
      hover: 'hover:text-amber-700 hover:bg-amber-50',
      accent: 'bg-amber-600 hover:bg-amber-700',
      border: 'border-amber-300',
    },
  };

  // Get the appropriate color classes or default to blue
  const colors = colorClasses[accentColor as keyof typeof colorClasses] || colorClasses.blue;

  const navClasses = lastScrollY > 100
    ? 'bg-white shadow-md border-b border-gray-200'
    : 'bg-white border-b border-gray-200';

  return (
    <nav
      className={`transition-all duration-300 w-full py-3 fixed top-0 left-0 right-0 z-50 ${navClasses}`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Left side: Botsmann logo + divider + Bot Switcher */}
          <div className="flex items-center">
            {/* Botsmann 'B' logo - links to home */}
            <Link
              href="/"
              className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
              aria-label="Go to Botsmann home"
            >
              B
            </Link>

            {/* Vertical divider */}
            <div className="h-6 w-px bg-gray-300 mx-3" />

            {/* Bot Switcher dropdown */}
            <BotSwitcher
              currentBotSlug={botSlug}
              currentBotTitle={botTitle}
              currentBotEmoji={botEmoji}
              accentColor={accentColor}
            />
          </div>

          {/* Center: Desktop section navigation */}
          <div className="hidden md:flex md:space-x-1 items-center overflow-x-auto no-scrollbar">
            {sectionMenuItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.section)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center ${
                  activeSection === item.section
                    ? colors.active
                    : `text-gray-600 ${colors.hover}`
                } ${item.id === 'roadmap' ? `border ${colors.border}` : ''}`}
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right side: Site menu + Chat button */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop: Site menu dropdown */}
            <SiteMenuDropdown className="hidden md:block" />

            {/* Call-to-action button */}
            {chatLink && (
              <Link
                href={chatLink as Route}
                className={`px-4 py-2 ${colors.accent} text-white text-sm font-medium rounded-md transition-colors shadow-sm whitespace-nowrap`}
              >
                Open Chat
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* Mobile menu slide-in overlay */}
      <Transition.Root show={isMobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setIsMobileMenuOpen}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      {/* Header with Botsmann branding */}
                      <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm rounded-lg">
                            B
                          </div>
                          <Dialog.Title className="text-lg font-semibold text-gray-900">
                            Botsmann
                          </Dialog.Title>
                        </div>
                        <button
                          type="button"
                          className="rounded-md p-2 text-gray-400 hover:bg-white/50"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="sr-only">Close menu</span>
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Menu Items */}
                      <div className="flex-1 px-4 py-6">
                        <nav className="space-y-1">
                          {/* Home link */}
                          <Link
                            href="/"
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                          </Link>

                          {/* All Bots link */}
                          <Link
                            href="/bots"
                            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            All Bots
                          </Link>

                          <hr className="my-4 border-gray-200" />

                          {/* Site Navigation */}
                          <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Botsmann
                          </p>
                          {siteNavItems.map(item => (
                            <Link
                              key={item.label}
                              href={item.path}
                              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span>{item.label}</span>
                            </Link>
                          ))}

                          <hr className="my-4 border-gray-200" />

                          {/* Bot Section links */}
                          <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            {botTitle} Sections
                          </p>
                          {sectionMenuItems.map(item => (
                            <button
                              key={item.id}
                              onClick={() => scrollToSection(item.section)}
                              className={`w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                activeSection === item.section
                                  ? colors.active
                                  : `text-gray-700 hover:bg-gray-100`
                              }`}
                            >
                              {item.icon && <span className="mr-3 text-lg">{item.icon}</span>}
                              <span>{item.label}</span>
                            </button>
                          ))}

                          {chatLink && (
                            <>
                              <hr className="my-4 border-gray-200" />
                              <Link
                                href={chatLink as Route}
                                className={`w-full flex items-center justify-center px-4 py-3 ${colors.accent} text-white text-base font-medium rounded-md transition-colors`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                Open Chat
                              </Link>
                            </>
                          )}
                        </nav>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </nav>
  );
};

export default BotNavigation;
