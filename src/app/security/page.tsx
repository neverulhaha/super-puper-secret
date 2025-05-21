'use client';
import React, { useState, useEffect } from 'react';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  UsersIcon,
  ArrowPathIcon,
  ClockIcon,
  BellAlertIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

interface SystemStatus {
  id: number;
  name: string;
  icon: React.ReactNode;
  status: 'OK' | 'Warning' | 'Critical';
  metrics: { label: string; value: string }[];
  last: string;
}
interface Signal {
  id: number;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  badge: string;
  time: string;
}
interface Protocol {
  id: number;
  title: string;
  subtitle: string;
  updated: string;
  color: 'red' | 'blue' | 'green';
  icon: React.ReactNode;
  steps: string[];
}

export default function SecurityPage() {
  const [systems, setSystems] = useState<SystemStatus[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [protocols] = useState<Protocol[]>([
    {
      id: 1, title: 'Протокол экстренного реагирования', subtitle: 'Экстренная ситуация', updated: '2025-03-15',
      color: 'red', icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />, steps: [
        'Запуск аварийного отключения', 'Защита критически важных систем',
        'Эвакуация пострадавших районов', 'Развернуть группу реагирования',
      ]
    }
  ]);
  useEffect(() => {
    setSystems([
      { id: 1, name: 'Системы жизнеобеспечения', icon: <ShieldCheckIcon className="w-6 h-6 text-green-500" />, status: 'OK',
        metrics: [{ label: 'Давление', value: '101.3 kPa' }], last: '2 мин назад' }
    ]);
    setSignals([
      { id: 1, title: 'Аномалия', description: 'Необычное потребление', severity: 'high', badge: 'Активно', time: '10 мин назад' }
    ]);
  }, []);
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-2xl font-semibold">Центр управления безопасностью</h1>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-medium">Мониторинг системы</h2>
          <ul>
            {systems.map(sys => (
              <li key={sys.id} className="flex space-x-4">
                {sys.icon}
                <div>
                  <p>{sys.name}</p>
                  <p>{sys.last}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-medium">Активные сигналы</h2>
          <ul>
            {signals.map(sig => (
              <li key={sig.id} className="p-4 rounded-lg bg-red-50">
                <p>{sig.title}</p>
                <p>{sig.description}</p>
                <p>{sig.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {protocols.map(p => (
        <div key={p.id} className="bg-red-50 rounded-lg shadow p-6">
          <div className="flex items-center space-x-2">{p.icon}<span>{p.title}</span></div>
          <ol>{p.steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
        </div>
      ))}
    </div>
  );
}
