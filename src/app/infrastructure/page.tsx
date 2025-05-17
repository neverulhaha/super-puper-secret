'use client';
import dynamic from "next/dynamic";
const LunarMap = dynamic(() => import('@/components/LunarMapEmbed'), { ssr: false });
import React, { useState } from 'react';
import {
  HomeIcon,
  RocketLaunchIcon,
  BeakerIcon,
  BoltIcon,
  CubeIcon,
  ArrowUpTrayIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

type InfrastructureType = {
  key: string;
  name: string;
  description: string;
  range: string;
  icon: React.ReactNode;
  color: string;
};

type Placement = {
  id: number;
  x: string;
  y: string;
  w: string;
  h: string;
};

export default function InfrastructurePage() {
  const types: InfrastructureType[] = [
    {
      key: 'module',
      name: 'Жилой модуль',
      description: 'Для экипажа и жизнеобеспечения',
      range: '100–300 м²',
      icon: <HomeIcon className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-400',
    },
    {
      key: 'launch',
      name: 'Космодром',
      description: 'Запуск и посадка ракет',
      range: '1000–2000 м²',
      icon: <RocketLaunchIcon className="w-5 h-5 text-purple-600" />,
      color: 'border-purple-400',
    },
    {
      key: 'lab',
      name: 'Исследовательская лаборатория',
      description: 'Анализ образцов и эксперименты',
      range: '200–500 м²',
      icon: <BeakerIcon className="w-5 h-5 text-green-600" />,
      color: 'border-green-400',
    },
    {
      key: 'power',
      name: 'Электростанция',
      description: 'Генерация энергии',
      range: '300–1000 м²',
      icon: <BoltIcon className="w-5 h-5 text-yellow-600" />,
      color: 'border-yellow-400',
    },
    {
      key: 'storage',
      name: 'Хранилище',
      description: 'Складские помещения',
      range: '150–400 м²',
      icon: <CubeIcon className="w-5 h-5 text-red-600" />,
      color: 'border-red-400',
    },
  ];

  const [selected, setSelected] = useState<string>(types[0].key);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = () => {
    const mock: Placement[] = types.slice(0, 3).map((_, i) => ({
      id: i + 1,
      x: `${10 + i * 30}%`,
      y: `${15 + i * 20}%`,
      w: `${20 + i * 10}%`,
      h: `${15 + i * 5}%`,
    }));
    setPlacements(mock);
    setCalculated(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen space-y-8 text-black pr-6 pt-6 pb-6 pl-0 lg:pl-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Планирование инфраструктуры</h1>
        <div className="space-x-2">
          <button className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded">
            <Cog6ToothIcon className="w-5 h-5 mr-1" /> Сохранить макет
          </button>
          <button className="inline-flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded">
            <ArrowUpTrayIcon className="w-5 h-5 mr-1" /> Экспортировать
          </button>
        </div>
      </header>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 bg-white rounded-lg shadow h-96 overflow-hidden">
          <div className="w-full h-full">
            <LunarMap />
          </div>
          <div className="absolute top-2 right-2 flex flex-col space-y-2 z-10">
            <button className="bg-white p-1 rounded shadow">
              <ArrowUpIcon className="w-4 h-4" />
            </button>
            <button className="bg-white p-1 rounded shadow">
              <ArrowDownIcon className="w-4 h-4" />
            </button>
          </div>
          {calculated &&
            placements.map((p) => (
              <div
                key={p.id}
                className={`absolute border-2 border-dashed bg-white/50 rounded ${types.find(t => t.key === selected)?.color}`}
                style={{ top: p.y, left: p.x, width: p.w, height: p.h }}
              >
                {types.find(t => t.key === selected)?.icon}
              </div>
            ))}
        </div>
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Планирование объекта</h2>
          <div className="space-y-2">
            {types.map((t) => (
              <div
                key={t.key}
                className={`flex items-center justify-between p-3 border rounded cursor-pointer ${selected === t.key ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setSelected(t.key)}
              >
                <div className="flex items-center space-x-3">
                  {t.icon}
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.description}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-700">{t.range}</span>
              </div>
            ))}
          </div>
          <div className="flex space-x-2 pt-4">
            <button
              onClick={handleCalculate}
              className="flex-1 inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded"
            >
              Рассчитать
            </button>
            <button className="flex-1 inline-flex items-center justify-center bg-gray-200 text-gray-700 px-4 py-2 rounded">
              Сброс
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Анализ безопасности</h3>
            <span className="text-sm text-blue-600">Детали &gt;</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Общая безопасность</span>
            <span className="font-medium">88%</span>
          </div>
          {[
            ['Структурная целостность', 98],
            ['Радиационная безопасность', 87],
            ['Аварийный доступ', 95],
            ['Распределение ресурсов', 72],
          ].map(([label, value], i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span>{value}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                <div className="bg-blue-500 h-2" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pt-2">
            <li>Усилить радиационную защиту исследовательской лаборатории</li>
            <li>Обеспечить аварийные выходы у всех модулей</li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Результаты оптимизации</h3>
            <span className="text-sm font-medium text-green-600">94%</span>
          </div>
          {[
            ['Использование площадей', 85, true],
            ['Эффективность ресурсов', 92, true],
            ['Среднее расстояние', 120, false],
            ['Оценка безопасности', 95, true],
          ].map(([label, value, up], i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span>{label}</span>
              <div className="flex items-center space-x-1">
                <span className="font-medium">{value}{label === 'Среднее расстояние' ? ' M' : '%'}</span>
                {typeof up === 'boolean' && (
                  up ? <ArrowUpIcon className="w-4 h-4 text-green-600" /> : <ArrowDownIcon className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
          ))}
          <div className="flex space-x-2 pt-4">
            <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded">Применить</button>
            <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded">Пересчитать</button>
          </div>
        </div>
      </div>
    </div>
  );
}
