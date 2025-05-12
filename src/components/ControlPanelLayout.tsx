'use client';
import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Module { id: string; code: string; name: string; enabled: boolean; roles: string[]; }

type Props = { children: ReactNode };
export default function ControlPanelLayout({ children }: Props) {
  const [modules, setModules] = useState<Module[]>([]);
  const [active, setActive] = useState<string>('dashboard');
  const pathname = usePathname();

  useEffect(() => {
    async function loadModules() {
      const { data, error } = await supabase
        .from('modules')
        .select('id, code, name, enabled, roles')
        .eq('enabled', true);
      if (error) {
        console.error(error);
        return;
      }
      setModules(data as Module[]);
    }
    loadModules();
  }, []);

  useEffect(() => {
    const segment = pathname.split('/')[1] || 'dashboard';
    setActive(segment);
  }, [pathname]);

  return (
    <div className="flex h-screen">
      <aside className="w-60 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Лунная база</h2>
        <nav>
          {modules.map(mod => (
            <Link
              key={mod.id}
              href={`/${mod.code}`}
              className={`block px-3 py-2 rounded mb-2 hover:bg-gray-700 ${active === mod.code ? 'bg-gray-700' : ''}`}
              onClick={() => setActive(mod.code)}
            >{mod.name}</Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">{children}</main>
    </div>
  );
}