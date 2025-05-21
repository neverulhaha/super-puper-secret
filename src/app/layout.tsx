import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import LayoutWrapper from '@/components/LayoutWrapper'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '600', '700'] })

export const metadata: Metadata = {
  title: 'Лунная база',
  description: 'Управление инфраструктурой на Луне',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={montserrat.className}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <ToastContainer />
      </body>
    </html>
  )
}
