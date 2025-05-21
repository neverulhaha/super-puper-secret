// app/admin/page.tsx
'use client';
import React, { useState } from 'react';
import {
  DocumentTextIcon,
  TruckIcon,
  UsersIcon,
  ClockIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

export default function AdminPage() {
  const [docs] = useState([
    { id: 1, title: 'Разрешение на строительство - Модуль E7', type: 'Разрешение', status: 'РАЗРЕШЕНО', dept: 'Машины' },
    { id: 2, title: 'Ежемесячный отчет о выделении ресурсов', type: 'Отчет', status: 'ПРИНЯТО', dept: 'Ресурсы' },
    { id: 3, title: 'График обслуживания оборудования', type: 'График', status: 'РАССМОТРЕНИЕ', dept: 'Техобслуживание' },
  ]);
  const [shipments] = useState([
    { id: 1, title: 'Поставка груза', subtitle: 'Строительные материалы', eta: '2 дня', level: 'Высокий', color: 'text-yellow-600 bg-yellow-100', icon: TruckIcon },
    { id: 2, title: 'Перемещение оборудования', subtitle: 'Научное оборудование', eta: '5 дней', level: 'Средний', color: 'text-green-600 bg-green-100', icon: UsersIcon },
    { id: 3, title: 'Транспортировка ресурсов', subtitle: 'Вода и кислород', eta: 'задержка', level: 'Критический', color: 'text-red-600 bg-red-100', icon: ExclamationCircleIcon },
  ]);
  const [upcoming] = useState([
    { id: 1, title: 'Корабль снабжения "Альфа"', date: '20 марта 2025 г.' },
    { id: 2, title: 'Грузовой транспорт "Бета"', date: '25 марта 2025 г.' },
  ]);
  const [groups] = useState([
    { id: 1, name: 'Инженерия', count: 28, utilization: 92, shifts: 3, color: 'green' },
    { id: 2, name: 'Операции', count: 22, utilization: 95, shifts: 3, color: 'green' },
    { id: 3, name: 'Исследования', count: 15, utilization: 87, shifts: 2, color: 'yellow' },
    { id: 4, name: 'Техобслуживание', count: 19, utilization: 78, shifts: 2, color: 'yellow' },
  ]);
  const [performance] = useState([
    { id: 1, name: 'Общая эффективность', value: 88, color: 'blue' },
    { id: 2, name: 'Процент выполненных задач', value: 92, color: 'green' },
    { id: 3, name: 'Использование ресурсов', value: 85, color: 'purple' },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Администрирование</h1>
        <div className="flex space-x-2">
          <button className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded">
            <PlusIcon className="w-5 h-5 mr-1" /> Новый документ
          </button>
          <button className="inline-flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded">
            <ArrowDownTrayIcon className="w-5 h-5 mr-1" /> Экспорт отчета
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <DocumentTextIcon className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Действующие документы</p>
            <p className="text-lg font-medium">247</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <TruckIcon className="w-6 h-6 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Ожидающие отправки</p>
            <p className="text-lg font-medium">12</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <UsersIcon className="w-6 h-6 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">Действующий персонал</p>
            <p className="text-lg font-medium">84</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <ClockIcon className="w-6 h-6 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Текущее время работы</p>
            <p className="text-lg font-medium">642</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Управление документацией</h2>
            <FunnelIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
          </div>
          <input
            type="text"
            placeholder="Поиск документов..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200 mt-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Документ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Отдел</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {docs.map(d => (
                  <tr key={d.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          d.status === 'РАЗРЕШЕНО'
                            ? 'bg-green-100 text-green-600'
                            : d.status === 'ПРИНЯТО'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.dept}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Логистика и перевозки</h2>
          <div className="flex space-x-2 mb-4">
            <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm">График работы транспорта</button>
            <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm">Отслеживание груза</button>
          </div>
          <ul className="space-y-3">
            {shipments.map(s => (
              <li key={s.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <s.icon className="w-5 h-5 text-gray-700" />
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.subtitle}</p>
                    <p className="text-xs text-gray-400 mt-1">Время прибытия: {s.eta}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${s.color}`}>{s.level}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Предстоящие перевозки</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              {upcoming.map(u => (
                <li key={u.id} className="flex justify-between">
                  <span>{u.title}</span>
                  <span>{u.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map(g => (
          <div key={g.id} className="bg-white rounded-lg shadow p-6 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <UsersIcon className={`w-6 h-6 text-${g.color}-500`} />
                <div>
                  <p className="font-medium">{g.name}</p>
                  <p className="text-sm text-gray-500">{g.count} кадр.</p>
                </div>
              </div>
              {g.utilization < 90 && <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />}
            </div>
            <div className="text-sm text-gray-500">Утилизация</div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-2 bg-${g.color}-500`}
                style={{ width: `${g.utilization}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Активные смены</span>
              <span>{g.shifts}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="w-6 h-6 text-gray-700" />
          <h2 className="text-lg font-medium">Обзор производительности</h2>
        </div>
        <ul className="space-y-4">
          {performance.map(p => (
            <li key={p.id}>
              <div className="flex justify-between text-sm mb-1">
                <span>{p.name}</span>
                <span>{p.value}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-2 bg-${p.color}-500`}
                  style={{ width: `${p.value}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="flex space-x-4 mt-4">
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded">График смен</button>
          <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded">Просмотр отчетов</button>
        </div>
      </div>
    </div>
  );
}
