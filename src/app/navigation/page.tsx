// app/navigation/page.tsx
'use client';
import React, { useState } from 'react';
import {
  EyeIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  HomeIcon,
  RocketLaunchIcon,
  BeakerIcon,
  BoltIcon,
  CubeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function NavigationPage() {
  const zones = [
    { id: 'module', name: 'Жилой модуль A', icon: <HomeIcon className="w-5 h-5 text-blue-600" />, top: '15%', left: '10%', w: '30%', h: '20%', color: 'border-blue-400' },
    { id: 'lab', name: 'Исследовательская лаборатория', icon: <BeakerIcon className="w-5 h-5 text-green-600" />, top: '35%', left: '40%', w: '35%', h: '25%', color: 'border-green-400' },
    { id: 'launch', name: 'Космодром', icon: <RocketLaunchIcon className="w-5 h-5 text-purple-600" />, top: '40%', left: '75%', w: '25%', h: '20%', color: 'border-purple-400' },
    { id: 'storage', name: 'Хранилище', icon: <CubeIcon className="w-5 h-5 text-red-600" />, top: '60%', left: '15%', w: '25%', h: '20%', color: 'border-red-400' },
    { id: 'power', name: 'Электростанция', icon: <BoltIcon className="w-5 h-5 text-yellow-600" />, top: '10%', left: '60%', w: '20%', h: '15%', color: 'border-yellow-400' },
  ];

  const transports = [
    { id: 1, name: 'Команда EVA Альфа', from: 'module', to: 'lab', eta: '5 мин', warning: false },
    { id: 2, name: 'Грузовой транспорт 2', from: 'launch', to: 'storage', eta: '12 мин', warning: true },
    { id: 3, name: 'Авто техобслуживания 5', from: 'storage', to: 'power', eta: '8 мин', warning: false },
  ];

  const [bases] = useState(
    zones.map(z => ({ id: z.id, name: z.name, count: Math.floor(Math.random() * 5) + 1, status: z.id === 'launch' ? 'Техобслуживание' : 'Эксплуатируется' }))
  );

  const [routeParams, setRouteParams] = useState({ from: zones[0].name, to: zones[1].name, transport: 'Пешком', priority: 'Стандартный' });

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Базовая навигационная система</h1>
        <div className="space-x-2">
          <button className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded">
            <EyeIcon className="w-5 h-5 mr-1" /> Просмотр в реальном времени
          </button>
          <button className="inline-flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded">
            <ArrowUpTrayIcon className="w-5 h-5 mr-1" /> Загрузить карту
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 bg-gray-100 rounded-lg h-96 overflow-hidden">
          <div className="absolute top-4 right-4 flex flex-col space-y-2 bg-white p-1 rounded shadow">
            <button><MagnifyingGlassPlusIcon className="w-5 h-5 text-gray-600"/></button>
            <button><MagnifyingGlassMinusIcon className="w-5 h-5 text-gray-600"/></button>
          </div>
          {zones.map(z => (
            <div key={z.id} className={`absolute border-2 ${z.color} rounded`} style={{ top: z.top, left: z.left, width: z.w, height: z.h }}>
              <div className="absolute -top-5 left-0 bg-white text-xs px-1 rounded shadow flex items-center space-x-1">
                {z.icon}<span className="truncate max-w-[6rem]">{z.name}</span>
              </div>
            </div>
          ))}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <defs><marker id="arrow" markerWidth="4" markerHeight="4" refX="0" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4" fill="blue"/></marker></defs>
            {transports.map(t => {
              const from = zones.find(z => z.id === t.from)!;
              const to   = zones.find(z => z.id === t.to)!;
              const x1   = parseFloat(from.left) + parseFloat(from.w)/2;
              const y1   = parseFloat(from.top) + parseFloat(from.h)/2;
              const x2   = parseFloat(to.left)   + parseFloat(to.w)/2;
              const y2   = parseFloat(to.top)   + parseFloat(to.h)/2;
              return (
                <line key={t.id} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={t.warning?'orange':'blue'} strokeWidth="0.5" strokeDasharray="2" markerEnd="url(#arrow)"/>
              );
            })}
            {transports.filter(t=>t.warning).map(t=>{
              const to = zones.find(z=>z.id===t.to)!;
              const x = parseFloat(to.left)+parseFloat(to.w)/2;
              const y = parseFloat(to.top)+parseFloat(to.h)/2;
              return (
                <ExclamationTriangleIcon key={t.id}
                  className="absolute w-4 h-4 text-yellow-500"
                  style={{ top:`${y}%`, left:`${x}%`, transform:'translate(-50%,-50%)' }}/>
              );
            })}
          </svg>
        </div>

        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Активные перемещения</h2>
          <ul className="space-y-3">
            {transports.map(t=>(
              <li key={t.id} className={`flex items-center justify-between p-3 rounded ${t.warning?'bg-yellow-50':'bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="w-5 h-5 text-gray-700"/>
                  <div className="text-sm flex-1">
                    <p className="font-medium truncate">{t.name}</p>
                    <p className="text-xs truncate">{zones.find(z=>z.id===t.from)!.name} → {zones.find(z=>z.id===t.to)!.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <ClockIcon className="w-4 h-4 text-gray-500"/><span>≈ {t.eta}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Расположение баз</h2>
          <div className="relative">
            <input type="text" placeholder="Поиск локации..." className="w-full border rounded px-3 py-2"/>
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-3"/>
          </div>
          <ul className="divide-y divide-gray-200">
            {bases.map(b=>(
              <li key={b.id} className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-2 flex-1 truncate">
                  <MapPinIcon className="w-5 h-5 text-gray-700"/>
                  <span className="truncate">{b.name}</span>
                </div>
                <span className="text-sm text-gray-500">Занято: {b.count}</span>
                <span className={`ml-4 px-2 py-1 text-xs rounded ${b.status==='Эксплуатируется'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Планирование маршрута</h2>
          <div className="space-y-3 text-sm">
            <select value={routeParams.from} onChange={e=>setRouteParams({...routeParams,from:e.target.value})} className="w-full border rounded px-3 py-2">
              {zones.map(z=><option key={z.id}>{z.name}</option>)}
            </select>
            <select value={routeParams.to}   onChange={e=>setRouteParams({...routeParams,to:e.target.value})}   className="w-full border rounded px-3 py-2">
              {zones.map(z=><option key={z.id}>{z.name}</option>)}
            </select>
            <select value={routeParams.transport} onChange={e=>setRouteParams({...routeParams,transport:e.target.value})} className="w-full border rounded px-3 py-2">
              {['Пешком','Транспорт','Ровер'].map(o=><option key={o}>{o}</option>)}
            </select>
            <select value={routeParams.priority}  onChange={e=>setRouteParams({...routeParams,priority:e.target.value})}  className="w-full border rounded px-3 py-2">
              {['Стандартный','Высокий','Низкий'].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded">Рассчитать маршрут</button>
          <div className="flex items-start space-x-1 text-sm text-yellow-600 pt-2">
            <ExclamationTriangleIcon className="w-5 h-5"/>
            <span>Работы по техническому обслуживанию в зоне Космодром</span>
          </div>
        </div>
      </div>
    </div>
  );
}
