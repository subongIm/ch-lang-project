'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/library', label: '라이브러리', icon: '📚' },
    { path: '/profile', label: '프로필', icon: '👤' },
  ];

  return (
    <nav className="bg-surface border-b border-border shadow-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/library" className="flex items-center space-x-2">
            <div className="text-2xl">🎬</div>
            <span className="text-h2 font-bold text-text-primary hidden sm:block">중국 예능 학습</span>
            <span className="text-h2 font-bold text-text-primary sm:hidden">중국 예능</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={clsx(
                  'flex items-center space-x-2 px-4 py-2 rounded-sm text-body font-medium transition-all duration-base focus-ring',
                  pathname === item.path
                    ? 'bg-selected-bg text-selected-text'
                    : 'text-text-secondary hover:text-text-primary hover:bg-hover-bg'
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-sm text-text-secondary hover:text-text-primary hover:bg-hover-bg focus-ring"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center space-x-3 px-3 py-2 rounded-sm text-body font-medium transition-all duration-base focus-ring',
                    pathname === item.path
                      ? 'bg-selected-bg text-selected-text'
                      : 'text-text-secondary hover:text-text-primary hover:bg-hover-bg'
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
