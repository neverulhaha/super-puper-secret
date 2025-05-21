'use client'

import React, { ReactNode } from 'react'
import { usePathname }      from 'next/navigation'
import { Sidebar }          from './Sidebar'
import { Header }           from './Header'

interface Props { children: ReactNode }

export default function LayoutWrapper({ children }: Props) {
  const path   = usePathname()
  const noNav  = ['/login', '/register']
  const isProf = path === '/profile' || path === '/dashboard' || path === '/analysis' || path === '/infrastructure'
  || path === '/resources' || path === '/navigation' || path === '/robotics' || path === '/medical' || path === '/admin' || path === '/security' || path === '/analytics'
  if (noNav.includes(path || '')) {
    return <>{children}</>
  }

  return (
    <>
      <Sidebar />
      <div
        className={[
          'pl-72 pt-16 min-h-screen',
          isProf ? 'bg-white text-black' : 'bg-gray-900 text-white',
        ].join(' ')}
      >
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </>
  )
}
