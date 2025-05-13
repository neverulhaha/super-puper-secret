'use client';
import React, { useEffect, useState } from 'react';

import {
  UserIcon,
  BoltIcon,
  HeartIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  BellAlertIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

type Project = {
  id: number;
  name: string;
  deadline: string;
  progress: number;
  status: 'in-progress' | 'completed' | 'delayed';
  avatars: string[];
};

 type InfraCard = {
   id: string;
   title: string;
   icon: React.ReactNode;
   metrics: { label: string; value: string }[];
   warning?: boolean;
 };
type Notification = {
  id: number;
  type: 'error' | 'success' | 'info' | 'warn';
  title: string;
  description: string;
  timeAgo: string;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [infra, setInfra] = useState<InfraCard[]>([]);
  const [notes, setNotes] = useState<Notification[]>([]);

  useEffect(() => {
    setProjects([
      {
        id: 1,
        name: 'Строительство жилого модуля',
        deadline: '2025-04-15',
        progress: 65,
        status: 'in-progress',
        avatars: [
          'https://i.pravatar.cc/32?img=12',
          'https://i.pravatar.cc/32?img=47',
          'https://i.pravatar.cc/32?img=58',
        ],
      },
      {
        id: 2,
        name: 'Расширение массива солнечных панелей',
        deadline: '2025-03-30',
        progress: 100,
        status: 'completed',
        avatars: [
          'https://i.pravatar.cc/32?img=32',
          'https://i.pravatar.cc/32?img=5',
        ],
      },
      {
        id: 3,
        name: 'Модернизация системы рециркуляции воды',
        deadline: '2025-04-01',
        progress: 35,
        status: 'delayed',
        avatars: [
          'https://i.pravatar.cc/32?img=15',
          'https://i.pravatar.cc/32?img=22',
          'https://i.pravatar.cc/32?img=39',
        ],
      },
    ]);
    setInfra([
      {
        id: 'modules',
        title: 'Жилые модули',
        icon: <SparklesIcon className="w-6 h-6 text-green-500" />,
        metrics: [
          { label: 'Давление', value: '101.3 kPa' },
          { label: 'Температура', value: '21 °C' },
          { label: 'Влажность', value: '45 %' },
        ],
      },
      {
        id: 'power',
        title: 'Энергетические системы',
        icon: <BoltIcon className="w-6 h-6 text-yellow-500" />,
        metrics: [
          { label: 'Выход', value: '450 kW' },
          { label: 'Потребление', value: '380 kW' },
          { label: 'Ёмкость', value: '85 %' },
        ],
      },
      {
        id: 'water',
        title: 'Водные ресурсы',
        icon: <HeartIcon className="w-6 h-6 text-teal-500" />,
        metrics: [
          { label: 'Объём', value: '95 %' },
          { label: 'Качество', value: '100 %' },
          { label: 'Рециркуляция', value: '99.9 %' },
        ],
      },
      {
        id: 'air',
        title: 'Регенерация воздуха',
        icon: <ShieldCheckIcon className="w-6 h-6 text-green-500" />,
        metrics: [
          { label: 'Уровень O₂', value: '21 %' },
          { label: 'Углекислый газ', value: '0.04 %' },
          { label: 'Поток', value: '12 м³/мин' },
        ],
      },
      {
        id: 'comm',
        title: 'Связь',
        icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
        metrics: [
          { label: 'Задержка', value: '2.6 с' },
          { label: 'Скорость', value: '85 %' },
          { label: 'Сигнал', value: '92 %' },
        ],
        warning: true,
      },
      {
        id: 'security',
        title: 'Безопасность',
        icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
        metrics: [
          { label: 'Сенсоры', value: '100 %' },
          { label: 'Камеры', value: '100 %' },
          { label: 'Оповещения', value: '0' },
        ],
      },
    ]);
    setNotes([
      {
        id: 1,
        type: 'error',
        title: 'Резервная система связи в автономном режиме',
        description: 'Резервная антенна требует планового технического обслуживания',
        timeAgo: '10 мин назад',
      },
      {
        id: 2,
        type: 'success',
        title: 'Оптимизация массива солнечных панелей 2 завершена',
        description: 'Энергоэффективность увеличилась на 3.5 %',
        timeAgo: '1 ч назад',
      },
      {
        id: 3,
        type: 'info',
        title: 'Обновлен график ротации экипажа',
        description: 'Новое расписание вступит в силу со следующей недели',
        timeAgo: '2 ч назад',
      },
      {
        id: 4,
        type: 'warn',
        title: 'Техническое обслуживание системы рециркуляции воды',
        description: 'Плановое техническое обслуживание в течение 24 часов',
        timeAgo: '3 ч назад',
      },
      {
        id: 5,
        type: 'success',
        title: 'Проверка безопасности завершена',
        description: 'Уязвимости не обнаружены',
        timeAgo: '4 ч назад',
      },
    ]);
  }, []);
  const statusBadge = (s: Project['status']) => {
    switch (s) {
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'completed':   return 'text-green-600 bg-green-100';
      case 'delayed':     return 'text-red-600 bg-red-100';
    }
  };
  const noteIcon = (type: Notification['type']) => {
    switch (type) {
      case 'error':   return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'info':    return <BellAlertIcon className="w-5 h-5 text-blue-500" />;
      case 'warn':    return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-semibold">Панель управления Лунной миссией</h1>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Все системы исправны
          </span>
          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Лунное время: 14:30
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <UserIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Персонал</p>
            <p className="text-lg font-medium">24/30</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <BoltIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Энергия</p>
            <p className="text-lg font-medium">98.5 %</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <HeartIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Жизнеобеспечение</p>
            <p className="text-lg font-medium">Оптимальное</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <ShieldCheckIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Статус защиты</p>
            <p className="text-lg font-medium">Активно</p>
          </div>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Проекты в реализации</h2>
          <button className="px-4 py-1 bg-blue-600 text-white rounded">Создать</button>
        </div>
        <div className="space-y-4">
          {projects.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{p.name}</h3>
                  <p className="text-sm text-gray-500">Срок сдачи {p.deadline}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusBadge(p.status)}`}>
                  {p.status === 'in-progress' && 'В процессе'}
                  {p.status === 'completed'   && 'Завершено'}
                  {p.status === 'delayed'     && 'Отложено'}
                </span>
              </div>
              <div className="mt-3 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full ${p.status === 'delayed' ? 'bg-red-500'
                    : p.status === 'completed' ? 'bg-green-500'
                    : 'bg-blue-500'}`}
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <div className="mt-3 flex -space-x-2">
                {p.avatars.map((u, i) => (
                  <img
                    key={i}
                    src={u}
                    alt="avatar"
                    className="w-6 h-6 rounded-full border-2 border-white"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Состояние инфраструктуры</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {infra.map(i => (
            <div
              key={i.id}
              className={`bg-white p-4 rounded-lg shadow flex flex-col space-y-2 ${
                i.warning ? 'border-2 border-red-200' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                {i.icon}
                <h3 className="font-medium">{i.title}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {i.metrics.map(m => (
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Последние уведомления</h2>
          <button className="text-sm text-blue-600">Отобразить все</button>
        </div>
        <ul className="space-y-2">
          {notes.map(n => (
            <li key={n.id} className="bg-white p-3 rounded-lg shadow flex justify-between items-start">
              <div className="flex space-x-3">
                {noteIcon(n.type)}
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-gray-500">{n.description}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">{n.timeAgo}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
