'use client';

import { Fragment, useRef } from 'react';
import Link from 'next/link';
import { Popover, Transition, Portal } from '@headlessui/react';
import type { NavItemProps } from '@/types/navigation';
import { MegaMenuPanel } from './MegaMenuPanel';

/**
 * Navigation item that renders as either:
 * - Simple link (no children)
 * - Megamenu dropdown (with children)
 * - CTA button (isButton: true)
 *
 * Uses Portal for proper overlay handling
 */
export function NavItem({ item, isActive, onNavigate }: NavItemProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calculate position dynamically on each render for reliable positioning
  const getDropdownStyle = () => {
    if (!buttonRef.current) return {};
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      position: 'fixed' as const,
      top: rect.bottom + 8,
      left: rect.left,
      zIndex: 9999,
    };
  };

  // CTA Button variant
  if (item.isButton) {
    return (
      <Link
        href={item.path}
        className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
      >
        {item.label}
      </Link>
    );
  }

  // Simple link (no children)
  if (!item.children || item.children.length === 0) {
    return (
      <Link
        href={item.path}
        className={`text-sm font-medium transition-colors ${
          isActive ? 'text-blue-600' : 'text-gray-600'
        } hover:text-blue-600`}
      >
        {item.label}
      </Link>
    );
  }

  // Megamenu dropdown
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            ref={buttonRef}
            className={`group inline-flex items-center gap-1 text-sm font-medium transition-colors focus:outline-none ${
              open || isActive ? 'text-blue-600' : 'text-gray-600'
            } hover:text-blue-600`}
          >
            {item.label}
            <ChevronIcon open={open} />
          </Popover.Button>

          <Portal>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                static
                style={getDropdownStyle()}
                className="w-screen max-w-2xl"
              >
                <MegaMenuPanel
                  items={item.children!}
                  config={item.megaMenu}
                  onNavigate={() => {
                    close();
                    onNavigate?.();
                  }}
                />
              </Popover.Panel>
            </Transition>
          </Portal>
        </>
      )}
    </Popover>
  );
}

/**
 * Chevron icon for dropdown indicator
 */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
