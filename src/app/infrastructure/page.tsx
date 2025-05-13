'use client';

import React, { useState } from 'react';
import {
  HomeIcon,
  RocketLaunchIcon,
  BoltIcon,
  WifiIcon,
  Cog6ToothIcon,
  MapIcon,
} from '@heroicons/react/24/outline';

type InfrastructureType = 
  | 'Жилой модуль'
  | 'Космодром'
  | 'Энергетическая станция'
  | 'Связь';

interface ObjectParams {
  type: InfrastructureType;
  area: number;   
  height: number;
}

interface Placement {
  id: number;
  type: InfrastructureType;
  x: string;      
  y: string;
  width: string;  
  height: string; 
}

export default function InfrastructurePage() {
  const [params, setParams] = useState<ObjectParams>({
    type: 'Жилой модуль',
    area: 100,
    height: 10,
  });
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [calculated, setCalculated] = useState(false);

  const iconForType = (type: InfrastructureType) => {
    switch (type) {
      case 'Жилой модуль':      return <HomeIcon className="w-6 h-6 text-blue-600" />;
      case 'Космодром':         return <RocketLaunchIcon className="w-6 h-6 text-purple-600" />;
      case 'Энергетическая станция': return <BoltIcon className="w-6 h-6 text-yellow-600" />;
      case 'Связь':             return <WifiIcon className="w-6 h-6 text-green-600" />;
      default:                   return <Cog6ToothIcon className="w-6 h-6 text-gray-600" />;
    }
  };

  const handleCalculate = () => {
    const mock: Placement[] = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      type: params.type,
      x: `${10 + i * 25}%`,
      y: `${20 + i * 15}%`,
      width: `${20 + i * 5}%`,
      height: `${10 + i * 5}%`,
    }));
    setPlacements(mock);
    setCalculated(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Планирование инфраструктуры</h1>
        <button className="inline-flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded">
          <MapIcon className="w-5 h-5 mr-1" />
          Показать карту
        </button>
      </header>
      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-medium">Параметры объекта</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Тип объекта</label>
            <select
              value={params.type}
              onChange={e =>
                setParams({ ...params, type: e.target.value as InfrastructureType })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option>Жилой модуль</option>
              <option>Космодром</option>
              <option>Энергетическая станция</option>
              <option>Связь</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Площадь (м²)</label>
            <input
              type="number"
              min={10}
              value={params.area}
              onChange={e =>
                setParams({ ...params, area: Number(e.target.value) })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Высота (м)</label>
            <input
              type="number"
              min={1}
              value={params.height}
              onChange={e =>
                setParams({ ...params, height: Number(e.target.value) })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div className="text-right">
          <button
            onClick={handleCalculate}
            className="inline-flex items-center bg-blue-600 text-white px-5 py-2 rounded"
          >
            Рассчитать расположение
          </button>
        </div>
      </section>

      {calculated && (
        <section className="space-y-4">
          <div className="relative bg-white rounded-lg shadow h-96 overflow-hidden">
            <div className="absolute inset-0 bg-gray-200" />
            {placements.map(place => (
              <div
                key={place.id}
                className="absolute border-2 border-dashed rounded flex items-center justify-center bg-white/60"
                style={{
                  top: place.y,
                  left: place.x,
                  width: place.width,
                  height: place.height,
                }}
              >
                {iconForType(place.type)}
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow p-6 space-y-2">
            <h3 className="text-lg font-medium">Результаты расчёта</h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2">ID</th>
                  <th className="py-2">Тип</th>
                  <th className="py-2">Позиция</th>
                  <th className="py-2">Размеры</th>
                </tr>
              </thead>
              <tbody>
                {placements.map(pl => (
                  <tr key={pl.id} className="border-b even:bg-gray-50">
                    <td className="py-2">{pl.id}</td>
                    <td className="py-2">{pl.type}</td>
                    <td className="py-2">
                      {pl.x} / {pl.y}
                    </td>
                    <td className="py-2">
                      {pl.width} × {pl.height}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
