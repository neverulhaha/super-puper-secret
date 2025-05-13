// app/robotics/page.tsx
'use client';
import React, { useState } from 'react';
import {
  CubeIcon,
  PlayIcon,
  ArrowPathIcon,
  PowerIcon,
  ClockIcon,
  ArrowUpTrayIcon,
  BeakerIcon,
  Cog6ToothIcon,
  VideoCameraIcon,
  ChartBarIcon,
  MapIcon,
} from '@heroicons/react/24/outline';

export default function RoboticsPage() {
  const bots = [
    { id: 1, name: 'Исследовательский бот 1', task: 'Исследование поверхности', battery: 85, icon: <BeakerIcon className="w-6 h-6 text-green-500" />, action: <PlayIcon className="w-5 h-5 text-gray-600" /> },
    { id: 2, name: 'Бот-конструктор 2', task: 'Строительство', battery: 30, icon: <CubeIcon className="w-6 h-6 text-blue-500" />, action: <ArrowPathIcon className="w-5 h-5 text-gray-600" /> },
    { id: 3, name: 'Бот техобслуживания 3', task: 'Техобслуживание', battery: 65, icon: <Cog6ToothIcon className="w-6 h-6 text-yellow-500" />, action: <PowerIcon className="w-5 h-5 text-gray-600" /> },
  ];

  const tasks = [
    { id: 1, name: 'Анализ поверхности', bot: 'Исследовательский бот 1', progress: 65, eta: '45 минут', loading: true },
    { id: 2, name: 'Установка панелей', bot: 'Бот-конструктор 2', progress: 100, eta: '0 минут', loading: false },
    { id: 3, name: 'Ремонт оборудования', bot: 'Бот техобслуживания 3', progress: 35, eta: '2 часа', loading: false },
  ];

  const telescopes = [
    { id: 1, name: 'Главная обсерватория', status: 'Стендбай', aligned: true, target: 'Кратер Гейла', exposure: '00:05:00', angle: '45°', filter: 'Отсутствует' },
    { id: 2, name: 'Телескоп для наблюдений', status: 'Отключен', aligned: false, target: '', exposure: '', angle: '', filter: '' },
  ];

  const drones = [
    { id: 1, name: 'Геодезист 1', task: 'Составление карт местности', battery: 75, signal: 80, location: 'Северный хребет' },
    { id: 2, name: 'Скаут 2', task: 'Обнаружение ресурсов', battery: 40, signal: 90, location: 'Восточная долина' },
    { id: 3, name: 'Наблюдатель 3', task: 'Отсутствует', battery: 0, signal: 0, location: 'Базовая станция' },
  ];

  const [activeTel, setActiveTel] = useState(1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Управление роботами</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center">
          Новая миссия
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Центр управления роботами</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bots.map(b => (
              <div key={b.id} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {b.icon}
                    <div className="text-sm font-medium">{b.name}</div>
                  </div>
                  <button>{b.action}</button>
                </div>
                <div className="mt-2 text-xs text-gray-600">{b.task}</div>
                <div className="mt-4 text-xs text-gray-600">Аккумулятор</div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-1">
                  <div className="h-2 bg-green-500" style={{ width: `${b.battery}%` }} />
                </div>
                <div className="mt-1 text-xs text-gray-600">{b.battery}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Активные задания</h2>
          <ul className="space-y-4">
            {tasks.map(t => (
              <li key={t.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <MapIcon className="w-5 h-5 text-gray-700" />
                    <span className="font-medium">{t.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">{t.bot}</div>
                </div>
                <div className="flex items-center space-x-4">
                  {t.loading && <svg className="animate-spin w-5 h-5 text-gray-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>}
                  <div className="text-sm font-medium">{t.progress}%</div>
                  <div className="flex items-center text-xs text-gray-600 space-x-1 whitespace-nowrap">
                    <ClockIcon className="w-4 h-4" />
                    <span>≈ {t.eta}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Эксплуатация телескопа</h2>
          <div className="flex space-x-4">
            {telescopes.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTel(t.id)}
                className={`flex-1 p-3 rounded-lg border ${activeTel === t.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex items-center space-x-2">
                  <VideoCameraIcon className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-sm">{t.name}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">{t.status}</div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500">Цель наблюдения</label>
              <input type="text" value={telescopes.find(t => t.id === activeTel)!.target} className="w-full border rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Время экспозиции</label>
              <input type="text" value={telescopes.find(t => t.id === activeTel)!.exposure} className="w-full border rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Угол</label>
              <input type="text" value={telescopes.find(t => t.id === activeTel)!.angle} className="w-full border rounded px-2 py-1 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Фильтр</label>
              <input type="text" value={telescopes.find(t => t.id === activeTel)!.filter} className="w-full border rounded px-2 py-1 text-sm" />
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Выравнить телескоп</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Начать наблюдение</button>
            <button className="ml-auto p-2"><ArrowPathIcon className="w-5 h-5 text-gray-600" /></button>
            <button className="p-2"><ArrowUpTrayIcon className="w-5 h-5 text-gray-600" /></button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Состояние дронов</h2>
          <ul className="space-y-4">
            {drones.map(d => (
              <li key={d.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <MapIcon className="w-6 h-6 text-gray-700" />
                <div className="flex-1 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-gray-500">{d.location}</span>
                  </div>
                  <div className="text-xs text-gray-600">{d.task}</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Аккум:</span>
                    <div className="w-full bg-gray-200 h-1 rounded overflow-hidden">
                      <div className="h-1 bg-green-500" style={{ width: `${d.battery}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{d.battery}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Сигнал:</span>
                    <div className="w-full bg-gray-200 h-1 rounded overflow-hidden">
                      <div className="h-1 bg-blue-500" style={{ width: `${d.signal}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{d.signal}%</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded flex-1">Запуск дрона</button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded flex-1">Просмотр маршрута полета</button>
          </div>
        </div>
      </div>
    </div>
  );
}
