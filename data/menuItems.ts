import type { MenuItem } from '@/types/navigation';
import type { Route } from 'next';

/**
 * Main site navigation menu items
 * SSOT for navigation structure across desktop and mobile
 */
export const menuItems: MenuItem[] = [
  {
    label: 'Solutions',
    path: '/solutions' as Route,
    children: [
      {
        label: 'Individuals',
        path: '/solutions/individuals' as Route,
        description: 'Personal productivity and language tools.',
        icon: '👤',
      },
      {
        label: 'Businesses',
        path: '/solutions/businesses' as Route,
        description: 'Workflow automation for teams and enterprises.',
        icon: '🏢',
      },
      {
        label: 'Governments',
        path: '/solutions/governments' as Route,
        description: 'Transparency and citizen engagement platforms.',
        icon: '🏛️',
      },
    ],
    megaMenu: {
      columns: 1,
      header: {
        title: 'Solutions by Audience',
        subtitle: 'Tailored AI solutions for every sector',
        gradient: 'bg-gradient-to-r from-emerald-50 to-teal-50',
      },
    },
  },
  {
    label: 'Bots',
    path: '/bots' as Route,
    children: [
      {
        label: 'Legal Expert (Lex)',
        path: '/bots/legal-expert' as Route,
        description: 'Ingest legal docs, get AI analysis & lawyer matches',
        icon: '⚖️',
      },
      {
        label: 'Swiss German Teacher (Heidi)',
        path: '/bots/swiss-german-teacher' as Route,
        description: 'Learn Züridütsch with personalized AI lessons',
        icon: '🇨🇭',
      },
      {
        label: 'Research Assistant (Nerd)',
        path: '/bots/research-assistant' as Route,
        description: 'Ingest papers, organize research, discover insights',
        icon: '🧠',
      },
      {
        label: 'Medical Expert (Imhotep)',
        path: '/bots/medical-expert' as Route,
        description: 'Analyze medical data for evidence-based insights',
        icon: '⚕️',
      },
      {
        label: 'Creative Advisor (Artr)',
        path: '/bots/artistic-advisor' as Route,
        description: 'Upload art, get style analysis & creative feedback',
        icon: '🎨',
      },
      {
        label: 'Product Manager (Trident)',
        path: '/bots/product-manager' as Route,
        description: 'Ingest user data, get product roadmaps & analysis',
        icon: '🔱',
      },
    ],
    megaMenu: {
      columns: 2,
      header: {
        title: 'Specialized AI Bots',
        subtitle: 'Ingest data → AI analysis → Actionable outputs',
        gradient: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      },
      footer: {
        label: 'View all bots',
        href: '/bots' as Route,
      },
    },
  },
  {
    label: 'Projects',
    path: '/projects' as Route,
    children: [
      {
        label: 'Credit',
        path: '/projects/credit' as Route,
        description: 'Automated venture credit operations.',
        icon: '💳',
      },
      {
        label: 'Finance',
        path: '/projects/finance' as Route,
        description: 'Open project finance management.',
        icon: '📊',
      },
      {
        label: 'Governance',
        path: '/projects/governance' as Route,
        description: 'Transparent, accountable government tech.',
        icon: '🏛️',
      },
      {
        label: 'Recurring Fulfillment',
        path: '/projects/shopping' as Route,
        description: 'Manage subscriptions and inventory.',
        icon: '📦',
      },
      {
        label: 'Techno-Capital',
        path: '/projects/techno-capital' as Route,
        description: 'Investment fund for technological progress.',
        icon: '🚀',
      },
    ],
    megaMenu: {
      columns: 2,
      header: {
        title: 'Open Projects',
        subtitle: 'Building the future of automation',
        gradient: 'bg-gradient-to-r from-purple-50 to-pink-50',
      },
    },
  },
  {
    label: 'Knowledge',
    path: '/knowledge' as Route,
    children: [
      {
        label: 'All Guides',
        path: '/knowledge/guides' as Route,
        description: 'Step-by-step tutorials for all skill levels',
        icon: '📚',
      },
      {
        label: 'Infrastructure',
        path: '/knowledge/infrastructure' as Route,
        description: 'Hosting, models, and cost comparisons',
        icon: '🏗️',
      },
      {
        label: 'Getting Started',
        path: '/knowledge/guides?difficulty=Beginner' as Route,
        description: 'Perfect for beginners new to AI',
        icon: '🚀',
      },
      {
        label: 'FAQ',
        path: '/knowledge#faq' as Route,
        description: 'Answers to common questions',
        icon: '❓',
      },
    ],
    megaMenu: {
      columns: 2,
      header: {
        title: 'Knowledge Center',
        subtitle: 'Learn to build AI infrastructure yourself',
        gradient: 'bg-gradient-to-r from-amber-50 to-yellow-50',
      },
      footer: {
        label: 'Browse all guides',
        href: '/knowledge/guides' as Route,
      },
    },
  },
  {
    label: 'Blog',
    path: '/blog' as Route,
  },
  {
    label: 'About',
    path: '/about' as Route,
  },
  {
    label: 'Contact Us',
    path: '/contact' as Route,
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
