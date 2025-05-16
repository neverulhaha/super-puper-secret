'use client';
import dynamic from "next/dynamic";
import React, { useState, useCallback, useEffect } from 'react';
import {
  ArrowUpTrayIcon, MagnifyingGlassIcon, XMarkIcon, CubeIcon,
  ExclamationTriangleIcon, EyeIcon, TrashIcon,
} from '@heroicons/react/24/outline';

const LunarMap = dynamic(() => import('@/components/LunarMapEmbed'), { ssr: false });

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
  const [coords, setCoords] = useState({ lat: '', long: '' });
  const handleSelectCoords = useCallback(
    (lat: number, lon: number) => setCoords({ lat: lat.toFixed(3), long: lon.toFixed(3) }),
    []
  );

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<HistoryEntry | null>(null);

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

  const handleDelete = async (id: number) => {
    setLoading(true);
    await fetch(`/api/analysis/${id}`, { method: 'DELETE' });
    setHistory(prev => prev.filter(entry => entry.id !== id));
    setLoading(false);
    if (selected && selected.id === id) setSelected(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Исследование участка</h1>
        <button className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded">
          <ArrowUpTrayIcon className="w-4 h-4 mr-1" /> Экспортировать
        </button>
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
                    <button onClick={() => setSelected(entry)}>
                      <EyeIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <button onClick={() => handleDelete(entry.id)}>
                      <TrashIcon className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg p-8 min-w-[340px] max-w-[95vw]" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-2">Детали анализа</h2>
            <div className="mb-2 text-gray-700">Дата: <b>{selected.created_at?.slice(0, 16).replace('T', ' ')}</b></div>
            <div className="mb-2">Координаты: <b>{selected.lat}°, {selected.lon}°</b></div>
            <div className="mb-2">Результат: <b>{selected.summary}</b></div>
            <div className="mb-2">
              <div className="font-semibold mb-1">Ресурсы:</div>
              <div>Гелий-3: <b>{selected.helium3}%</b></div>
              <div>Титан: <b>{selected.titanium}%</b></div>
              <div>Кремний: <b>{selected.silicon}%</b></div>
            </div>
            <div className="mb-2">
              <div className="font-semibold mb-1">Риски:</div>
              <div>Кратеры: <b>{selected.craters}%</b></div>
              <div>Склоны: <b>{selected.slopes}%</b></div>
              <div>Радиоактивность: <b>{selected.radioactivity}%</b></div>
            </div>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setSelected(null)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}
