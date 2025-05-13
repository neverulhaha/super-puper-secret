'use client';
import React, { useState, useEffect } from 'react';
import {
  HeartIcon,
  BoltIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  BellAlertIcon,
  ClockIcon,
  RefreshIcon,
} from '@heroicons/react/24/outline';

type SystemStatus = {
  id: number;
  name: string;
  icon: React.ReactNode;
  status: 'OK' | 'Warning' | 'Critical';
  metrics: { label: string; value: string }[];
};

type Alarm = {
  id: number;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timeAgo: string;
};

type WarningItem = {
  id: number;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timeAgo: string;
};

export default function SecurityPage() {
  const [systems, setSystems] = useState<SystemStatus[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [warnings, setWarnings] = useState<WarningItem[]>([]);

  useEffect(() => {
    setSystems([
      {
        id: 1,
        name: 'Жизнеобеспечение',
        icon: <HeartIcon className="w-6 h-6 text-green-500" />,
        status: 'OK',
        metrics: [
          { label: 'АТМ давление', value: '101.3 kPa' },
          { label: 'Температура', value: '21°C' },
          { label: 'Влажность', value: '45%' },
        ],
      },
      {
        id: 2,
        name: 'Энергосистемы',
        icon: <BoltIcon className="w-6 h-6 text-yellow-500" />,
        status: 'Warning',
        metrics: [
          { label: 'Выход', value: '380 kW' },
          { label: 'Потребление', value: '400 kW' },
          { label: 'Запас', value: '60%' },
        ],
      },
      {
        id: 3,
        name: 'Система защиты',
        icon: <ShieldCheckIcon className="w-6 h-6 text-green-500" />,
        status: 'OK',
        metrics: [
          { label: 'Сенсоры', value: '100%' },
          { label: 'Камеры', value: '100%' },
          { label: 'Оповещения', value: '0' },
        ],
      },
    ]);
    setAlarms([
      {
        id: 1,
        title: 'Перегруз энергии',
        description: 'Потребление превысило 95%',
        severity: 'high',
        timeAgo: '5 мин назад',
      },
      {
        id: 2,
        title: 'Сбой датчика влажности',
        description: 'Датчик зоны B не отвечает',
        severity: 'medium',
        timeAgo: '20 мин назад',
      },
      {
        id: 3,
        title: 'Низкий уровень запаса воздуха',
        description: 'Запас кислорода ниже 50%',
        severity: 'low',
        timeAgo: '1 ч назад',
      },
    ]);
    setWarnings([
      {
        id: 1,
        message: 'Сбой питания резервного модуля',
        severity: 'medium',
        timeAgo: '30 мин назад',
      },
      {
        id: 2,
        message: 'Ненормальная активность сигнализации',
        severity: 'high',
        timeAgo: '45 мин назад',
      },
    ]);
  }, []);

  const severityBadge = (level: 'low' | 'medium' | 'high') => {
    if (level === 'low') return 'text-green-600 bg-green-100';
    if (level === 'medium') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const statusColor = (s: SystemStatus['status']) => {
    if (s === 'OK') return 'text-green-600 bg-green-100';
    if (s === 'Warning') return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Мониторинг безопасности</h1>
        <button className="inline-flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded">
          <RefreshIcon className="w-5 h-5 mr-1" />
          Обновить
        </button>
      </header>

      <section>
        <h2 className="text-xl font-medium mb-4">Состояние систем</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {systems.map(sys => (
            <div key={sys.id} className="bg-white p-4 rounded-lg shadow space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {sys.icon}
                  <span className="font-medium">{sys.name}</span>
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor(sys.status)}`}>
                  {sys.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {sys.metrics.map(m => (
                  <div key={m.label}>
                    <p className="text-gray-500">{m.label}</p>
                    <p className="font-medium">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-4">Активные алармы</h2>
        <ul className="space-y-3">
          {alarms.map(a => (
            <li key={a.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-start">
              <div className="flex space-x-3">
                <BellAlertIcon className={`w-6 h-6 ${severityBadge(a.severity).split(' ')[0]}`} />
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-gray-500">{a.description}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{a.timeAgo}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-4">Предупреждения</h2>
        <ul className="space-y-3">
          {warnings.map(w => (
            <li key={w.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-start">
              <div className="flex space-x-3">
                <ExclamationTriangleIcon className={`w-6 h-6 ${severityBadge(w.severity).split(' ')[0]}`} />
                <div>
                  <p className="font-medium">{w.message}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{w.timeAgo}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
