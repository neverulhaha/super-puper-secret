'use client';
import React, { useState } from 'react';
import {
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  ClockIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

type Doc = { id: number; title: string; type: string; status: 'Новая' | 'В работе' | 'Завершена' };
type Shipment = { id: number; item: string; from: string; to: string; status: 'Ожидание' | 'В пути' | 'Доставлено' };
type TimeEntry = { id: number; user: string; date: string; hours: number; task: string };

export default function AdminPage() {
  const [docs] = useState<Doc[]>([
    { id: 1, title: 'Заявка на жилой модуль B', type: 'Заявка', status: 'Новая' },
    { id: 2, title: 'Отчет строительных работ', type: 'Отчет', status: 'В работе' },
    { id: 3, title: 'Закупка материалов', type: 'Заявка', status: 'Завершена' },
  ]);
  const [shipments] = useState<Shipment[]>([
    { id: 1, item: 'Панели', from: 'Космодром', to: 'Лаборатория', status: 'В пути' },
    { id: 2, item: 'Батареи', from: 'Хранилище', to: 'Электростанция', status: 'Ожидание' },
    { id: 3, item: 'Вода', from: 'Склад', to: 'Жилой модуль', status: 'Доставлено' },
  ]);
  const [entries] = useState<TimeEntry[]>([
    { id: 1, user: 'Иванов', date: '2025-05-12', hours: 8, task: 'Монтаж' },
    { id: 2, user: 'Петрова', date: '2025-05-12', hours: 7.5, task: 'Обслуживание' },
    { id: 3, user: 'Сидоров', date: '2025-05-12', hours: 9, task: 'Логистика' },
  ]);

  const totalDocs = docs.length;
  const pendingDocs = docs.filter(d => d.status !== 'Завершена').length;
  const totalShipments = shipments.length;
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Администрирование</h1>
        <button className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded">
          <PlusIcon className="w-5 h-5 mr-1" />
          Новая запись
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <DocumentTextIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Всего документов</p>
            <p className="text-lg font-medium">{totalDocs}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <ClipboardDocumentListIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Незавершено</p>
            <p className="text-lg font-medium">{pendingDocs}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <TruckIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Отгрузок запланировано</p>
            <p className="text-lg font-medium">{totalShipments}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <ClockIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Часов работы</p>
            <p className="text-lg font-medium">{totalHours}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium flex items-center space-x-2">
            <DocumentTextIcon className="w-6 h-6" />
            Управление документами
          </h2>
          <ul className="divide-y divide-gray-200">
            {docs.map(d => (
              <li key={d.id} className="flex justify-between items-center py-3">
                <div className="space-y-1">
                  <p className="font-medium">{d.title}</p>
                  <p className="text-sm text-gray-500">{d.type}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      d.status === 'Завершена'
                        ? 'bg-green-100 text-green-600'
                        : d.status === 'В работе'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {d.status}
                  </span>
                  <button className="text-gray-600">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium flex items-center space-x-2">
            <TruckIcon className="w-6 h-6" />
            Логистика и транспорт
          </h2>
          <ul className="divide-y divide-gray-200">
            {shipments.map(s => (
              <li key={s.id} className="flex justify-between items-center py-3 text-sm">
                <div>
                  <p className="font-medium">{s.item}</p>
                  <p className="text-gray-500">{s.from} → {s.to}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    s.status === 'Доставлено'
                      ? 'bg-green-100 text-green-600'
                      : s.status === 'В пути'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium flex items-center space-x-2">
          <ChartBarIcon className="w-6 h-6" />
          Учет рабочего времени
        </h2>
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Сотрудник</th>
              <th className="px-4 py-2">Дата</th>
              <th className="px-4 py-2">Часы</th>
              <th className="px-4 py-2">Задача</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map(e => (
              <tr key={e.id}>
                <td className="px-4 py-2">{e.user}</td>
                <td className="px-4 py-2">{e.date}</td>
                <td className="px-4 py-2">{e.hours}</td>
                <td className="px-4 py-2">{e.task}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
