'use client';
import React, { useState, useEffect } from 'react';
import {
  CubeIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  PowerIcon,
  ClockIcon,
  ArrowUpTrayIcon,
  BeakerIcon,
  Cog6ToothIcon,
  VideoCameraIcon,
  MapIcon,
} from '@heroicons/react/24/outline';

function randomInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

const initialBots = [
  { id: 1, name: 'Исследовательский бот 1', task: 'Исследование поверхности', battery: 85, active: false, charging: false, icon: <BeakerIcon className="w-6 h-6 text-green-500" /> },
  { id: 2, name: 'Бот-конструктор 2', task: 'Строительство', battery: 30, active: false, charging: false, icon: <CubeIcon className="w-6 h-6 text-blue-500" /> },
  { id: 3, name: 'Бот техобслуживания 3', task: 'Техобслуживание', battery: 65, active: false, charging: false, icon: <Cog6ToothIcon className="w-6 h-6 text-yellow-500" /> },
];

const initialTasks = [
  { id: 1, name: 'Анализ поверхности', bot: 'Исследовательский бот 1', progress: 65, eta: '45 минут', loading: true },
  { id: 2, name: 'Установка панелей', bot: 'Бот-конструктор 2', progress: 100, eta: '0 минут', loading: false },
  { id: 3, name: 'Ремонт оборудования', bot: 'Бот техобслуживания 3', progress: 35, eta: '2 часа', loading: false },
];

const initialTelescopes = [
  { id: 1, name: 'Главная обсерватория', status: 'Стендбай', aligned: true, target: 'Кратер Гейла', exposure: '00:05:00', angle: '45°', filter: 'Отсутствует' },
  { id: 2, name: 'Телескоп для наблюдений', status: 'Отключен', aligned: false, target: '', exposure: '', angle: '', filter: '' },
];

const initialDrones = [
  { id: 1, name: 'Геодезист 1', task: 'Составление карт местности', battery: 75, signal: 80, location: 'Северный хребет', active: false },
  { id: 2, name: 'Скаут 2', task: 'Обнаружение ресурсов', battery: 40, signal: 90, location: 'Восточная долина', active: false },
  { id: 3, name: 'Наблюдатель 3', task: 'Отсутствует', battery: 0, signal: 0, location: 'Базовая станция', active: false },
];

export default function RoboticsPage() {
  const [bots, setBots] = useState(initialBots);
  const [tasks, setTasks] = useState(initialTasks);
  const [telescopes, setTelescopes] = useState(initialTelescopes);
  const [activeTel, setActiveTel] = useState(1);
  const [drones, setDrones] = useState(initialDrones);
  const [alert, setAlert] = useState<string | null>(null);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', bot: '', eta: '1 час' });

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev =>
        prev.map(t =>
          t.loading && t.progress < 100
            ? { ...t, progress: t.progress + 2 > 100 ? 100 : t.progress + 2 }
            : t
        )
      );
    }, 900);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const intv = setInterval(() => {
      setBots(prev =>
        prev.map(b =>
          b.charging && b.battery < 100
            ? { ...b, battery: b.battery + 2 > 100 ? 100 : b.battery + 2 }
            : b
        )
      );
    }, 1000);
    return () => clearInterval(intv);
  }, []);

  useEffect(() => {
    const intv = setInterval(() => {
      setDrones(prev =>
        prev.map(d =>
          d.active && d.battery > 0
            ? {
                ...d,
                battery: d.battery - 1,
                signal: d.signal > 0 ? d.signal - randomInt(0, 2) : 0,
                location: d.battery > 10 ? d.location : 'Базовая станция',
              }
            : d
        )
      );
    }, 1000);
    return () => clearInterval(intv);
  }, []);

  useEffect(() => {
    if (alert) setTimeout(() => setAlert(null), 2000);
  }, [alert]);

  function handleBotAction(id: number) {
    setBots(prev =>
      prev.map(b =>
        b.id === id
          ? b.active
            ? { ...b, active: false }
            : { ...b, active: true, charging: false }
          : b
      )
    );
    setAlert('Статус робота обновлён');
  }
  function handleBotCharge(id: number) {
    setBots(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, charging: true, active: false }
          : b
      )
    );
    setAlert('Бот поставлен на зарядку');
  }

  function handleAddTask() {
    if (!newTask.name || !newTask.bot) return;
    setTasks(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newTask.name,
        bot: newTask.bot,
        progress: 0,
        eta: newTask.eta,
        loading: true,
      },
    ]);
    setNewTask({ name: '', bot: '', eta: '1 час' });
    setNewTaskOpen(false);
    setAlert('Задание добавлено!');
  }

  function handleTelescopeChange(key: keyof typeof telescopes[0], value: string) {
    setTelescopes(telescopes.map(t =>
      t.id === activeTel ? { ...t, [key]: value } : t
    ));
  }
  function handleAlign() {
    setTelescopes(telescopes.map(t =>
      t.id === activeTel ? { ...t, aligned: true, status: 'Выравнен' } : t
    ));
    setAlert('Телескоп выровнен!');
  }
  function handleObserve() {
    setTelescopes(telescopes.map(t =>
      t.id === activeTel ? { ...t, status: 'Идёт наблюдение' } : t
    ));
    setAlert('Наблюдение началось!');
  }

  function handleDroneStart(id: number) {
    setDrones(drones.map(d => d.id === id ? { ...d, active: true, task: 'В полёте' } : d));
    setAlert('Дрон запущен');
  }
  function handleDroneRoute(id: number) {
    setAlert('Показ маршрута дрона (заглушка)');
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      {alert && (
        <div className="fixed top-5 right-5 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50">{alert}</div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Управление роботами</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center"
          onClick={() => setNewTaskOpen(true)}
        >
          Новая миссия
        </button>
      </div>

      {/* Модалка новой миссии */}
      {newTaskOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow p-8 space-y-4 min-w-[320px]">
            <h2 className="text-lg font-semibold mb-2">Создать новое задание</h2>
            <input
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Название задания"
              value={newTask.name}
              onChange={e => setNewTask(v => ({ ...v, name: e.target.value }))}
            />
            <select
              className="w-full border rounded px-3 py-2 mb-2"
              value={newTask.bot}
              onChange={e => setNewTask(v => ({ ...v, bot: e.target.value }))}
            >
              <option value="">Выберите бота</option>
              {bots.map(b => <option key={b.id}>{b.name}</option>)}
            </select>
            <input
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Ожидаемое время"
              value={newTask.eta}
              onChange={e => setNewTask(v => ({ ...v, eta: e.target.value }))}
            />
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded flex-1" onClick={handleAddTask}>Добавить</button>
              <button className="bg-gray-200 px-4 py-2 rounded flex-1" onClick={() => setNewTaskOpen(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Центр управления роботами</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bots.map(b => (
              <div key={b.id} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {b.icon}
                    <div className="text-sm font-medium">{b.name}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleBotAction(b.id)} title={b.active ? 'Остановить' : 'Запустить'}>
                      {b.active
                        ? <PauseIcon className="w-5 h-5 text-blue-500" />
                        : <PlayIcon className="w-5 h-5 text-gray-600" />
                      }
                    </button>
                    <button onClick={() => handleBotCharge(b.id)} title="Зарядка">
                      <PowerIcon className="w-5 h-5 text-green-600" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">{b.task}</div>
                <div className="mt-4 text-xs text-gray-600">Аккумулятор</div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-1">
                  <div className={`h-2 ${b.battery > 40 ? 'bg-green-500' : b.battery > 15 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${b.battery}%` }} />
                </div>
                <div className="mt-1 text-xs text-gray-600">{b.battery}% {b.charging && <span className="text-green-600 ml-1">(зарядка)</span>}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Активные задания</h2>
          <ul className="space-y-4">
            {tasks.map(t => (
              <li key={t.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <MapIcon className="w-5 h-5 text-gray-700" />
                    <span className="font-medium">{t.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">{t.bot}</div>
                </div>
                <div className="flex items-center space-x-4">
                  {t.loading && t.progress < 100 && (
                    <svg className="animate-spin w-5 h-5 text-gray-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  <div className="text-sm font-medium">{t.progress}%</div>
                  <div className="flex items-center text-xs text-gray-600 space-x-1 whitespace-nowrap">
                    <ClockIcon className="w-4 h-4" />
                    <span>≈ {t.eta}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Эксплуатация телескопа</h2>
          <div className="flex space-x-4">
            {telescopes.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTel(t.id)}
                className={`flex-1 p-3 rounded-lg border ${activeTel === t.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex items-center space-x-2">
                  <VideoCameraIcon className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-sm">{t.name}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">{t.status}</div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500">Цель наблюдения</label>
              <input
                type="text"
                value={telescopes.find(t => t.id === activeTel)?.target || ''}
                className="w-full border rounded px-2 py-1 text-sm"
                onChange={e => handleTelescopeChange('target', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Время экспозиции</label>
              <input
                type="text"
                value={telescopes.find(t => t.id === activeTel)?.exposure || ''}
                className="w-full border rounded px-2 py-1 text-sm"
                onChange={e => handleTelescopeChange('exposure', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Угол</label>
              <input
                type="text"
                value={telescopes.find(t => t.id === activeTel)?.angle || ''}
                className="w-full border rounded px-2 py-1 text-sm"
                onChange={e => handleTelescopeChange('angle', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Фильтр</label>
              <input
                type="text"
                value={telescopes.find(t => t.id === activeTel)?.filter || ''}
                className="w-full border rounded px-2 py-1 text-sm"
                onChange={e => handleTelescopeChange('filter', e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAlign}>Выравнить телескоп</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleObserve}>Начать наблюдение</button>
            <button className="ml-auto p-2" onClick={() => setAlert('Обновить данные телескопа (заглушка)')}><ArrowPathIcon className="w-5 h-5 text-gray-600" /></button>
            <button className="p-2" onClick={() => setAlert('Выгрузка данных (заглушка)')}><ArrowUpTrayIcon className="w-5 h-5 text-gray-600" /></button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Состояние дронов</h2>
          <ul className="space-y-4">
            {drones.map(d => (
              <li key={d.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <MapIcon className="w-6 h-6 text-gray-700" />
                <div className="flex-1 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-gray-500">{d.location}</span>
                  </div>
                  <div className="text-xs text-gray-600">{d.task}</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Аккум:</span>
                    <div className="w-full bg-gray-200 h-1 rounded overflow-hidden">
                      <div className="h-1 bg-green-500" style={{ width: `${d.battery}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{d.battery}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Сигнал:</span>
                    <div className="w-full bg-gray-200 h-1 rounded overflow-hidden">
                      <div className="h-1 bg-blue-500" style={{ width: `${d.signal}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{d.signal}%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="bg-blue-600 text-white rounded px-2 py-1" onClick={() => handleDroneStart(d.id)}>
                    Запустить
                  </button>
                  <button className="bg-gray-200 text-gray-700 rounded px-2 py-1" onClick={() => handleDroneRoute(d.id)}>
                    Маршрут
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
