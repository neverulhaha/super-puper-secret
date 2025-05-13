// app/resources/page.tsx
'use client';
import React from 'react';
import {
  CloudArrowDownIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

const summaryMetrics = [
  { key: 'water', name: 'Вода', icon: <CloudArrowDownIcon className="w-6 h-6 text-blue-500" />, value: 80, color: 'bg-blue-500' },
  { key: 'oxygen', name: 'Кислород', icon: <SparklesIcon className="w-6 h-6 text-green-500" />, value: 95, color: 'bg-green-500' },
  { key: 'energy', name: 'Энергия', icon: <BoltIcon className="w-6 h-6 text-yellow-500" />, value: 60, color: 'bg-yellow-500' },
  { key: 'hydrogen', name: 'Водород', icon: <FireIcon className="w-6 h-6 text-red-500" />, value: 50, color: 'bg-red-500' },
];

const moduleDistributions = [
  { name: 'Жилые модули', water: 30, oxygen: 50, hydrogen: 20 },
  { name: 'Лаборатория', water: 25, oxygen: 60, hydrogen: 15 },
  { name: 'Промышленность', water: 40, oxygen: 30, hydrogen: 30 },
  { name: 'Складские помещения', water: 20, oxygen: 40, hydrogen: 40 },
];

const resourceStats = [
  { name: 'Всего ресурсов', value: '2.31 млн', change: 3.2, up: true },
  { name: 'Эффективность переработки', value: '94.5 %', change: -1.1, up: false },
  { name: 'Потоки ресурсов', value: '0.8 %', change: 0.5, up: true },
  { name: 'Осталось ресурсов', value: '85 %', change: -2.0, up: false },
];

const tableData = [
  { module: 'Жилые модули', water: 25, oxygen: 35, hydrogen: 30, energy: 10 },
  { module: 'Лаборатория', water: 20, oxygen: 40, hydrogen: 25, energy: 15 },
  { module: 'Промышленность', water: 30, oxygen: 30, hydrogen: 20, energy: 20 },
  { module: 'Складские помещения', water: 15, oxygen: 25, hydrogen: 30, energy: 30 },
];

const sustainabilityMetrics = [
  { name: 'Распределение ресурсов', value: 99.5, change: 1.2, up: true },
  { name: 'Энергоэффективность', value: 92.5, change: 5.4, up: true },
  { name: 'Сохранение ресурсов', value: 88.2, change: -3.4, up: false },
  { name: 'Оптимизация системы', value: 91.0, change: 4.2, up: true },
];

export default function ResourcesPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Управление ресурсами</h1>
        <button className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded">Обновить данные</button>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryMetrics.map(m => (
          <div key={m.key} className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
            {m.icon}
            <div className="flex-1">
              <div className="text-sm text-gray-500">{m.name}</div>
              <div className="text-xl font-medium">{m.value}%</div>
              <div className="w-full bg-gray-200 h-2 rounded mt-1">
                <div className={`${m.color} h-2 rounded`} style={{ width: `${m.value}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Распределение ресурсов</h2>
          {moduleDistributions.map(md => (
            <div key={md.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{md.name}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded overflow-hidden flex">
                <div className="bg-blue-500 h-2" style={{ width: `${md.water}%` }} />
                <div className="bg-green-500 h-2" style={{ width: `${md.oxygen}%` }} />
                <div className="bg-red-500 h-2" style={{ width: `${md.hydrogen}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Статистика ресурсов</h2>
          {resourceStats.map(rs => (
            <div key={rs.name} className="flex justify-between items-center">
              <span className="text-sm">{rs.name}</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{rs.value}</span>
                {rs.up ? <ArrowUpIcon className="w-4 h-4 text-green-500" /> : <ArrowDownIcon className="w-4 h-4 text-red-500" />}
                <span className={`text-sm ${rs.up ? 'text-green-500' : 'text-red-500'}`}>{Math.abs(rs.change)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Модуль</th>
              <th className="p-3">Вода, %</th>
              <th className="p-3">Кислород, %</th>
              <th className="p-3">Водород, %</th>
              <th className="p-3">Энергия, %</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(td => (
              <tr key={td.module} className="border-b even:bg-gray-50">
                <td className="p-3">{td.module}</td>
                <td className="p-3">{td.water}%</td>
                <td className="p-3">{td.oxygen}%</td>
                <td className="p-3">{td.hydrogen}%</td>
                <td className="p-3">{td.energy}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sustainabilityMetrics.map(sm => (
          <div key={sm.name} className="bg-white rounded-lg shadow p-4 flex flex-col space-y-2">
            <div className="text-sm text-gray-500">{sm.name}</div>
            <div className="text-xl font-medium">{sm.value}%</div>
            <div className="flex items-center space-x-1">
              {sm.up ? <ArrowUpIcon className="w-4 h-4 text-green-500" /> : <ArrowDownIcon className="w-4 h-4 text-red-500" />}
              <span className={`text-sm ${sm.up ? 'text-green-500' : 'text-red-500'}`}>{Math.abs(sm.change)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
