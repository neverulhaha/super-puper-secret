// app/resources/page.tsx
'use client';
import React, { useState } from 'react';
import {
  BeakerIcon,
  FireIcon,
  SparklesIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

type Resource = {
  key: string;
  name: string;
  icon: React.ReactNode;
  available: number;
  unit: string;
};

type Allocation = {
  module: string;
  water: number;
  oxygen: number;
  hydrogen: number;
};

type NumericKey = 'water' | 'oxygen' | 'hydrogen';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([
    { key: 'water', name: 'Вода', icon: <BeakerIcon className="w-6 h-6 text-blue-600" />, available: 1000, unit: 'л' },
    { key: 'oxygen', name: 'Кислород', icon: <SparklesIcon className="w-6 h-6 text-green-600" />, available: 500, unit: 'м³' },
    { key: 'hydrogen', name: 'Водород', icon: <FireIcon className="w-6 h-6 text-purple-600" />, available: 200, unit: 'кг' },
  ]);
  const [allocations, setAllocations] = useState<Allocation[]>([
    { module: 'Модуль A', water: 300, oxygen: 120, hydrogen: 50 },
    { module: 'Лаборатория', water: 200, oxygen: 80, hydrogen: 30 },
    { module: 'Космодром', water: 150, oxygen: 60, hydrogen: 20 },
  ]);

  const handleResourceChange = (key: string, value: number) => {
    setResources(resources.map(r => r.key === key ? { ...r, available: value } : r));
  };

  const handleAllocationChange = (idx: number, field: NumericKey, value: number) => {
    const newAlloc = [...allocations];
    newAlloc[idx][field] = value;
    setAllocations(newAlloc);
  };

  const totalUsed = (field: NumericKey) => allocations.reduce((sum, a) => sum + a[field], 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Управление ресурсами</h1>
        <div className="space-x-2">
          <button className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded">
            <ArrowUpTrayIcon className="w-5 h-5 mr-1" /> Сохранить
          </button>
          <button className="inline-flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded">
            <DocumentTextIcon className="w-5 h-5 mr-1" /> Отчёт
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map(r => (
          <div key={r.key} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center space-x-3">
              {r.icon}
              <h2 className="text-lg font-medium">{r.name}</h2>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={r.available}
                onChange={e => handleResourceChange(r.key, Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
              <span>{r.unit}</span>
            </div>
            <div className="text-sm text-gray-500">
              Всего доступно: {r.available} {r.unit}
            </div>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Распределение между модулями</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Модуль</th>
              <th className="py-2">Вода (л)</th>
              <th className="py-2">Кислород (м³)</th>
              <th className="py-2">Водород (кг)</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((a, i) => (
              <tr key={i} className="border-b even:bg-gray-50">
                <td className="py-2">{a.module}</td>
                <td className="py-2">
                  <input
                    type="number"
                    value={a.water}
                    onChange={e => handleAllocationChange(i, 'water', Number(e.target.value))}
                    className="w-20 border rounded px-2 py-1"
                  />
                </td>
                <td className="py-2">
                  <input
                    type="number"
                    value={a.oxygen}
                    onChange={e => handleAllocationChange(i, 'oxygen', Number(e.target.value))}
                    className="w-20 border rounded px-2 py-1"
                  />
                </td>
                <td className="py-2">
                  <input
                    type="number"
                    value={a.hydrogen}
                    onChange={e => handleAllocationChange(i, 'hydrogen', Number(e.target.value))}
                    className="w-20 border rounded px-2 py-1"
                  />
                </td>
              </tr>
            ))}
            <tr className="font-medium">
              <td className="py-2">Итого</td>
              <td className="py-2">{totalUsed('water')}</td>
              <td className="py-2">{totalUsed('oxygen')}</td>
              <td className="py-2">{totalUsed('hydrogen')}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-lg font-medium">Показатели устойчивости</h3>
          {[
            ['Рециркуляция воды', 85],
            ['Консервация кислорода', 92],
            ['Производство водорода', 78],
          ].map(([label, value], i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span>{value}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                <div className="bg-green-500 h-2" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-lg font-medium">Аналитика потребления</h3>
          {[
            ['Суточное потребление воды', 450, 'л'],
            ['Суточное потребление O₂', 120, 'м³'],
            ['Суточное потребление H₂', 30, 'кг'],
          ].map(([label, value, unit], i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{label}</span>
              <span className="font-medium">{value} {unit}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
