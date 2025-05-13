// app/navigation/page.tsx
'use client';
import React, { useState } from 'react';
import {
  EyeIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  HomeIcon,
  RocketLaunchIcon,
  BeakerIcon,
  BoltIcon,
  CubeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function NavigationPage() {
  const zones = [
    { id: 'module', name: 'Жилой модуль A', icon: <HomeIcon className="w-5 h-5 text-blue-600" />, top: '20%', left: '15%', w: '30%', h: '25%', color: 'border-blue-400' },
    { id: 'lab', name: 'Исследовательская лаборатория', icon: <BeakerIcon className="w-5 h-5 text-green-600" />, top: '30%', left: '45%', w: '35%', h: '30%', color: 'border-green-400' },
    { id: 'launch', name: 'Космодром', icon: <RocketLaunchIcon className="w-5 h-5 text-purple-600" />, top: '40%', left: '70%', w: '25%', h: '25%', color: 'border-purple-400' },
    { id: 'storage', name: 'Хранилище', icon: <CubeIcon className="w-5 h-5 text-red-600" />, top: '60%', left: '10%', w: '25%', h: '20%', color: 'border-red-400' },
    { id: 'power', name: 'Электростанция', icon: <BoltIcon className="w-5 h-5 text-yellow-600" />, top: '10%', left: '60%', w: '20%', h: '15%', color: 'border-yellow-400' },
  ];

  const transports = [
    { id: 1, name: 'Команда EVA Альфа', from: 'Жилой модуль A', to: 'Лаборатория', eta: '5 мин', warning: false },
    { id: 2, name: 'Грузовой транспорт 2', from: 'Космодром', to: 'Хранилище', eta: '12 мин', warning: true },
    { id: 3, name: 'Авто техобслуживания 5', from: 'Хранилище', to: 'Электростанция', eta: '8 мин', warning: false },
  ];

  const bases = zones.map(z => ({
    id: z.id,
    name: z.name,
    count: Math.floor(Math.random() * 5) + 1,
    status: z.id === 'launch' ? 'Техобслуживание' : 'Эксплуатируется',
  }));

  const transportTypes = ['Пешком', 'Транспорт', 'Ровер'];
  const priorities = ['Стандартный', 'Высокий', 'Низкий'];
  const [routeParams, setRouteParams] = useState({ from: 'Жилой модуль A', to: 'Лаборатория', transport: 'Пешком', priority: 'Стандартный' });

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Базовая навигационная система</h1>
        <div className="space-x-2">
          <button className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded">
            <EyeIcon className="w-5 h-5 mr-1" /> Просмотр в реальном времени
          </button>
          <button className="inline-flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded">
            <ArrowUpTrayIcon className="w-5 h-5 mr-1" /> Загрузить карту
          </button>
        </div>
      </header>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 bg-white rounded-lg shadow h-[400px] overflow-hidden">
          <div className="absolute inset-0 bg-gray-200" />
          <div className="absolute top-2 right-2 flex flex-col space-y-2">
            <button className="bg-white p-1 rounded shadow">
              <MagnifyingGlassPlusIcon className="w-5 h-5" />
            </button>
            <button className="bg-white p-1 rounded shadow">
              <MagnifyingGlassMinusIcon className="w-5 h-5" />
            </button>
          </div>
          {zones.map(z => (
            <div
              key={z.id}
              className={`absolute border-2 ${z.color} rounded`}
              style={{ top: z.top, left: z.left, width: z.w, height: z.h }}
            >
              <div className="absolute -top-5 left-0 bg-white text-xs px-1 rounded shadow flex items-center space-x-1">
                {z.icon}
                <span>{z.name}</span>
              </div>
            </div>
          ))}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <defs>
              <marker id="arrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                <path d="M0,0 L4,2 L0,4" fill="blue" />
              </marker>
            </defs>
            <polyline
              points="50,30 15,60"
              stroke={transports[1].warning ? 'orange' : 'blue'}
              strokeWidth="0.5"
              strokeDasharray="2"
              fill="none"
              markerEnd="url(#arrow)"
            />
            {transports[1].warning && (
              <ExclamationTriangleIcon className="absolute w-6 h-6 text-yellow-500" style={{ top: '58%', left: '15%' }} />
            )}
          </svg>
        </div>
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Активные перемещения</h2>
          <ul className="space-y-3">
            {transports.map(t => (
              <li key={t.id} className={`flex items-center justify-between p-3 rounded ${t.warning ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="w-5 h-5 text-gray-700" />
                  <div className="text-sm">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs">{t.from} → {t.to}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  <span>≈ {t.eta}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Расположение баз</h2>
          <div className="relative">
            <input type="text" placeholder="Поиск локации..." className="w-full border rounded px-3 py-2" />
            <MagnifyingGlassPlusIcon className="w-5 h-5 text-gray-400 absolute right-3 top-3" />
          </div>
          <ul className="space-y-2">
            {bases.map(b => (
              <li key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-5 h-5 text-gray-700" />
                  <span>{b.name}</span>
                </div>
                <div className="text-sm text-gray-500">Занято: {b.count} чел.</div>
                <span className={`px-2 py-1 text-xs rounded ${b.status === 'Эксплуатируется' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Планирование маршрута</h2>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block mb-1">Отправная точка</label>
              <select value={routeParams.from} onChange={e => setRouteParams({ ...routeParams, from: e.target.value })} className="w-full border rounded px-3 py-2">
                {zones.map(z => <option key={z.id}>{z.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1">Пункт назначения</label>
              <select value={routeParams.to} onChange={e => setRouteParams({ ...routeParams, to: e.target.value })} className="w-full border rounded px-3 py-2">
                {zones.map(z => <option key={z.id}>{z.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1">Тип транспорта</label>
              <select value={routeParams.transport} onChange={e => setRouteParams({ ...routeParams, transport: e.target.value })} className="w-full border rounded px-3 py-2">
                {['Пешком','Транспорт','Ровер'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1">Приоритет</label>
              <select value={routeParams.priority} onChange={e => setRouteParams({ ...routeParams, priority: e.target.value })} className="w-full border rounded px-3 py-2">
                {['Стандартный','Высокий','Низкий'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded">Рассчитать маршрут</button>
          <div className="text-sm text-gray-500 pt-2 flex items-start space-x-1">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
            <span>Работы по техническому обслуживанию в зоне Космодром</span>
          </div>
        </div>
      </div>
    </div>
  );
}
