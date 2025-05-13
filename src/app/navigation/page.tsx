// app/navigation/page.tsx
'use client';
import React from 'react';
import {
  HomeIcon,
  RocketLaunchIcon,
  Cog6ToothIcon,
  UserIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

type ModuleLoc = { id: string; name: string; icon: React.ReactNode; x: number; y: number };
type Route = { id: number; from: string; to: string };
type Entity = { id: number; name: string; icon: React.ReactNode; x: number; y: number };

export default function NavigationPage() {
  const modules: ModuleLoc[] = [
    { id: 'module', name: 'Жилой модуль', icon: <HomeIcon className="w-6 h-6 text-blue-600" />, x: 20, y: 30 },
    { id: 'launch', name: 'Космодром', icon: <RocketLaunchIcon className="w-6 h-6 text-purple-600" />, x: 60, y: 20 },
    { id: 'lab', name: 'Лаборатория', icon: <Cog6ToothIcon className="w-6 h-6 text-green-600" />, x: 70, y: 70 },
  ];

  const routes: Route[] = [
    { id: 1, from: 'module', to: 'launch' },
    { id: 2, from: 'launch', to: 'lab' },
    { id: 3, from: 'lab', to: 'module' },
  ];

  const entities: Entity[] = [
    { id: 1, name: 'Иванов И.И.', icon: <UserIcon className="w-6 h-6 text-gray-800" />, x: 30, y: 50 },
    { id: 2, name: 'Ровер-1', icon: <CubeIcon className="w-6 h-6 text-gray-800" />, x: 50, y: 60 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Навигация по базе</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative col-span-2 bg-white rounded-lg shadow h-[500px]">
          <div className="absolute inset-0 bg-gray-200" />
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            {routes.map(r => {
              const from = modules.find(m => m.id === r.from)!;
              const to = modules.find(m => m.id === r.to)!;
              return (
                <line
                  key={r.id}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="blue"
                  strokeWidth={0.5}
                  strokeDasharray="2"
                />
              );
            })}
          </svg>
          {modules.map(m => (
            <div
              key={m.id}
              className="absolute flex items-center space-x-1"
              style={{ top: `${m.y}%`, left: `${m.x}%`, transform: 'translate(-50%, -50%)' }}
            >
              {m.icon}
              <span className="bg-white text-xs px-1 rounded shadow">{m.name}</span>
            </div>
          ))}
          {entities.map(e => (
            <div
              key={e.id}
              className="absolute flex items-center space-x-1"
              style={{ top: `${e.y}%`, left: `${e.x}%`, transform: 'translate(-50%, -50%)' }}
            >
              {e.icon}
              <span className="bg-white text-xs px-1 rounded shadow">{e.name}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Маршруты</h2>
            <ul className="space-y-1 text-sm">
              {routes.map(r => {
                const from = modules.find(m => m.id === r.from)!;
                const to = modules.find(m => m.id === r.to)!;
                return (
                  <li key={r.id}>{from.name} → {to.name}</li>
                );
              })}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-2">Трекеры</h2>
            <ul className="space-y-1 text-sm">
              {entities.map(e => (
                <li key={e.id} className="flex items-center space-x-2">
                  {e.icon}
                  <span>{e.name} ({e.x}%, {e.y}%)</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
