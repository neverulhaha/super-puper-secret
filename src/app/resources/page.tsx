'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  CloudArrowDownIcon,
  SparklesIcon,
  BoltIcon,
  FireIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

const summaryMetricsDefault = [
  { key: 'water', name: 'Вода', icon: <CloudArrowDownIcon className="w-6 h-6 text-blue-500" />, value: 80, color: 'bg-blue-500' },
  { key: 'oxygen', name: 'Кислород', icon: <SparklesIcon className="w-6 h-6 text-green-500" />, value: 95, color: 'bg-green-500' },
  { key: 'energy', name: 'Энергия', icon: <BoltIcon className="w-6 h-6 text-yellow-500" />, value: 60, color: 'bg-yellow-500' },
  { key: 'hydrogen', name: 'Водород', icon: <FireIcon className="w-6 h-6 text-red-500" />, value: 50, color: 'bg-red-500' },
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

function getLevelColor(val: number) {
  if (val < 40) return 'bg-red-500 animate-pulse';
  if (val < 70) return 'bg-yellow-400 animate-pulse';
  return 'bg-green-500';
}
function getLevelTextColor(val: number) {
  if (val < 40) return 'text-red-500';
  if (val < 70) return 'text-yellow-500';
  return 'text-green-500';
}

const criticalKeys = ['water', 'oxygen', 'hydrogen', 'energy'];

export default function ResourcesPage() {
  const [summaryMetrics, setSummaryMetrics] = useState(summaryMetricsDefault);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const critical = summaryMetrics.some(
      m => criticalKeys.includes(m.key) && m.value < 40
    );
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.3;
    if (critical) {
      if (audio.paused) {
        try {
          audio.currentTime = 0;
          audio.play();
        } catch {}
      }
    } else {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }, [summaryMetrics]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Управление ресурсами</h1>
      </header>
      <div className="mb-2 text-sm text-gray-500">
        Показатели можно менять для имитации падения уровня — сработает сигнал и визуальное предупреждение.
      </div>
      <audio ref={audioRef} src="/warning.mp3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryMetrics.map((m, idx) => (
          <div key={m.key} className="bg-white rounded-lg shadow p-4 flex flex-col items-center relative">
            {m.icon}
            <div className="mt-2 text-sm text-gray-500">{m.name}</div>
            <div className={`text-xl font-bold ${getLevelTextColor(m.value)}`}>{m.value}%</div>
            <div className="w-full bg-gray-200 h-2 rounded mt-1 mb-3">
              <div className={`${getLevelColor(m.value)} h-2 rounded`} style={{ width: `${m.value}%` }} />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={m.value}
              onChange={e =>
                setSummaryMetrics(metrics =>
                  metrics.map((mm, i) => i === idx ? { ...mm, value: Number(e.target.value) } : mm)
                )
              }
              className="w-full accent-blue-500"
            />
            {criticalKeys.includes(m.key) && m.value < 40 && (
              <div className="absolute right-4 top-3 bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold animate-pulse">
                КРИТИЧЕСКИЙ УРОВЕНЬ
              </div>
            )}
            {criticalKeys.includes(m.key) && m.value >= 40 && m.value < 70 && (
              <div className="absolute right-4 top-3 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold animate-pulse">
                ВНИМАНИЕ
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Новый исправленный блок */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Распределение ресурсов</h2>
          {tableData.map(md => {
            const water = md.water || 0;
            const oxygen = md.oxygen || 0;
            const hydrogen = md.hydrogen || 0;
            const energy = md.energy || 0;
            return (
              <div key={md.module} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{md.module}</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded overflow-hidden flex">
                  <div className="bg-blue-500 h-3" style={{ width: `${water}%` }} />
                  <div className="bg-green-500 h-3" style={{ width: `${oxygen}%` }} />
                  <div className="bg-red-500 h-3" style={{ width: `${hydrogen}%` }} />
                  <div className="bg-yellow-400 h-3" style={{ width: `${energy}%` }} />
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-500">
                  <span className="text-blue-600">Вода: {water}%</span>
                  <span className="text-green-600">Кислород: {oxygen}%</span>
                  <span className="text-red-600">Водород: {hydrogen}%</span>
                  <span className="text-yellow-500">Энергия: {energy}%</span>
                </div>
              </div>
            );
          })}
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Модуль</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Вода, %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Кислород, %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Водород, %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Энергия, %</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map(td => (
              <tr key={td.module}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{td.module}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{td.water}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{td.oxygen}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{td.hydrogen}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{td.energy}%</td>
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
