import type { MenuItem } from '@/types/navigation';
import type { Route } from 'next';

/**
 * Main site navigation menu items
 * SSOT for navigation structure across desktop and mobile
 *
 * Botsmann: Your Private AI Professionals
 * - AI Professionals (specialized advisors)
 * - Enterprise (for businesses)
 * - About
 */
export const menuItems: MenuItem[] = [
  {
    label: 'Professionals',
    path: '/professionals' as Route,
    children: [
      {
        label: 'All Professionals',
        path: '/professionals' as Route,
        description: 'Browse all AI professionals.',
        icon: '👥',
      },
      {
        label: 'Dr. Lex (Legal)',
        path: '/professionals/legal' as Route,
        description: 'AI legal advisor for contracts and legal questions.',
        icon: '⚖️',
      },
      {
        label: 'Dr. Imhotep (Health)',
        path: '/professionals/health' as Route,
        description: 'AI health advisor for wellness guidance.',
        icon: '⚕️',
      },
      {
        label: 'Prof. Nerd (Research)',
        path: '/professionals/research' as Route,
        description: 'AI research assistant for academic work.',
        icon: '🔬',
      },
      {
        label: 'Heidi (Language)',
        path: '/professionals/language' as Route,
        description: 'AI language coach for German learning.',
        icon: '🇨🇭',
      },
      {
        label: 'Artr (Creative)',
        path: '/professionals/creative' as Route,
        description: 'AI creative advisor for artistic projects.',
        icon: '🎨',
      },
      {
        label: 'Trident (Business)',
        path: '/professionals/business' as Route,
        description: 'AI business strategist for planning.',
        icon: '🔱',
      },
    ],
    megaMenu: {
      columns: 2,
      header: {
        title: 'AI Professionals',
        subtitle: 'Expert advisors for every need',
        gradient: 'bg-gradient-to-r from-blue-50 to-purple-50',
      },
    },
  },
  {
    label: 'Enterprise',
    path: '/enterprise' as Route,
  },
  {
    label: 'About',
    path: '/about' as Route,
  },
  {
    label: 'Get Started',
    path: '/professionals' as Route,
    isButton: true,
  },
];

/**
 * Get menu items without button items (for desktop nav)
 */
export const getNavItems = () => menuItems.filter((item) => !item.isButton);

/**
 * Get button items only (for CTA section)
 */
export const getButtonItems = () => menuItems.filter((item) => item.isButton);
