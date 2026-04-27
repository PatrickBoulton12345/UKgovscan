'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { label: 'contracts', href: '/contracts' },
  { label: 'foreign aid', href: '/foreign-aid' },
  { label: 'councils', href: '/councils' },
  { label: 'schools', href: '/schools' },
  { label: 'leaderboard', href: '/leaderboard' },
  { label: 'search', href: '/search' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header>
      <div className="bg-lfg-black">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-1 group">
            <span className="font-octarine text-lfg-orange text-2xl tracking-tight lowercase">
              lfg
            </span>
            <span className="font-octarine text-white text-2xl tracking-tight lowercase">
              govscan
            </span>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white border-2 border-white px-3 py-1.5 font-dm font-bold text-sm"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? 'close' : 'menu'}
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-dm font-bold transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-lfg-orange'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-gray-700 px-4 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 text-sm font-dm font-bold border-b border-gray-800 ${
                  pathname === item.href
                    ? 'text-lfg-orange'
                    : 'text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
      <div className="brand-motif" />
    </header>
  )
}
