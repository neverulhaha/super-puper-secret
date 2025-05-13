'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  MinusIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChartBarIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

type Zone = {
  id: number;
  name: string;
  color: string;
  top: string;
  left: string;
  width: string;
  height: string;
};

type ResourceDistribution = {
  name: string;
  percentage: number;
  color: string;
};

type RiskItem = {
  name: string;
  level: 'low' | 'medium' | 'high';
  percent: number;
};

type HistoryEntry = {
  id: number;
  date: string;
  coords: string;
  summary: string;
};

export default function AnalysisPage() {
  const [zones] = useState<Zone[]>([
    { id: 1, name: 'Зона A', color: 'border-blue-400', top: '10%', left: '10%', width: '30%', height: '25%' },
    { id: 2, name: 'Зона B', color: 'border-green-400', top: '50%', left: '20%', width: '25%', height: '30%' },
    { id: 3, name: 'Зона C', color: 'border-purple-400', top: '30%', left: '60%', width: '30%', height: '20%' },
  ]);

  const [coords, setCoords] = useState({ lat: '', long: '' });
  const [resources] = useState<ResourceDistribution[]>([
    { name: 'Гелий-3', percentage: 12.3, color: 'bg-blue-500' },
    { name: 'Титан', percentage: 25.8, color: 'bg-green-500' },
    { name: 'Кремний', percentage: 61.9, color: 'bg-yellow-500' },
  ]);
  const [risks] = useState<RiskItem[]>([
    { name: 'Кратеры', level: 'medium', percent: 45 },
    { name: 'Склоны >30°', level: 'high', percent: 75 },
    { name: 'Радиоактивность', level: 'low', percent: 15 },
  ]);
  const [history] = useState<HistoryEntry[]>([
    { id: 1, date: '2025-05-12', coords: '14.657°, 34.123°', summary: 'Низкая опасность' },
    { id: 2, date: '2025-05-10', coords: '15.002°, 33.987°', summary: 'Средняя опасность' },
    { id: 3, date: '2025-05-08', coords: '14.123°, 34.456°', summary: 'Высокая опасность' },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Исследование участка</h1>
        <div className="space-x-2">
          <button className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded">
            <PlusIcon className="w-4 h-4 mr-1" /> Новая зона
          </button>
          <button className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded">
            <ArrowUpTrayIcon className="w-4 h-4 mr-1" /> Экспортировать
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 bg-white rounded-lg shadow h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gray-200" />
          <div className="absolute top-2 right-2 flex flex-col space-y-2">
            <button className="bg-white p-1 rounded shadow">
              <PlusIcon className="w-4 h-4" />
            </button>
            <button className="bg-white p-1 rounded shadow">
              <MinusIcon className="w-4 h-4" />
            </button>
          </div>
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`absolute border-2 ${zone.color} rounded`}
              style={{
                top: zone.top,
                left: zone.left,
                width: zone.width,
                height: zone.height,
              }}
            >
              <span className="absolute -top-5 left-0 bg-white text-xs px-1 rounded shadow">
                {zone.name}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Координаты</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Широта</label>
              <input
                type="text"
                value={coords.lat}
                onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Например, 14.657"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Долгота</label>
              <input
                type="text"
                value={coords.long}
                onChange={(e) => setCoords({ ...coords, long: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Например, 34.123"
              />
            </div>
          </div>
          <div className="flex space-x-2 pt-4">
            <button className="flex-1 inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded">
              <MagnifyingGlassIcon className="w-5 h-5 mr-2" /> Анализировать
            </button>
            <button className="flex-1 inline-flex items-center justify-center bg-gray-200 text-gray-700 px-4 py-2 rounded">
              <XMarkIcon className="w-5 h-5 mr-2" /> Сброс
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <CubeIcon className="w-6 h-6 text-gray-600 mr-2" />
            Распределение ресурсов
          </h3>
          {resources.map((r, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{r.name}</span>
                <span>{r.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                <div className={`${r.color} h-2`} style={{ width: `${r.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-gray-600 mr-2" />
            Оценка рисков
          </h3>
          {risks.map((risk, i) => {
            const color =
              risk.level === 'low'
                ? 'bg-green-500'
                : risk.level === 'medium'
                ? 'bg-yellow-500'
                : 'bg-red-500';
            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{risk.name}</span>
                  <span className="capitalize">{risk.level}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                  <div className={`${color} h-2`} style={{ width: `${risk.percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">История анализов</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-sm font-medium">Дата</th>
              <th className="py-2 text-sm font-medium">Координаты</th>
              <th className="py-2 text-sm font-medium">Результат</th>
              <th className="py-2 text-sm font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id} className="border-b even:bg-gray-50">
                <td className="py-2 text-sm">{entry.date}</td>
                <td className="py-2 text-sm">{entry.coords}</td>
                <td className="py-2 text-sm">{entry.summary}</td>
                <td className="py-2 text-sm space-x-2">
                  <button className="inline-flex items-center text-gray-600 hover:text-gray-800">
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button className="inline-flex items-center text-red-600 hover:text-red-800">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
