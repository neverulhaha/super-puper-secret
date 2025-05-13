// app/medicine/page.tsx
'use client';
import React, { useState } from 'react';
import {
  UserIcon,
  ClipboardIcon,
  DocumentTextIcon,
  HeartIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

type Patient = {
  id: number;
  name: string;
  age: number;
  temperature: number;
  heartRate: number;
  spo2: number;
};

type Protocol = {
  id: number;
  title: string;
  description: string;
  active: boolean;
};

type Report = {
  id: number;
  title: string;
  date: string;
};

export default function MedicinePage() {
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: 'Иван Иванов', age: 34, temperature: 36.6, heartRate: 72, spo2: 98 },
    { id: 2, name: 'Мария Петрова', age: 29, temperature: 37.1, heartRate: 80, spo2: 95 },
  ]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [protocols] = useState<Protocol[]>([
    { id: 1, title: 'Противовирусный курс', description: '5-дневный курс интерферона', active: true },
    { id: 2, title: 'Гидратация', description: 'Питьевой режим 2 л/сутки', active: false },
  ]);
  const [reports] = useState<Report[]>([
    { id: 1, title: 'Ежедневный отчёт 2025-05-12', date: '2025-05-12' },
    { id: 2, title: 'Еженедельный отчёт №20', date: '2025-05-10' },
  ]);
  const [form, setForm] = useState({ name: '', age: '', temperature: '', heartRate: '', spo2: '' });

  const addPatient = () => {
    const next: Patient = {
      id: Date.now(),
      name: form.name,
      age: Number(form.age),
      temperature: Number(form.temperature),
      heartRate: Number(form.heartRate),
      spo2: Number(form.spo2),
    };
    setPatients([...patients, next]);
    setForm({ name: '', age: '', temperature: '', heartRate: '', spo2: '' });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Медицинский модуль</h1>
        <button className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded">
          <PlusIcon className="w-5 h-5 mr-1" /> Новая запись
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium flex items-center space-x-2">
            <UserIcon className="w-6 h-6" />
            Состояние колонистов
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patients.map(p => (
              <div
                key={p.id}
                className={`p-4 rounded-lg border cursor-pointer ${selected?.id === p.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                onClick={() => setSelected(p)}
              >
                <div className="font-medium">{p.name}, {p.age} лет</div>
                <div className="text-sm text-gray-600">T: {p.temperature}°C, HR: {p.heartRate}, SpO₂: {p.spo2}%</div>
              </div>
            ))}
          </div>
          {selected && (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg space-y-4">
              <h3 className="font-medium">Редактировать {selected.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500">Температура</label>
                  <input
                    type="number"
                    value={selected.temperature}
                    onChange={e => setSelected({ ...selected, temperature: Number(e.target.value) })}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Пульс</label>
                  <input
                    type="number"
                    value={selected.heartRate}
                    onChange={e => setSelected({ ...selected, heartRate: Number(e.target.value) })}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">SpO₂</label>
                  <input
                    type="number"
                    value={selected.spo2}
                    onChange={e => setSelected({ ...selected, spo2: Number(e.target.value) })}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setPatients(patients.map(p => p.id === selected.id ? selected : p));
                  setSelected(null);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Сохранить
              </button>
            </div>
          )}
          <div className="mt-6 bg-white p-4 rounded-lg space-y-4">
            <h2 className="text-lg font-medium flex items-center space-x-2">
              <ClipboardIcon className="w-6 h-6" />
              Ввод нового состояния
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Имя"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Возраст"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Темп. °C"
                value={form.temperature}
                onChange={e => setForm({ ...form, temperature: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Пульс"
                value={form.heartRate}
                onChange={e => setForm({ ...form, heartRate: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="SpO₂ %"
                value={form.spo2}
                onChange={e => setForm({ ...form, spo2: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button onClick={addPatient} className="bg-blue-600 text-white px-4 py-2 rounded">Добавить</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-medium flex items-center space-x-2">
            <DocumentTextIcon className="w-6 h-6" />
            Протоколы и отчёты
          </h2>
          <div className="space-y-4">
            <h3 className="font-medium">Медицинские протоколы</h3>
            <ul className="space-y-2 text-sm">
              {protocols.map(p => (
                <li key={p.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-gray-500">{p.description}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${p.active ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'}`}>
                    {p.active ? 'Активен' : 'Отключен'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Отчёты о здоровье</h3>
            <ul className="space-y-2 text-sm">
              {reports.map(r => (
                <li key={r.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{r.title}</span>
                  <span className="text-gray-500">{r.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
