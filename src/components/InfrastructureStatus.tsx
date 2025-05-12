import React from 'react';
import { System } from '@/types/system';

interface InfrastructureStatusProps {
  systems: System[];
}

const InfrastructureStatus: React.FC<InfrastructureStatusProps> = ({ systems }) => {
  return (
    <div className="space-y-4">
      {systems.length === 0 ? (
        <p className="text-center text-gray-500">Нет данных о системах</p>
      ) : (
        systems.map((system) => (
          <div
            key={system.id}
            className={`p-4 border rounded-md shadow-sm ${
              system.status === 'optimal'
                ? 'bg-green-100 border-green-300'
                : system.status === 'warning'
                ? 'bg-yellow-100 border-yellow-300'
                : 'bg-red-100 border-red-300'
            }`}
          >
            <h3 className="text-xl font-semibold">{system.name}</h3>
            <p className="mt-1">Статус: {system.status}</p>
            <p className="mt-1">Детали: {system.details || 'Нет дополнительных данных'}</p>
            <pre className="mt-2 bg-gray-50 p-2 rounded-md text-sm">
              {JSON.stringify(system.metrics, null, 2)}
            </pre>
          </div>
        ))
      )}
    </div>
  );
};

export default InfrastructureStatus;
