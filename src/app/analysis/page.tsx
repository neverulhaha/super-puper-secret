'use client';

import React, { useState } from 'react';
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

type Coordinates = {
  lat: string;
  long: string;
};

type Relief = {
  elevationProfile: number[];
};

type Resource = {
  name: string;
  abundance: string;
};

type Danger = {
  type: string;
  severity: 'low' | 'medium' | 'high';
};

type AnalysisResult = {
  relief: Relief;
  resources: Resource[];
  dangers: Danger[];
};

export default function AnalysisPage() {
  const [coords, setCoords] = useState<Coordinates>({ lat: '', long: '' });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [saved, setSaved] = useState(false);

  const handleAnalyze = () => {
    setResult({
      relief: {
        elevationProfile: [ -1750, -1700, -1725, -1690, -1680, -1705 ],
      },
      resources: [
        { name: 'Гелий-3', abundance: '0.13 %' },
        { name: 'Титан', abundance: '1.2 %' },
        { name: 'Кремний', abundance: '21.5 %' },
      ],
      dangers: [
        { type: 'Кратеры', severity: 'high' },
        { type: 'Склон 30°', severity: 'medium' },
        { type: 'Радиоактивные аномалии', severity: 'low' },
      ],
    });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
  };

  const handleUpdate = () => {
    setResult(null);
    setSaved(false);
    handleAnalyze();
  };

  const severityBadge = (severity: Danger['severity']) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-semibold">Анализ участка поверхности</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleUpdate}
            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            <ArrowPathIcon className="w-4 h-4 mr-1" />
            Обновить
          </button>
          {saved && (
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
              Сохранено
            </span>
          )}
        </div>
      </header>

      <section className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-medium mb-2">Введите координаты участка</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Широта (°)</label>
            <input
              type="text"
              value={coords.lat}
              onChange={e => setCoords({ ...coords, lat: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="Например, 14.657"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Долгота (°)</label>
            <input
              type="text"
              value={coords.long}
              onChange={e => setCoords({ ...coords, long: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="Например, 34.123"
            />
          </div>
          <button
            onClick={handleAnalyze}
            className="inline-flex items-center bg-blue-600 text-white px-5 py-2 rounded self-end"
          >
            <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
            Анализировать
          </button>
        </div>
      </section>

      {result && (
        <section className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <ChartBarIcon className="w-6 h-6 text-gray-600 mr-2" />
              Профиль высот
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {result.relief.elevationProfile.map((h, idx) => (
                <div key={idx} className="p-3 bg-gray-100 rounded">
                  <p className="font-medium">{h} m</p>
                  <p className="text-xs text-gray-500">Точка {idx + 1}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <CubeIcon className="w-6 h-6 text-gray-600 mr-2" />
              Ресурсы на участке
            </h3>
            <ul className="space-y-2">
              {result.resources.map((r, i) => (
                <li key={i} className="flex justify-between border-b pb-2">
                  <span>{r.name}</span>
                  <span className="font-medium">{r.abundance}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-gray-600 mr-2" />
              Обнаруженные опасности
            </h3>
            <ul className="space-y-2">
              {result.dangers.map((d, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>{d.type}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${severityBadge(d.severity)}`}>
                    {d.severity === 'low' && 'Низкая'}
                    {d.severity === 'medium' && 'Средняя'}
                    {d.severity === 'high' && 'Высокая'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-right">
            <button
              onClick={handleSave}
              disabled={saved}
              className={`inline-flex items-center px-6 py-2 rounded ${
                saved ? 'bg-gray-300 text-gray-600 cursor-default' : 'bg-green-600 text-white'
              }`}
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              {saved ? 'Сохранено' : 'Сохранить данные'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
 