'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import type { MobileNavProps } from '@/types/navigation';
import { useAuth } from '@/lib/auth';
import { Logo, UserAvatar } from '@/components/shared';
import { CloseIcon } from '@/components/icons';

/**
 * Mobile navigation drawer
 * Renders as slide-in panel from right side
 * Handles nested menu items with indentation
 */
export function MobileNav({ isOpen, onClose, items, currentPath }: MobileNavProps) {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    onClose();
  };

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
                        <Logo href={null} showText={false} size="sm" />
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
                        <CloseIcon className="h-6 w-6" />
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

                    {/* Auth Section */}
                    <div className="border-t border-gray-200 px-4 py-6 bg-gray-50">
                      {loading ? (
                        <div className="h-10 bg-gray-200 rounded animate-pulse" />
                      ) : user ? (
                        <div className="space-y-4">
                          {/* User Info */}
                          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                            <UserAvatar email={user.email} size="md" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          {/* Quick Links */}
                          <div className="space-y-1">
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-white transition-colors"
                              onClick={onClose}
                            >
                              <svg
                                className="w-5 h-5 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                                />
                              </svg>
                              Dashboard
                            </Link>
                            <Link
                              href="/documents"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-white transition-colors"
                              onClick={onClose}
                            >
                              <svg
                                className="w-5 h-5 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                              </svg>
                              My Documents
                            </Link>
                            <Link
                              href="/bots/create"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-white transition-colors"
                              onClick={onClose}
                            >
                              <svg
                                className="w-5 h-5 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                                />
                              </svg>
                              My Bots
                            </Link>
                            <Link
                              href="/profile"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-white transition-colors"
                              onClick={onClose}
                            >
                              <svg
                                className="w-5 h-5 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                />
                              </svg>
                              Profile
                            </Link>
                            <Link
                              href="/settings"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-white transition-colors"
                              onClick={onClose}
                            >
                              <svg
                                className="w-5 h-5 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Settings
                            </Link>
                          </div>

                          {/* Sign Out */}
                          <button
                            onClick={handleSignOut}
                            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                              />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <Link
                            href="/auth/signin"
                            className="flex-1 text-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                            onClick={onClose}
                          >
                            Login
                          </Link>
                          <Link
                            href="/auth/signup"
                            className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90"
                            onClick={onClose}
                          >
                            Register
                          </Link>
                        </div>
                      )}
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
