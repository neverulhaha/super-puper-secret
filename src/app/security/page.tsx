// app/security/page.tsx
'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  UsersIcon,
  ArrowPathIcon,
  ClockIcon,
  BellAlertIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface SystemStatus {
  id: number;
  name: string;
  icon: ReactNode;
  status: 'OK' | 'Warning' | 'Critical';
  metrics: { label: string; value: string }[];
  last: string;
}

interface Signal {
  id: number;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  badge: string;
  time: string;
}

interface Protocol {
  id: number;
  title: string;
  subtitle: string;
  updated: string;
  color: 'red' | 'blue' | 'green';
  icon: ReactNode;
  steps: string[];
}

export default function SecurityPage() {
  const [summary] = useState([
    { id: 1, title: 'Статус безопасности', value: 'Защищено', icon: <ShieldCheckIcon className="w-6 h-6 text-green-500" /> },
    { id: 2, title: 'Активные сигналы', value: '3', icon: <ExclamationTriangleIcon className="w-6 h-6 text-red-500" /> },
    { id: 3, title: 'Состояние систем', value: '98.5%', icon: <BoltIcon className="w-6 h-6 text-blue-500" /> },
    { id: 4, title: 'Контроль доступа', value: 'Проверено', icon: <UsersIcon className="w-6 h-6 text-purple-500" /> },
  ]);
  const [systems, setSystems] = useState<SystemStatus[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [protocols] = useState<Protocol[]>([
    {
      id: 1,
      title: 'Протокол экстренного реагирования',
      subtitle: 'Экстренная ситуация',
      updated: '2025-03-15',
      color: 'red',
      icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />,
      steps: [
        'Запуск аварийного отключения',
        'Защита критически важных систем',
        'Эвакуация пострадавших районов',
        'Развернуть группу реагирования',
      ],
    },
    {
      id: 2,
      title: 'Протокол контроля доступа',
      subtitle: 'Безопасность',
      updated: '2025-03-14',
      color: 'blue',
      icon: <UsersIcon className="w-5 h-5 text-blue-500" />,
      steps: [
        'Проверка полномочий',
        'Регистрация попыток доступа',
        'Контроль запретных зон',
        'Сообщить о нарушениях',
      ],
    },
    {
      id: 3,
      title: 'Протокол обслуживания системы',
      subtitle: 'Инженерия',
      updated: '2025-03-13',
      color: 'green',
      icon: <Cog6ToothIcon className="w-5 h-5 text-green-500" />,
      steps: [
        'Проверка целостности системы',
        'Обновление системы безопасности',
        'Проверка системы резервного копирования',
        'Проверка документов',
      ],
    },
  ]);

  useEffect(() => {
    setSystems([
      {
        id: 1,
        name: 'Системы жизнеобеспечения',
        icon: <ShieldCheckIcon className="w-6 h-6 text-green-500" />,
        status: 'OK',
        metrics: [
          { label: 'Давление', value: '101.3 kPa' },
          { label: 'Кислород', value: '21%' },
          { label: 'CO₂', value: '0.04%' },
        ],
        last: '2 мин назад',
      },
      {
        id: 2,
        name: 'Распределение энергии',
        icon: <BoltIcon className="w-6 h-6 text-yellow-500" />,
        status: 'Warning',
        metrics: [
          { label: 'Нагрузка', value: '85%' },
          { label: 'Резервные копии', value: '100%' },
          { label: 'Эффективность', value: '92%' },
        ],
        last: '1 мин назад',
      },
      {
        id: 3,
        name: 'Сеть связи',
        icon: <BellAlertIcon className="w-6 h-6 text-green-500" />,
        status: 'OK',
        metrics: [
          { label: 'Время безотказной работы', value: '99.9%' },
          { label: 'Задержка', value: '120 ms' },
          { label: 'Пропускная способность', value: '95%' },
        ],
        last: '30 сек назад',
      },
      {
        id: 4,
        name: 'Контроль среды',
        icon: <UsersIcon className="w-6 h-6 text-green-500" />,
        status: 'OK',
        metrics: [
          { label: 'Температура', value: '21°C' },
          { label: 'Влажность', value: '45%' },
          { label: 'Поток воздуха', value: '100%' },
        ],
        last: '1 мин назад',
      },
    ]);
    setSignals([
      {
        id: 1,
        title: 'Аномалия распределения энергии',
        description: 'Необычное потребление энергии в модуле E7',
        severity: 'high',
        badge: 'Активно',
        time: '10 мин назад',
      },
      {
        id: 2,
        title: 'Экологический сигнал',
        description: 'Повышение уровня CO₂ в исследовательской лаборатории',
        severity: 'medium',
        badge: 'Приоритетно',
        time: '15 мин назад',
      },
      {
        id: 3,
        title: 'Требуется обновление системы',
        description: 'Обновления системы безопасности доступны для установки',
        severity: 'low',
        badge: 'Решено',
        time: '1 ч назад',
      },
    ]);
  }, []);

  const statusColor = (s: SystemStatus['status']) =>
    s === 'OK'
      ? 'bg-green-100 text-green-600'
      : s === 'Warning'
      ? 'bg-yellow-100 text-yellow-600'
      : 'bg-red-100 text-red-600';

  const signalBg = (sev: Signal['severity']) =>
    sev === 'low'
      ? 'bg-green-50'
      : sev === 'medium'
      ? 'bg-yellow-50'
      : 'bg-red-50';

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Центр управления безопасностью</h1>
        <div className="space-x-2">
          <button className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded">
            <ExclamationTriangleIcon className="w-5 h-5 mr-1" />
            Экстренный протокол
          </button>
          <button className="inline-flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded">
            <ArrowPathIcon className="w-5 h-5 mr-1" />
            Экспорт журнала
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map(s => (
          <div key={s.id} className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
            {s.icon}
            <div>
              <p className="text-sm text-gray-500">{s.title}</p>
              <p className="text-lg font-medium">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-medium">Мониторинг системы</h2>
          <ul className="space-y-4">
            {systems.map(sys => (
              <li key={sys.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {sys.icon}
                    <span className="font-medium">{sys.name}</span>
                  </div>
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">Последняя проверка: {sys.last}</p>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className={`h-2 ${statusColor(sys.status)}`} style={{ width: '100%' }} />
                </div>
                <div className="grid grid-cols-3 text-sm gap-4">
                  {sys.metrics.map(m => (
                    <div key={m.label}>
                      <p className="text-gray-500">{m.label}</p>
                      <p className="font-medium">{m.value}</p>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-medium">Активные сигналы</h2>
          <ul className="space-y-4">
            {signals.map(sig => (
              <li key={sig.id} className={`${signalBg(sig.severity)} p-4 rounded-lg`}>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium">{sig.title}</p>
                    <p className="text-sm text-gray-500">{sig.description}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white">{sig.badge}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">{sig.time}</p>
                  <div className="space-x-2">
                    <button className="px-3 py-1 bg-white text-gray-700 rounded text-sm">Проверка</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Решить</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {protocols.map(p => (
        <div key={p.id} className={`${p.color === 'red' ? 'bg-red-50' : p.color === 'blue' ? 'bg-blue-50' : 'bg-green-50'} rounded-lg shadow p-6`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              {p.icon}
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-gray-500">{p.subtitle}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">Обновлено: {p.updated}</p>
          </div>
          <ol className="list-decimal list-inside text-sm space-y-1">
            {p.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <div className="flex justify-between items-center mt-4">
            <button className="flex-1 bg-black text-white px-4 py-2 rounded">Активировать протокол</button>
            <button className="ml-4 text-sm text-gray-700">Редактировать</button>
          </div>
        </div>
      ))}
    </div>
  );
}
