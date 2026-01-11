'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import type { MobileNavProps } from '@/types/navigation';

/**
 * Mobile navigation drawer
 * Renders as slide-in panel from right side
 * Handles nested menu items with indentation
 */
export function MobileNav({ isOpen, onClose, items, currentPath }: MobileNavProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
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
          <div className="fixed inset-0 bg-gray-900/50 transition-opacity" />
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
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm rounded-lg">
                          B
                        </div>
                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                          Menu
                        </Dialog.Title>
                      </div>
                      <button
                        type="button"
                        className="rounded-md p-2 text-gray-400 hover:bg-white/50"
                        onClick={onClose}
                      >
                        <span className="sr-only">Close menu</span>
                        <CloseIcon />
                      </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 px-4 py-6">
                      <nav className="space-y-1">
                        {items.map((item) => (
                          <div key={item.label}>
                            {/* Parent Item */}
                            <Link
                              href={item.path}
                              className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                currentPath === item.path
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'text-gray-700 hover:bg-gray-100'
                              } ${item.isButton ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90' : ''}`}
                              onClick={onClose}
                            >
                              {item.label}
                            </Link>

                            {/* Child Items */}
                            {item.children && item.children.length > 0 && (
                              <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.label}
                                    href={child.path}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                                    onClick={onClose}
                                  >
                                    {child.icon && <span className="text-lg">{child.icon}</span>}
                                    <span>{child.label}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
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
  );
}

/**
 * Close (X) icon for mobile menu
 */
function CloseIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
