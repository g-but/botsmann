import type { MenuItem } from '@/types/navigation';
import type { Route } from 'next';

/**
 * Main site navigation menu items
 * SSOT for navigation structure across desktop and mobile
 *
 * Botsmann: Private AI that works with YOUR data
 * - Pre-built Assistants (themed AI systems)
 * - Custom Documents (bring your own data)
 */
export const menuItems: MenuItem[] = [
  {
    label: 'Assistants',
    path: '/bots' as Route,
    children: [
      {
        label: 'Legal Expert (Lex)',
        path: '/bots/legal-expert' as Route,
        description: 'AI-powered legal document analysis and insights.',
        icon: '⚖️',
      },
      {
        label: 'Medical Expert (Imhotep)',
        path: '/bots/medical-expert' as Route,
        description: 'Evidence-based medical data analysis.',
        icon: '⚕️',
      },
      {
        label: 'Research Assistant (Nerd)',
        path: '/bots/research-assistant' as Route,
        description: 'Organize papers, discover insights.',
        icon: '🧠',
      },
      {
        label: 'Swiss German (Heidi)',
        path: '/bots/swiss-german-teacher' as Route,
        description: 'Learn Züridütsch with personalized lessons.',
        icon: '🇨🇭',
      },
      {
        label: 'Creative Advisor (Artr)',
        path: '/bots/artistic-advisor' as Route,
        description: 'Art analysis and creative feedback.',
        icon: '🎨',
      },
      {
        label: 'Product Manager (Trident)',
        path: '/bots/product-manager' as Route,
        description: 'User data analysis and roadmaps.',
        icon: '🔱',
      },
      {
        label: 'Your Documents',
        path: '/documents' as Route,
        description: 'Upload your own files. Build custom knowledge bases.',
        icon: '📄',
      },
    ],
    megaMenu: {
      columns: 2,
      header: {
        title: 'AI Assistants',
        subtitle: 'Pre-built or bring your own data',
        gradient: 'bg-gradient-to-r from-blue-50 to-purple-50',
      },
    },
  },
  {
    label: 'Solutions',
    path: '/solutions' as Route,
    children: [
      {
        label: 'For Individuals',
        path: '/solutions/individuals' as Route,
        description: 'Personal AI for research, health records, and learning.',
        icon: '👤',
      },
      {
        label: 'For Businesses',
        path: '/solutions/businesses' as Route,
        description: 'Enterprise document management with full privacy.',
        icon: '🏢',
      },
      {
        label: 'For Governments',
        path: '/solutions/governments' as Route,
        description: 'Sovereign AI infrastructure for public sector.',
        icon: '🏛️',
      },
    ],
    megaMenu: {
      columns: 1,
      header: {
        title: 'Solutions',
        subtitle: 'AI that stays on your infrastructure',
        gradient: 'bg-gradient-to-r from-emerald-50 to-teal-50',
      },
    },
  },
  {
    label: 'Learn',
    path: '/knowledge' as Route,
    children: [
      {
        label: 'Knowledge Base',
        path: '/knowledge' as Route,
        description: 'Guides, tutorials, and documentation.',
        icon: '📚',
      },
      {
        label: 'Blog',
        path: '/blog' as Route,
        description: 'Latest updates and insights.',
        icon: '✍️',
      },
    ],
    megaMenu: {
      columns: 1,
      header: {
        title: 'Learn',
        subtitle: 'Guides, tutorials, and updates',
        gradient: 'bg-gradient-to-r from-amber-50 to-yellow-50',
      },
    },
  },
  {
    label: 'About',
    path: '/about' as Route,
  },
  {
    label: 'Try Free',
    path: '/documents' as Route,
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
