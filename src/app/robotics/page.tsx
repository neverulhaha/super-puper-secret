'use client';
import React, { useState } from 'react';
import {
  CubeIcon,
  PlayIcon,
  XCircleIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  MoonIcon,
  VideoCameraIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

type RobotModule = {
  id: number;
  name: string;
  status: 'idle' | 'running' | 'completed';
  progress: number;
};

type Telescope = {
  id: number;
  name: string;
  target: string;
  observing: boolean;
};

type Drone = {
  id: number;
  name: string;
  battery: number;
  altitude: number;
  speed: number;
};

export default function RobotsPage() {
  const [modules, setModules] = useState<RobotModule[]>([
    { id: 1, name: 'Робот-модуль A', status: 'idle', progress: 0 },
    { id: 2, name: 'Робот-модуль B', status: 'completed', progress: 100 },
    { id: 3, name: 'Робот-модуль C', status: 'running', progress: 40 },
  ]);
  const [telescopes, setTelescopes] = useState<Telescope[]>([
    { id: 1, name: 'Телескоп 1', target: 'Луна', observing: false },
    { id: 2, name: 'Телескоп 2', target: 'Марс', observing: true },
  ]);
  const [drones] = useState<Drone[]>([
    { id: 1, name: 'Дрон Alpha', battery: 78, altitude: 120, speed: 15 },
    { id: 2, name: 'Дрон Beta', battery: 56, altitude: 80, speed: 10 },
  ]);

  const runModule = (id: number) =>
    setModules(modules.map(m => m.id === id ? { ...m, status: 'running', progress: 0 } : m));

  const stopModule = (id: number) =>
    setModules(modules.map(m => m.id === id ? { ...m, status: 'idle', progress: 0 } : m));

  const completeModule = (id: number) =>
    setModules(modules.map(m => m.id === id ? { ...m, status: 'completed', progress: 100 } : m));

  const toggleObserve = (id: number) =>
    setTelescopes(telescopes.map(t => t.id === id ? { ...t, observing: !t.observing } : t));

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <h1 className="text-2xl font-semibold">Управление роботами</h1>

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-medium flex items-center space-x-2">
          <CubeIcon className="w-6 h-6" />
          Роботизированные модули
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modules.map(m => (
            <div key={m.id} className="bg-gray-100 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{m.name}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  m.status === 'running' ? 'bg-blue-100 text-blue-600' :
                  m.status === 'completed' ? 'bg-green-100 text-green-600' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {m.status === 'running' ? 'В работе' : m.status === 'completed' ? 'Завершено' : 'Ожидание'}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full ${
                    m.status === 'running' ? 'bg-blue-500' :
                    m.status === 'completed' ? 'bg-green-500' :
                    'bg-gray-500'
                  }`}
                  style={{ width: `${m.progress}%` }}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => runModule(m.id)}
                  className="flex-1 inline-flex items-center justify-center bg-blue-600 text-white px-2 py-1 rounded"
                >
                  <PlayIcon className="w-4 h-4 mr-1" />
                  Запустить
                </button>
                <button
                  onClick={() => stopModule(m.id)}
                  className="flex-1 inline-flex items-center justify-center bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  <XCircleIcon className="w-4 h-4 mr-1" />
                  Остановить
                </button>
                <button
                  onClick={() => completeModule(m.id)}
                  className="flex-1 inline-flex items-center justify-center bg-green-600 text-white px-2 py-1 rounded"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Завершить
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-medium flex items-center space-x-2">
          <MoonIcon className="w-6 h-6" />
          Астрономическое оборудование
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {telescopes.map(t => (
            <div key={t.id} className="bg-gray-100 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{t.name}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${t.observing ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'}`}>
                  {t.observing ? 'Наблюдение' : 'Отключено'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={t.target}
                  onChange={e => setTelescopes(
                    telescopes.map(x => x.id === t.id ? { ...x, target: e.target.value } : x)
                  )}
                  className="flex-1 border rounded px-2 py-1"
                  placeholder="Объект наблюдения"
                />
                <button
                  onClick={() => toggleObserve(t.id)}
                  className="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded"
                >
                  <Cog6ToothIcon className="w-4 h-4 mr-1" />
                  {t.observing ? 'Стоп' : 'Старт'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-medium flex items-center space-x-2">
          <VideoCameraIcon className="w-6 h-6" />
          Данные с дронов
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drones.map(d => (
            <div key={d.id} className="bg-gray-100 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{d.name}</span>
                <span className="text-sm text-gray-500">Батарея: {d.battery}%</span>
              </div>
              <div className="flex space-x-4 text-sm">
                <div className="flex-1">
                  <p>Высота</p>
                  <div className="flex items-center space-x-1">
                    <ChartBarIcon className="w-4 h-4" />
                    <span>{d.altitude} м</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p>Скорость</p>
                  <div className="flex items-center space-x-1">
                    <ChartBarIcon className="w-4 h-4" />
                    <span>{d.speed} м/с</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
