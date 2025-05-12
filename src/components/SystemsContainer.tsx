'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { System } from '@/types/system';
import { fetchSystems } from '@/lib/api/systems';
import InfrastructureStatus from './InfrastructureStatus';

const SystemsContainer = () => {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSystems = async () => {
      setLoading(true);
      try {
        const data = await fetchSystems();
        setSystems(data);
        toast.success('Системы успешно загружены!');
      } catch (error) {
        setError('Ошибка при загрузке систем');
        toast.error('Ошибка при загрузке систем!');
      } finally {
        setLoading(false);
      }
    };

    getSystems();
  }, []);

  return (
    <div>
      {loading && <p>Загружаем системы...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <InfrastructureStatus systems={systems} />
    </div>
  );
};

export default SystemsContainer;