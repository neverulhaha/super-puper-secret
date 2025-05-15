'use client';
import React, { useState } from 'react';
import {
  ArrowTrendingUpIcon,
  ClockIcon,
  SparklesIcon,
  ShieldCheckIcon,
  HomeIcon,
  BeakerIcon,
  BoltIcon,
  CubeIcon,
  LightBulbIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface Summary {
  id: number;
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface SectionMetric {
  label: string;
  value: string;
}

interface Section {
  id: number;
  title: string;
  icon: React.ReactNode;
  metrics: SectionMetric[];
  overall: string;
  trend: 'Повышение' | 'Стабильно';
}

interface ResourceItem {
  id: number;
  title: string;
  icon: React.ReactNode;
  current: string;
  target: string;
  efficiency: string;
}

interface Suggestion {
  id: number;
  title: string;
  desc: string;
  resourceGain: string;
  efficiencyGain: string;
  timeline: string;
  impact: 'Сильное влияние' | 'Среднее влияние';
}

export default function AnalyticsPage() {
  const [summary] = useState<Summary[]>([
    { id: 1, title: 'Общая эффективность', value: '94.5%', icon: <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" /> },
    { id: 2, title: 'Время безотказной работы', value: '99.9%', icon: <ClockIcon className="w-6 h-6 text-blue-500" /> },
    { id: 3, title: 'Оптимизация ресурсов', value: '92.8%', icon: <SparklesIcon className="w-6 h-6 text-purple-500" /> },
    { id: 4, title: 'Рейтинг безопасности', value: '98.2%', icon: <ShieldCheckIcon className="w-6 h-6 text-yellow-500" /> },
  ]);

  const [sections] = useState<Section[]>([
    {
      id: 1, title: 'Жилые модули', icon: <HomeIcon className="w-6 h-6 text-blue-500" />,
      metrics: [
        { label: 'Использование', value: '85%' },
        { label: 'Обслуживание', value: '95%' },
        { label: 'Производительность', value: '88%' },
      ],
      overall: '+ Повышение', trend: 'Повышение',
    },
    {
      id: 2, title: 'Исследовательские лаборатории', icon: <BeakerIcon className="w-6 h-6 text-indigo-500" />,
      metrics: [
        { label: 'Использование', value: '78%' },
        { label: 'Обслуживание', value: '92%' },
        { label: 'Производительность', value: '85%' },
      ],
      overall: '+ Стабильно', trend: 'Стабильно',
    },
    {
      id: 3, title: 'Системы электропитания', icon: <BoltIcon className="w-6 h-6 text-yellow-500" />,
      metrics: [
        { label: 'Использование', value: '92%' },
        { label: 'Обслуживание', value: '88%' },
        { label: 'Производительность', value: '90%' },
      ],
      overall: '+ Повышение', trend: 'Повышение',
    },
    {
      id: 4, title: 'Жизнеобеспечение', icon: <SparklesIcon className="w-6 h-6 text-green-500" />,
      metrics: [
        { label: 'Использование', value: '75%' },
        { label: 'Обслуживание', value: '96%' },
        { label: 'Производительность', value: '94%' },
      ],
      overall: '+ Повышение', trend: 'Повышение',
    },
  ]);

  const [resources] = useState<ResourceItem[]>([
    {
      id: 1, title: 'Водные ресурсы', icon: <CubeIcon className="w-6 h-6 text-teal-500" />,
      current: '85%', target: '80%', efficiency: '92%',
    },
    {
      id: 2, title: 'Подача кислорода', icon: <SparklesIcon className="w-6 h-6 text-blue-500" />,
      current: '95%', target: '90%', efficiency: '96%',
    },
    {
      id: 3, title: 'Энергопотребление', icon: <BoltIcon className="w-6 h-6 text-yellow-500" />,
      current: '78%', target: '75%', efficiency: '88%',
    },
    {
      id: 4, title: 'Вместимость хранилища', icon: <CubeIcon className="w-6 h-6 text-purple-500" />,
      current: '82%', target: '85%', efficiency: '90%',
    },
  ]);

  const [suggestions] = useState<Suggestion[]>([
    {
      id: 1,
      title: 'Оптимизация системы рециркуляции воды',
      desc: 'Внедрение усовершенствованной системы фильтрации для повышения эффективности переработки на 5%',
      resourceGain: '15%',
      efficiencyGain: '8%',
      timeline: '3 месяца',
      impact: 'Сильное влияние',
    },
    {
      id: 2,
      title: 'Перестановка массива солнечных батарей',
      desc: 'Регулировка угла наклона панелей для оптимального сбора энергии',
      resourceGain: '10%',
      efficiencyGain: '12%',
      timeline: '2 недели',
      impact: 'Среднее влияние',
    },
    {
      id: 3,
      title: 'Реорганизация области хранения',
      desc: 'Внедрение вертикальных систем хранения для увеличения емкости',
      resourceGain: '25%',
      efficiencyGain: '15%',
      timeline: '1 месяц',
      impact: 'Среднее влияние',
    },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8 text-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map(s => (
          <div key={s.id} className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
            {s.icon}
            <div>
              <p className="text-sm text-gray-500">{s.title}</p>
              <p className="text-lg font-medium">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-medium">Анализ инфраструктуры</h2>
          <ul className="space-y-6">
            {sections.map(sec => (
              <li key={sec.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  {sec.icon}
                  <p className="font-medium">{sec.title}</p>
                </div>
                <ul className="space-y-1 text-sm">
                  {sec.metrics.map(m => (
                    <li key={m.label} className="flex justify-between">
                      <span>{m.label}</span>
                      <span>{m.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between text-sm">
                  <span>Общая производительность</span>
                  <span className="text-green-600">{sec.overall}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-medium">Использование ресурсов</h2>
          <ul className="space-y-6">
            {resources.map(r => (
              <li key={r.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  {r.icon}
                  <p className="font-medium">{r.title}</p>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="h-2 bg-green-500" style={{ width: r.current }} />
                </div>
                <div className="text-sm flex justify-between">
                  <span>Целевая эффективность</span>
                  <span>{r.target}</span>
                </div>
                <div className="text-sm flex justify-between">
                  <span>Эффективность ресурсов</span>
                  <span>{r.efficiency}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-xl font-medium">Рекомендации по оптимизации</h2>
        <ul className="space-y-6">
          {suggestions.map(su => (
            <li key={su.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <LightBulbIcon className="w-6 h-6 text-yellow-500" />
                  <p className="font-medium">{su.title}</p>
                </div>
                <span className="text-sm text-gray-500">{su.impact}</span>
              </div>
              <p className="text-sm text-gray-600">{su.desc}</p>
              <div className="flex space-x-4 text-sm">
                <div className="flex-1">
                  <p>Экономия ресурсов</p>
                  <p className="font-medium">{su.resourceGain}</p>
                </div>
                <div className="flex-1">
                  <p>Повышение эффективности</p>
                  <p className="font-medium">{su.efficiencyGain}</p>
                </div>
                <div>
                  <p>Реализация</p>
                  <p className="font-medium">{su.timeline}</p>
                </div>
              </div>
              <div className="text-right">
                <button className="inline-flex items-center text-blue-600 text-sm">
                  <ArrowPathIcon className="w-4 h-4 mr-1" />
                  Подробнее
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}