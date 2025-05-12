'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('token');
    Cookies.remove('sb-access-token');
    router.push('/login');
  }, []);

  return (
    <div className="text-white p-6">
      Выход...
    </div>
  );
}
