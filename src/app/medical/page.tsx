// app/medicine/page.tsx
'use client';
import React, { useState } from 'react';
import {
  UsersIcon,
  HeartIcon,
  SparklesIcon,
  BellAlertIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

type Patient = {
  id: number;
  name: string;
  role: string;
  heartRate: number;
  temperature: number;
  bp: string;
  spo2: number;
  status: 'ok' | 'alert';
};

type Protocol = {
  id: number;
  title: string;
  category: string;
  description: string;
  nextDue: string;
  status: 'ok' | 'alert' | 'info';
};

type Report = {
  id: number;
  title: string;
  date: string;
  type: string;
  status: 'Выполнено' | 'В ожидании';
  worker: string;
};

export default function MedicinePage() {
  const [patients] = useState<Patient[]>([
    { id: 1, name: 'Егор Ильин', role: 'Командир миссии', heartRate: 72, temperature: 36.6, bp: '120/80 мм рт.ст.', spo2: 98, status: 'ok' },
    { id: 2, name: 'Егор Ильин', role: 'Научный сотрудник', heartRate: 85, temperature: 37.2, bp: '135/85 мм рт.ст.', spo2: 96, status: 'alert' },
    { id: 3, name: 'Егор Ильин', role: 'Медработник', heartRate: 68, temperature: 36.8, bp: '118/75 мм рт.ст.', spo2: 99, status: 'ok' },
  ]);
  const [protocols] = useState<Protocol[]>([
    { id: 1, title: 'Ежедневный осмотр здоровья', category: 'Общий', description: 'Стандартный мониторинг жизненных показателей', nextDue: '2 часа', status: 'ok' },
    { id: 2, title: 'Проверка радиационного облучения', category: 'Безопасность', description: 'Ежедневная оценка радиации', nextDue: 'Просрочен', status: 'alert' },
    { id: 3, title: 'Оценка психического здоровья', category: 'Здоровье', description: 'Регулярная психологическая оценка', nextDue: '3 дня', status: 'info' },
  ]);
  const [reports] = useState<Report[]>([
    { id: 1, title: 'Ежемесячная оценка состояния здоровья', date: '2025-05-15', type: 'Регулярный осмотр', status: 'Выполнено', worker: 'Доктор Ильин Егор' },
    { id: 2, title: 'Отчет о радиационном облучении', date: '2025-05-14', type: 'Проверка безопасности', status: 'В ожидании', worker: 'Доктор Ильин Егор' },
    { id: 3, title: 'Психологическое обследование', date: '2025-05-13', type: 'Психическое здоровье', status: 'Выполнено', worker: 'Доктор Ильин Егор' },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <h1 className="text-2xl font-semibold">Медицинское обслуживание</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <UsersIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Состояние здоровья экипажа</p>
            <p className="text-lg font-medium">24/30</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <HeartIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Средние жизненные показатели</p>
            <p className="text-lg font-medium">Нормальное</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <SparklesIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Психическое здоровье</p>
            <p className="text-lg font-medium">Стабильное</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <BellAlertIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Медицинские уведомления</p>
            <p className="text-lg font-medium">2 Активно</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-medium">Контроль состояния здоровья</h2>
          <ul className="space-y-4">
            {patients.map(p => (
              <li key={p.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.role}</p>
                  <div className="flex space-x-4 text-sm mt-2">
                    <span>💓 {p.heartRate} уд/мин</span>
                    <span>🌡 {p.temperature}°C</span>
                    <span>🩸 {p.bp}</span>
                    <span>🫁 {p.spo2}%</span>
                  </div>
                </div>
                {p.status === 'ok' ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                ) : (
                  <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-medium">Медицинские протоколы</h2>
          <ul className="space-y-4">
            {protocols.map(pr => (
              <li key={pr.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    {pr.status === 'ok' && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                    {pr.status === 'alert' && <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />}
                    {pr.status === 'info' && <ClockIcon className="w-5 h-5 text-blue-500" />}
                    <span className="font-medium">{pr.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{pr.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Следующий срок: {pr.nextDue}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button className="text-sm text-blue-600 flex items-center space-x-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>Смотреть детали</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded">Добавить новый протокол</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-medium mb-4">Медицинские отчёты</h2>
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Отчет</th>
              <th className="px-4 py-2">Дата</th>
              <th className="px-4 py-2">Тип</th>
              <th className="px-4 py-2">Статус</th>
              <th className="px-4 py-2">Работник</th>
              <th className="px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map(r => (
              <tr key={r.id}>
                <td className="px-4 py-2">{r.title}</td>
                <td className="px-4 py-2">{r.date}</td>
                <td className="px-4 py-2">{r.type}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    r.status === 'Выполнено' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>{r.status}</span>
                </td>
                <td className="px-4 py-2">{r.worker}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <EyeIcon className="w-5 h-5 text-gray-600 cursor-pointer" />
                  <ArrowDownTrayIcon className="w-5 h-5 text-gray-600 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
