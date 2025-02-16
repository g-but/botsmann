'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { MenuButton } from './MenuButton';
import { useRouter } from 'next/navigation';

const menuVariants = {
  closed: {
    y: '-100%',
    opacity: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleDragEnd = useCallback((_: never, info: PanInfo) => {
    if (info.offset.y < -50) {
      setIsOpen(false);
    }
  }, []);

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [router]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      <MenuButton 
        isOpen={isOpen} 
        onToggle={handleToggle}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-overlay"
      />
      
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            id="mobile-menu-overlay"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 top-16 bottom-0 z-[100] bg-white lg:hidden"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            aria-label="Mobile menu"
            role="dialog"
            aria-modal="true"
          >
            <motion.button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-openai-green focus:outline-none focus:ring-2 focus:ring-openai-green"
              aria-label="Close menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✖
            </motion.button>
            <nav className="h-full overflow-y-auto px-6 py-6" role="navigation">
              <motion.div 
                className="flex flex-col space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="space-y-6">
                  <Link href="/bots" className="flex items-center text-lg font-medium text-gray-900 hover:text-openai-green active:text-openai-green transition-colors">
                    Bots
                  </Link>
                  <motion.div 
                    className="flex flex-col space-y-4 pl-4 border-l border-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link href="/bots/artistic-advisor" className="flex items-center py-2 text-base text-gray-600 hover:text-openai-green active:text-openai-green transition-colors">
                      Artistic Advisor
                    </Link>
                    <Link href="/bots/auto-shopper" className="flex items-center py-2 text-base text-gray-600 hover:text-openai-green active:text-openai-green transition-colors">
                      Auto Shopper
                    </Link>
                    <Link href="/bots/gov-spending-tracker" className="flex items-center py-2 text-base text-gray-600 hover:text-openai-green active:text-openai-green transition-colors">
                      Gov Spending Tracker
                    </Link>
                    <Link href="/bots/legal-expert" className="flex items-center py-2 text-base text-gray-600 hover:text-openai-green active:text-openai-green transition-colors">
                      Legal Expert
                    </Link>
                    <Link href="/bots/medical-expert" className="flex items-center py-2 text-base text-gray-600 hover:text-openai-green active:text-openai-green transition-colors">
                      Medical Expert
                    </Link>
                    <Link href="/bots/swiss-german-teacher" className="flex items-center py-2 text-base text-gray-600 hover:text-openai-green active:text-openai-green transition-colors">
                      Swiss German Teacher
                    </Link>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="flex flex-col space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-openai-green">
                    Blog
                  </Link>
                  <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-openai-green">
                    About
                  </Link>
                  <Link 
                    href={'/contact' as Route}
                    className="inline-flex items-center justify-center rounded-md bg-openai-green px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition-opacity"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
