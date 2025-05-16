'use client';
import dynamic from "next/dynamic";
import React, { useState, useCallback, useEffect } from 'react';
import {
  PlusIcon, ArrowUpTrayIcon, MagnifyingGlassIcon, XMarkIcon, CubeIcon,
  ExclamationTriangleIcon, EyeIcon, TrashIcon,
} from '@heroicons/react/24/outline';

const LunarMap = dynamic(() => import('@/components/LunarMapEmbed'), { ssr: false });

type Zone = {
  id: number;
  name: string;
  color: string;
};
type ResourceDistribution = { name: string; percentage: number; color: string; };
type RiskItem = { name: string; level: 'low' | 'medium' | 'high'; percent: number; };

type HistoryEntry = {
  id: number;
  created_at: string;
  lat: string;
  lon: string;
  summary: string;
  helium3: number;
  titanium: number;
  silicon: number;
  craters: number;
  slopes: number;
  radioactivity: number;
};

export default function AnalysisPage() {
  const [zones] = useState<Zone[]>([
    { id: 1, name: 'Зона A', color: 'border-blue-400' },
    { id: 2, name: 'Зона B', color: 'border-green-400' },
    { id: 3, name: 'Зона C', color: 'border-purple-400' },
  ]);

  const [coords, setCoords] = useState({ lat: '', long: '' });
  const handleSelectCoords = useCallback(
    (lat: number, lon: number) => setCoords({ lat: lat.toFixed(3), long: lon.toFixed(3) }),
    []
  );

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      const res = await fetch('/api/analysis');
      const data = await res.json();
      setHistory(data);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  const handleAnalyze = async () => {
    if (!coords.lat || !coords.long) {
      alert("Выберите координаты на Луне или заполните поля вручную.");
      return;
    }
    setLoading(true);
    const res = await fetch('/api/analysis', {
      method: 'POST',
      body: JSON.stringify({ lat: coords.lat, lon: coords.long }),
      headers: { 'Content-Type': 'application/json' },
    });
    const entry = await res.json();
    setHistory(prev => [entry, ...prev]);
    setLoading(false);
    setCoords({ lat: '', long: '' });
  };

  const handleReset = () => setCoords({ lat: '', long: '' });

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
        <div className="w-full lg:flex-1 bg-white rounded-lg shadow overflow-hidden flex items-stretch">
          <LunarMap onSelectCoords={handleSelectCoords} />
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
            <button
              className="flex-1 inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleAnalyze}
              disabled={loading}
            >
              <MagnifyingGlassIcon className="w-5 h-5 mr-2" /> {loading ? "Анализ..." : "Анализировать"}
            </button>
            <button
              className="flex-1 inline-flex items-center justify-center bg-gray-200 text-gray-700 px-4 py-2 rounded"
              onClick={handleReset}
              disabled={loading}
            >
              <XMarkIcon className="w-5 h-5 mr-2" /> Сброс
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Зоны интереса</h3>
        <div className="flex flex-wrap gap-2">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`px-3 py-1 rounded border-2 ${zone.color} bg-white shadow text-sm`}
            >
              {zone.name}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">История анализов</h3>
        <div className="table-container overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Координаты</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Результат</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ресурсы</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Риски</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody>
              {history.map(entry => (
                <tr key={entry.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.lat}°, {entry.lon}°</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{entry.summary}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-800">
                    <div>Гелий-3: {entry.helium3}%</div>
                    <div>Титан: {entry.titanium}%</div>
                    <div>Кремний: {entry.silicon}%</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-800">
                    <div>Кратеры: {entry.craters}%</div>
                    <div>Склоны: {entry.slopes}%</div>
                    <div>Радиоактивность: {entry.radioactivity}%</div>
                  </td>
                  <td className="flex space-x-2 px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <button>
                      <EyeIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <button>
                      <TrashIcon className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
