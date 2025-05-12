import './globals.css';
import { Montserrat } from 'next/font/google';
import ControlPanelLayout from '@/components/ControlPanelLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400','600','700'] });

export const metadata = {
  title: 'Лунная база',
  description: 'Управление инфраструктурой на Луне',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={montserrat.className}>
        <ControlPanelLayout>
          {children}
          <ToastContainer />
        </ControlPanelLayout>
      </body>
    </html>
  );
}