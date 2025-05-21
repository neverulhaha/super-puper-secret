'use client';
import dynamic from "next/dynamic";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ArrowUpTrayIcon, MagnifyingGlassIcon, XMarkIcon,
  EyeIcon, TrashIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { supabase } from '@/lib/supabase';

const LunarMapEmbedInfrastructure = dynamic(() => import('@/components/LunarMapEmbedInfrastructure'), { ssr: false });

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

const types = [
  { key: 'module', name: 'Жилой модуль', color: '#3b82f6' },
  { key: 'launch', name: 'Космодром', color: '#a855f7' },
  { key: 'lab', name: 'Исследовательская лаборатория', color: '#22c55e' },
  { key: 'power', name: 'Электростанция', color: '#f59e42' },
  { key: 'storage', name: 'Хранилище', color: '#f43f5e' }
];

function getTypeColor(typeKey: string) {
  return types.find(t => t.key === typeKey)?.color || '#2196f3';
}

function ProgressLine({ name, value, color } : { name: string, value: number, color: string }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="min-w-[110px] max-w-[130px] text-gray-700 text-sm truncate">{name}</span>
      <div className="flex-1 h-2 bg-gray-300 rounded overflow-hidden">
        <div className={`${color} h-2 rounded transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="ml-2 text-gray-700 text-xs" style={{ minWidth: 44, textAlign: "right" }}>{value.toFixed(1)}%</span>
    </div>
  );
}

function RiskLine({ name, value } : { name: string, value: number }) {
  let label = "Низкий", labelColor = "text-green-600", barColor = "bg-green-500";
  if (value >= 70) { label = "Высокий"; labelColor = "text-red-600"; barColor = "bg-red-500"; }
  else if (value >= 40) { label = "Средний"; labelColor = "text-yellow-700"; barColor = "bg-yellow-400"; }
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="min-w-[110px] max-w-[130px] text-gray-700 text-sm truncate">{name}</span>
      <div className="flex-1 h-2 bg-gray-300 rounded overflow-hidden">
        <div className={`${barColor} h-2 rounded transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className={`ml-2 font-bold text-xs ${labelColor}`} style={{ minWidth: 60, textAlign: "right" }}>
        {label} <span className="text-gray-700 font-normal">({value.toFixed(0)}%)</span>
      </span>
    </div>
  );
}

export default function AnalysisPage() {
  const [infrastructureObjects, setInfrastructureObjects] = useState<any[]>([]);
  const [coords, setCoords] = useState({ lat: '', long: '' });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<HistoryEntry | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<HistoryEntry | null>(null);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<{ from: string, to: string }>({ from: '', to: '' });
  const [coordsFilter, setCoordsFilter] = useState<{ minLat: string, maxLat: string, minLon: string, maxLon: string }>({ minLat: '', maxLat: '', minLon: '', maxLon: '' });
  const [resourceFilter, setResourceFilter] = useState<{ helium3: string, titanium: string, silicon: string }>({ helium3: '', titanium: '', silicon: '' });

  const importFileRef = useRef<HTMLInputElement>(null);
  const importFileSingleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchInfrastructureForUser() {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;
      const { data } = await supabase
        .from('layouts')
        .select('data')
        .eq('user_id', userId)
        .order('id', { ascending: false })
        .limit(1)
        .single();
      if (data && data.data) setInfrastructureObjects(data.data);
    }
    fetchInfrastructureForUser();
  }, []);

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

  useEffect(() => {
    if (coords.lat && coords.long) {
      const found = history.find(
        (h) => Number(h.lat).toFixed(3) === Number(coords.lat).toFixed(3)
          && Number(h.lon).toFixed(3) === Number(coords.long).toFixed(3)
      );
      setCurrentAnalysis(found ?? null);
    } else {
      setCurrentAnalysis(null);
    }
  }, [coords, history]);

  const handleSelectCoords = useCallback(
    (lat: number, lon: number) => setCoords({ lat: lat.toFixed(3), long: lon.toFixed(3) }),
    []
  );

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

  const handleReset = () => {
    setCoords({ lat: '', long: '' });
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    await fetch(`/api/analysis/${id}`, { method: 'DELETE' });
    setHistory(prev => prev.filter(entry => entry.id !== id));
    setLoading(false);
    if (selected && selected.id === id) setSelected(null);
    setCompareIds(prev => prev.filter(cid => cid !== id));
  };

  function downloadAnalysis(entry: HistoryEntry, type: 'json' | 'csv') {
    if (!entry) return;
    const filename = `lunar_analysis_${entry.id}.${type}`;
    let content = '';
    if (type === 'json') {
      content = JSON.stringify(entry, null, 2);
    } else {
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

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    try {
      let entries: any[] = [];
      const text = await file.text();

      if (file.name.endsWith('.json')) {
        const parsed = JSON.parse(text);
        entries = Array.isArray(parsed) ? parsed : [parsed];
      } else if (file.name.endsWith('.csv')) {
        const [headerLine, ...lines] = text.split('\n').map(l => l.trim()).filter(Boolean);
        const headers = headerLine.split(',').map(h => h.replace(/"/g, ''));
        entries = lines.map(line => {
          const values = line.split(',').map(v => v.replace(/"/g, ''));
          const obj: any = {};
          headers.forEach((h, i) => obj[h] = values[i]);
          ['helium3', 'titanium', 'silicon', 'craters', 'slopes', 'radioactivity'].forEach(key => {
            if (obj[key]) obj[key] = Number(obj[key]);
          });
          return obj;
        });
      } else {
        alert("Поддерживаются только .json и .csv файлы.");
        setLoading(false);
        return;
      }

      const res = await fetch('/api/analysis/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entries),
      });

      if (res.ok) {
        const newHistory = await res.json();
        setHistory(newHistory);
        alert('Импорт завершён успешно!');
      } else {
        alert('Ошибка при импорте');
      }
    } catch (err) {
      alert('Ошибка при импорте файла!');
      console.error(err);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  }

  function handleCompareToggle(id: number) {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(cid => cid !== id);
      if (prev.length < 3) return [...prev, id];
      return prev;
    });
  }

  const compareEntries = history.filter(h => compareIds.includes(h.id));

  const compareData = [
    { label: "Гелий-3", key: "helium3" },
    { label: "Титан", key: "titanium" },
    { label: "Кремний", key: "silicon" },
    { label: "Кратеры", key: "craters" },
    { label: "Склоны", key: "slopes" },
    { label: "Радиоактивность", key: "radioactivity" }
  ];

  const chartData = compareData.map(row => {
    const obj: any = { name: row.label };
    compareEntries.forEach(e => {
      obj[`#${e.id}`] = e[row.key as keyof HistoryEntry];
    });
    return obj;
  });

  const filteredHistory = history.filter(entry => {
    if (search && !entry.summary.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (dateRange.from && entry.created_at < dateRange.from) return false;
    if (dateRange.to && entry.created_at > dateRange.to) return false;
    const lat = parseFloat(entry.lat);
    const lon = parseFloat(entry.lon);
    if (coordsFilter.minLat && lat < parseFloat(coordsFilter.minLat)) return false;
    if (coordsFilter.maxLat && lat > parseFloat(coordsFilter.maxLat)) return false;
    if (coordsFilter.minLon && lon < parseFloat(coordsFilter.minLon)) return false;
    if (coordsFilter.maxLon && lon > parseFloat(coordsFilter.maxLon)) return false;
    if (resourceFilter.helium3 && entry.helium3 < parseFloat(resourceFilter.helium3)) return false;
    if (resourceFilter.titanium && entry.titanium < parseFloat(resourceFilter.titanium)) return false;
    if (resourceFilter.silicon && entry.silicon < parseFloat(resourceFilter.silicon)) return false;
    return true;
  });

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
          <input
            type="file"
            accept=".json,.csv"
            ref={importFileRef}
            style={{ display: "none" }}
            onChange={handleImportFile}
          />
          <label
            htmlFor="import-file"
            className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded cursor-pointer"
            onClick={() => importFileRef.current?.click()}
          >
            <ArrowUpTrayIcon className="w-4 h-4 mr-1 rotate-180" />
            Импортировать
          </label>
        </div>
      </header>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 bg-white rounded-lg shadow overflow-hidden w-full">
          <LunarMapEmbedInfrastructure mapObjects={infrastructureObjects} getTypeColor={getTypeColor} onSelectCoords={handleSelectCoords} />
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
                <th />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Координаты</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Результат</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ресурсы</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Риски</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(entry => (
                <tr key={entry.id}>
                  <td className="align-middle px-1 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-500"
                      checked={compareIds.includes(entry.id)}
                      onChange={() => handleCompareToggle(entry.id)}
                      disabled={
                        !compareIds.includes(entry.id) && compareIds.length >= 3
                      }
                    />
                  </td>
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
    <div
      className="relative bg-gray-50 rounded-3xl shadow-2xl border border-gray-200 w-full max-w-md p-7"
      onClick={e => e.stopPropagation()}
      style={{ boxShadow: "0 8px 40px 0 rgba(0,0,0,0.20)" }}
    >
      <button
        className="absolute top-5 right-5 text-gray-400 hover:text-black transition"
        onClick={() => setSelected(null)}
        aria-label="Закрыть"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MagnifyingGlassIcon className="w-7 h-7 text-blue-500" />
        Детали анализа участка
      </h2>
      <div className="mb-3 flex flex-col gap-2">
        <div className="flex justify-between items-center text-gray-500 text-sm">
          <span>Дата:</span>
          <span className="text-gray-900 font-semibold">{selected.created_at?.slice(0, 16).replace('T', ' ')}</span>
        </div>
        <div className="flex justify-between items-center text-gray-500 text-sm">
          <span>Координаты:</span>
          <span className="text-gray-900 font-bold text-lg">{selected.lat}°, {selected.lon}°</span>
        </div>
      </div>
      <div className="bg-gray-200 rounded-xl px-5 py-3 mb-6 flex flex-col gap-1 shadow-inner">
        <div className="text-gray-600 text-xs font-semibold mb-1">Общая оценка</div>
        <span className={
          `text-base font-bold ${selected.summary.includes('Высок') ? "text-red-600" :
          selected.summary.includes('Средн') ? "text-yellow-700" :
          "text-green-700"}`
        }>
          {selected.summary}
        </span>
      </div>
        <div className="mb-4">
        <div className="font-bold text-blue-600 text-lg mb-2">Ресурсы</div>
        <div className="space-y-3">
          <ProgressLine name="Гелий-3" value={selected.helium3} color="bg-blue-500" />
          <ProgressLine name="Титан" value={selected.titanium} color="bg-green-500" />
          <ProgressLine name="Кремний" value={selected.silicon} color="bg-yellow-400" />
        </div>
      </div>
      <div className="mb-7">
        <div className="font-bold text-red-600 text-lg mb-2">Риски</div>
        <div className="space-y-3">
          <RiskLine name="Кратеры" value={selected.craters} />
          <RiskLine name="Склоны" value={selected.slopes} />
          <RiskLine name="Радиоактивность" value={selected.radioactivity} />
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-2">
        <button
          className="w-full rounded-xl bg-green-500 hover:bg-green-600 transition text-white font-bold py-2 text-base shadow-sm"
          onClick={() => downloadAnalysis(selected, 'json')}
        >
          Скачать как JSON
        </button>
        <button
          className="w-full rounded-xl bg-yellow-400 hover:bg-yellow-500 transition text-white font-bold py-2 text-base shadow-sm"
          onClick={() => downloadAnalysis(selected, 'csv')}
        >
          Скачать как CSV
        </button>
        <button
          className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 transition text-white font-bold py-2 text-base shadow-sm"
          onClick={() => setSelected(null)}
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
)}
      {compareEntries.length >= 2 && (
        <div className="bg-white rounded-lg shadow-lg p-7 mt-8">
          <h3 className="text-lg font-medium mb-4">Сравнение участков</h3>
          <div className="overflow-x-auto pb-4">
            <table className="w-full border mb-7">
              <thead>
                <tr>
                  <th className="px-3 py-2 border bg-gray-50">Параметр</th>
                  {compareEntries.map(entry => (
                    <th className="px-3 py-2 border bg-blue-50 text-blue-800 font-semibold" key={entry.id}>
                      #{entry.id} <br/>
                      <span className="text-xs text-gray-600">{entry.lat}°, {entry.lon}°</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareData.map(param => (
                  <tr key={param.key}>
                    <td className="px-3 py-2 border bg-gray-50 font-medium">{param.label}</td>
                    {compareEntries.map(entry => (
                      <td className={`px-3 py-2 border text-center font-semibold ${
                        param.key === 'helium3' ? 'text-blue-700' :
                        param.key === 'titanium' ? 'text-green-700' :
                        param.key === 'silicon' ? 'text-yellow-700' :
                        param.key === 'craters' ? 'text-purple-700' :
                        param.key === 'slopes' ? 'text-pink-700' :
                        'text-red-700'
                      }`} key={entry.id}>
                        {entry[param.key as keyof HistoryEntry]}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
