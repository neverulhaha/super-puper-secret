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

  // ----------- Экспорт функций -----------

  function downloadAnalysis(entry: HistoryEntry, type: 'json' | 'csv') {
    if (!entry) return;
    const filename = `lunar_analysis_${entry.id}.${type}`;
    let content = '';
    if (type === 'json') {
      content = JSON.stringify(entry, null, 2);
    } else {
      // CSV
      const fields = Object.keys(entry);
      const csvRow = fields.map(f => `"${(entry as any)[f]}"`).join(',');
      content = fields.join(',') + '\n' + csvRow;
    }
    const blob = new Blob([content], { type: type === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadHistory(history: HistoryEntry[], type: 'csv' | 'json' = 'csv') {
    if (!history.length) return;
    const filename = `lunar_analysis_history.${type}`;
    let content = '';
    if (type === 'json') {
      content = JSON.stringify(history, null, 2);
    } else {
      // CSV
      const fields = Object.keys(history[0]);
      content = fields.join(',') + '\n' +
        history.map(entry => fields.map(f => `"${(entry as any)[f]}"`).join(',')).join('\n');
    }
    const blob = new Blob([content], { type: type === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ----------- UI -----------

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <header className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center">
        <h1 className="text-2xl font-semibold">Исследование участка</h1>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded"
            onClick={() => downloadHistory(history, 'csv')}
            disabled={!history.length}
          >
            <ArrowUpTrayIcon className="w-4 h-4 mr-1" />
            Экспорт CSV
          </button>
          <button
            className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded"
            onClick={() => downloadHistory(history, 'json')}
            disabled={!history.length}
          >
            <ArrowUpTrayIcon className="w-4 h-4 mr-1" />
            Экспорт JSON
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
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in">
    <div
      className="relative bg-white rounded-2xl shadow-2xl p-8 w-[370px] max-w-[96vw] border border-gray-200"
      onClick={e => e.stopPropagation()}
      style={{
        boxShadow:
          "0 6px 32px 0 rgba(0,0,0,0.20), 0 1.5px 8px 0 rgba(0,0,0,0.18)",
      }}
    >
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        onClick={() => setSelected(null)}
        aria-label="Закрыть"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
      <h2 className="text-xl font-bold mb-4 text-center text-gray-900 tracking-tight">Детали анализа</h2>

      <div className="mb-2 text-gray-600 flex justify-between">
        <span>Дата:</span>
        <b className="text-gray-900">{selected.created_at?.slice(0, 16).replace('T', ' ')}</b>
      </div>
      <div className="mb-2 text-gray-600 flex justify-between">
        <span>Координаты:</span>
        <b className="text-gray-900">{selected.lat}°, {selected.lon}°</b>
      </div>
      <div className="mb-4 text-gray-600 flex justify-between">
        <span>Результат:</span>
        <b className={`ml-2 ${selected.summary.includes('Высок') ? "text-red-600" : selected.summary.includes('Средн') ? "text-yellow-600" : "text-green-600"}`}>{selected.summary}</b>
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      <div className="mb-2 font-semibold text-gray-900 text-sm">Ресурсы:</div>
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex justify-between"><span className="text-gray-600">Гелий-3:</span><b className="text-blue-600">{selected.helium3}%</b></div>
        <div className="flex justify-between"><span className="text-gray-600">Титан:</span><b className="text-green-600">{selected.titanium}%</b></div>
        <div className="flex justify-between"><span className="text-gray-600">Кремний:</span><b className="text-yellow-600">{selected.silicon}%</b></div>
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      <div className="mb-2 font-semibold text-gray-900 text-sm">Риски:</div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between"><span className="text-gray-600">Кратеры:</span><b className="text-rose-500">{selected.craters}%</b></div>
        <div className="flex justify-between"><span className="text-gray-600">Склоны:</span><b className="text-orange-500">{selected.slopes}%</b></div>
        <div className="flex justify-between"><span className="text-gray-600">Радиоактивность:</span><b className="text-violet-500">{selected.radioactivity}%</b></div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button
          className="w-full rounded-xl bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 shadow"
          onClick={() => downloadAnalysis(selected, 'json')}
        >
          Скачать как JSON
        </button>
        <button
          className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 transition text-white font-semibold py-2 shadow"
          onClick={() => downloadAnalysis(selected, 'csv')}
        >
          Скачать как CSV
        </button>
      </div>
      <button
        className="mt-4 w-full rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 shadow"
        onClick={() => setSelected(null)}
      >
        Закрыть
      </button>
    </div>
  </div>
)}
    </div>
  );
}
