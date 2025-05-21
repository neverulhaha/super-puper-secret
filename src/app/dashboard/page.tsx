'use client';
import React, { useEffect, useState } from 'react';

import {
  UserIcon,
  BoltIcon,
  HeartIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  BellAlertIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

type Project = {
  id: number;
  name: string;
  deadline: string;
  progress: number;
  status: 'in-progress' | 'completed' | 'delayed';
  avatars: string[];
};

type InfraCard = {
  id: string;
  title: string;
  icon: React.ReactNode;
  metrics: { label: string; value: string }[];
  warning?: boolean;
};

type Notification = {
  id: number;
  type: 'error' | 'success' | 'info' | 'warn';
  title: string;
  description: string;
  timeAgo: string;
};

type NewProjectForm = {
  name: string;
  deadline: string;
  progress: number;
  status: 'in-progress' | 'completed' | 'delayed';
  avatars: string;
};

type NewNoteForm = {
  type: 'error' | 'success' | 'info' | 'warn';
  title: string;
  description: string;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [infra, setInfra] = useState<InfraCard[]>([]);
  const [notes, setNotes] = useState<Notification[]>([]);
  const [projectFilter, setProjectFilter] = useState<'all' | 'in-progress' | 'completed' | 'delayed'>('all');
  const [noteFilter, setNoteFilter] = useState<'all' | 'error' | 'success' | 'info' | 'warn'>('all');
  const [infraFilter, setInfraFilter] = useState<'all' | 'warning'>('all');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showUserModal, setShowUserModal] = useState<{ img: string; open: boolean }>({ img: '', open: false });
  const [showInfraModal, setShowInfraModal] = useState<{ card: InfraCard | null; open: boolean }>({ card: null, open: false });
  const [newProject, setNewProject] = useState<NewProjectForm>({ name: '', deadline: '', progress: 0, status: 'in-progress', avatars: '' });
  const [newNote, setNewNote] = useState<NewNoteForm>({ type: 'info', title: '', description: '' });

  useEffect(() => {
    setProjects([
      {
        id: 1,
        name: 'Строительство жилого модуля',
        deadline: '2025-04-15',
        progress: 65,
        status: 'in-progress',
        avatars: [
          'https://i.pravatar.cc/32?img=12',
          'https://i.pravatar.cc/32?img=47',
          'https://i.pravatar.cc/32?img=58',
        ],
      },
      {
        id: 2,
        name: 'Расширение массива солнечных панелей',
        deadline: '2025-03-30',
        progress: 100,
        status: 'completed',
        avatars: [
          'https://i.pravatar.cc/32?img=32',
          'https://i.pravatar.cc/32?img=5',
        ],
      },
      {
        id: 3,
        name: 'Модернизация системы рециркуляции воды',
        deadline: '2025-04-01',
        progress: 35,
        status: 'delayed',
        avatars: [
          'https://i.pravatar.cc/32?img=15',
          'https://i.pravatar.cc/32?img=22',
          'https://i.pravatar.cc/32?img=39',
        ],
      },
    ]);
    setInfra([
      {
        id: 'modules',
        title: 'Жилые модули',
        icon: <SparklesIcon className="w-6 h-6 text-green-500" />,
        metrics: [
          { label: 'Давление', value: '101.3 kPa' },
          { label: 'Температура', value: '21 °C' },
          { label: 'Влажность', value: '45 %' },
        ],
      },
      {
        id: 'power',
        title: 'Энергетические системы',
        icon: <BoltIcon className="w-6 h-6 text-yellow-500" />,
        metrics: [
          { label: 'Выход', value: '450 kW' },
          { label: 'Потребление', value: '380 kW' },
          { label: 'Ёмкость', value: '85 %' },
        ],
      },
      {
        id: 'water',
        title: 'Водные ресурсы',
        icon: <HeartIcon className="w-6 h-6 text-teal-500" />,
        metrics: [
          { label: 'Объём', value: '95 %' },
          { label: 'Качество', value: '100 %' },
          { label: 'Рециркуляция', value: '99.9 %' },
        ],
      },
      {
        id: 'air',
        title: 'Регенерация воздуха',
        icon: <ShieldCheckIcon className="w-6 h-6 text-green-500" />,
        metrics: [
          { label: 'Уровень O₂', value: '21 %' },
          { label: 'Углекислый газ', value: '0.04 %' },
          { label: 'Поток', value: '12 м³/мин' },
        ],
      },
      {
        id: 'comm',
        title: 'Связь',
        icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
        metrics: [
          { label: 'Задержка', value: '2.6 с' },
          { label: 'Скорость', value: '85 %' },
          { label: 'Сигнал', value: '92 %' },
        ],
        warning: true,
      },
      {
        id: 'security',
        title: 'Безопасность',
        icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
        metrics: [
          { label: 'Сенсоры', value: '100 %' },
          { label: 'Камеры', value: '100 %' },
          { label: 'Оповещения', value: '0' },
        ],
      },
    ]);
    setNotes([
      {
        id: 1,
        type: 'error',
        title: 'Резервная система связи в автономном режиме',
        description: 'Резервная антенна требует планового технического обслуживания',
        timeAgo: '10 мин назад',
      },
      {
        id: 2,
        type: 'success',
        title: 'Оптимизация массива солнечных панелей 2 завершена',
        description: 'Энергоэффективность увеличилась на 3.5 %',
        timeAgo: '1 ч назад',
      },
      {
        id: 3,
        type: 'info',
        title: 'Обновлен график ротации экипажа',
        description: 'Новое расписание вступит в силу со следующей недели',
        timeAgo: '2 ч назад',
      },
      {
        id: 4,
        type: 'warn',
        title: 'Техническое обслуживание системы рециркуляции воды',
        description: 'Плановое техническое обслуживание в течение 24 часов',
        timeAgo: '3 ч назад',
      },
      {
        id: 5,
        type: 'success',
        title: 'Проверка безопасности завершена',
        description: 'Уязвимости не обнаружены',
        timeAgo: '4 ч назад',
      },
    ]);
  }, []);

  const statusBadge = (s: Project['status']) => {
    switch (s) {
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'delayed': return 'text-red-600 bg-red-100';
    }
  };

  const noteIcon = (type: Notification['type']) => {
    switch (type) {
      case 'error': return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'info': return <BellAlertIcon className="w-5 h-5 text-blue-500" />;
      case 'warn': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const filteredProjects = projectFilter === 'all' ? projects : projects.filter(p => p.status === projectFilter);
  const filteredNotes = noteFilter === 'all' ? notes : notes.filter(n => n.type === noteFilter);
  const filteredInfra = infraFilter === 'all' ? infra : infra.filter(i => i.warning);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {showUserModal.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <img src={showUserModal.img} alt="user" className="w-20 h-20 rounded-full mb-4" />
            <div className="mb-2 font-semibold text-lg">Участник экипажа</div>
            <div className="text-gray-500">Аватар: {showUserModal.img}</div>
            <button
              className="mt-6 px-4 py-1 bg-blue-600 text-white rounded"
              onClick={() => setShowUserModal({ img: '', open: false })}
            >Закрыть</button>
          </div>
        </div>
      )}

      {showInfraModal.open && showInfraModal.card && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
            <div className="flex items-center mb-4">
              {showInfraModal.card.icon}
              <span className="ml-2 font-semibold text-lg">{showInfraModal.card.title}</span>
            </div>
            <div className="space-y-2 mb-4">
              {showInfraModal.card.metrics.map(m => (
                <div key={m.label} className="flex justify-between">
                  <span className="text-gray-500">{m.label}</span>
                  <span>{m.value}</span>
                </div>
              ))}
            </div>
            <div>
              <span className="text-gray-500">Описание: </span>
              <span>Подробная информация и история изменений системы {showInfraModal.card.title}.</span>
            </div>
            <button
              className="mt-6 px-4 py-1 bg-blue-600 text-white rounded"
              onClick={() => setShowInfraModal({ card: null, open: false })}
            >Закрыть</button>
          </div>
        </div>
      )}

      {showProjectForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="mb-4 text-xl font-semibold">Создать проект</h2>
            <input
              type="text"
              placeholder="Название"
              value={newProject.name}
              className="mb-2 w-full border rounded p-2"
              onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))}
            />
            <input
              type="date"
              value={newProject.deadline}
              className="mb-2 w-full border rounded p-2"
              onChange={e => setNewProject(p => ({ ...p, deadline: e.target.value }))}
            />
            <input
              type="number"
              min={0}
              max={100}
              value={newProject.progress}
              className="mb-2 w-full border rounded p-2"
              onChange={e => setNewProject(p => ({ ...p, progress: Number(e.target.value) }))}
            />
            <select
              value={newProject.status}
              className="mb-2 w-full border rounded p-2"
              onChange={e => setNewProject(p => ({ ...p, status: e.target.value as any }))}
            >
              <option value="in-progress">В процессе</option>
              <option value="completed">Завершено</option>
              <option value="delayed">Отложено</option>
            </select>
            <input
              type="text"
              placeholder="Ссылки на аватары через запятую"
              value={newProject.avatars}
              className="mb-4 w-full border rounded p-2"
              onChange={e => setNewProject(p => ({ ...p, avatars: e.target.value }))}
            />
            <div className="flex gap-2">
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded"
                onClick={() => {
                  setProjects(pr =>
                    [...pr,
                      {
                        id: pr.length + 1,
                        name: newProject.name,
                        deadline: newProject.deadline,
                        progress: newProject.progress,
                        status: newProject.status,
                        avatars: newProject.avatars.split(',').map(s => s.trim()).filter(Boolean),
                      },
                    ]);
                  setNewProject({ name: '', deadline: '', progress: 0, status: 'in-progress', avatars: '' });
                  setShowProjectForm(false);
                }}
              >Создать</button>
              <button
                className="px-4 py-1 bg-gray-200 rounded"
                onClick={() => setShowProjectForm(false)}
              >Отмена</button>
            </div>
          </div>
        </div>
      )}

      {showNoteForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="mb-4 text-xl font-semibold">Добавить уведомление</h2>
            <select
              value={newNote.type}
              className="mb-2 w-full border rounded p-2"
              onChange={e => setNewNote(n => ({ ...n, type: e.target.value as any }))}
            >
              <option value="error">Ошибка</option>
              <option value="success">Успех</option>
              <option value="info">Информация</option>
              <option value="warn">Внимание</option>
            </select>
            <input
              type="text"
              placeholder="Заголовок"
              value={newNote.title}
              className="mb-2 w-full border rounded p-2"
              onChange={e => setNewNote(n => ({ ...n, title: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Описание"
              value={newNote.description}
              className="mb-4 w-full border rounded p-2"
              onChange={e => setNewNote(n => ({ ...n, description: e.target.value }))}
            />
            <div className="flex gap-2">
              <button
                className="px-4 py-1 bg-blue-600 text-white rounded"
                onClick={() => {
                  setNotes(ns => [
                    ...ns,
                    {
                      id: ns.length + 1,
                      ...newNote,
                      timeAgo: 'только что',
                    },
                  ]);
                  setNewNote({ type: 'info', title: '', description: '' });
                  setShowNoteForm(false);
                }}
              >Добавить</button>
              <button
                className="px-4 py-1 bg-gray-200 rounded"
                onClick={() => setShowNoteForm(false)}
              >Отмена</button>
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-semibold">Панель управления Лунной миссией</h1>
        <div className="flex flex-wrap gap-3">
          <button className="px-3 py-1 bg-blue-600 text-white rounded-full" onClick={() => setShowProjectForm(true)}>
            Создать проект
          </button>
          <button className="px-3 py-1 bg-green-600 text-white rounded-full" onClick={() => setShowNoteForm(true)}>
            Добавить уведомление
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button onClick={() => setProjectFilter('all')} className={`px-2 py-1 rounded ${projectFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Все проекты</button>
        <button onClick={() => setProjectFilter('in-progress')} className={`px-2 py-1 rounded ${projectFilter === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>В процессе</button>
        <button onClick={() => setProjectFilter('completed')} className={`px-2 py-1 rounded ${projectFilter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Завершено</button>
        <button onClick={() => setProjectFilter('delayed')} className={`px-2 py-1 rounded ${projectFilter === 'delayed' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Отложено</button>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Проекты в реализации</h2>
        </div>
        <div className="space-y-4">
          {filteredProjects.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{p.name}</h3>
                  <p className="text-sm text-gray-500">Срок сдачи {p.deadline}</p>
                </div>
                <button
                  onClick={() => setProjects(projects =>
                    projects.map(pr =>
                      pr.id === p.id
                        ? { ...pr, status: pr.status === 'in-progress' ? 'completed' : pr.status === 'completed' ? 'delayed' : 'in-progress' }
                        : pr
                    )
                  )}
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusBadge(p.status)}`}
                >
                  {p.status === 'in-progress' && 'В процессе'}
                  {p.status === 'completed' && 'Завершено'}
                  {p.status === 'delayed' && 'Отложено'}
                </button>
              </div>
              <div
                className="mt-3 bg-gray-200 h-2 rounded-full overflow-hidden cursor-pointer relative group"
                onMouseDown={e => {
                  const bar = e.currentTarget;
                  const move = (event: MouseEvent) => {
                    const rect = bar.getBoundingClientRect();
                    const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
                    setProjects(projects =>
                      projects.map(pr =>
                        pr.id === p.id ? { ...pr, progress: Math.round(percent * 100) } : pr
                      )
                    );
                  };
                  const up = () => {
                    document.removeEventListener('mousemove', move);
                    document.removeEventListener('mouseup', up);
                  };
                  document.addEventListener('mousemove', move);
                  document.addEventListener('mouseup', up);
                }}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-200 ${p.status === 'delayed' ? 'bg-red-500'
                    : p.status === 'completed' ? 'bg-green-500'
                    : 'bg-blue-500'}`}
                  style={{ width: `${p.progress}%` }}
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-gray-700 pointer-events-none group-hover:opacity-100 opacity-60">{p.progress}%</span>
              </div>
              <div className="mt-3 flex -space-x-2">
                {p.avatars.map((u, i) => (
                  <img
                    key={i}
                    src={u}
                    alt="avatar"
                    className="w-6 h-6 rounded-full border-2 border-white cursor-pointer"
                    onClick={() => setShowUserModal({ img: u, open: true })}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button onClick={() => setInfraFilter('all')} className={`px-2 py-1 rounded ${infraFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Вся инфраструктура</button>
        <button onClick={() => setInfraFilter('warning')} className={`px-2 py-1 rounded ${infraFilter === 'warning' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Только критичная</button>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Состояние инфраструктуры</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInfra.map(i => (
            <div
              key={i.id}
              className={`bg-white p-4 rounded-lg shadow flex flex-col space-y-2 cursor-pointer ${i.warning ? 'border-2 border-red-200' : ''}`}
              onClick={() => setShowInfraModal({ card: i, open: true })}
              onDoubleClick={e => {
                e.stopPropagation();
                setInfra(infra =>
                  infra.map(inf => inf.id === i.id ? { ...inf, warning: !inf.warning } : inf)
                );
              }}
              title="Один клик — подробно, двойной — сменить статус критичности"
            >
              <div className="flex items-center space-x-2">
                {i.icon}
                <h3 className="font-medium">{i.title}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {i.metrics.map(m => (
                  <div key={m.label}>
                    <p className="text-gray-500">{m.label}</p>
                    <p className="font-medium">{m.value}</p>
                  </div>
                ))}
              </div>
              {i.warning && <span className="text-xs text-red-500 font-semibold">Требует внимания</span>}
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <button onClick={() => setNoteFilter('all')} className={`px-2 py-1 rounded ${noteFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Все</button>
        <button onClick={() => setNoteFilter('error')} className={`px-2 py-1 rounded ${noteFilter === 'error' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Ошибки</button>
        <button onClick={() => setNoteFilter('warn')} className={`px-2 py-1 rounded ${noteFilter === 'warn' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>Внимание</button>
        <button onClick={() => setNoteFilter('info')} className={`px-2 py-1 rounded ${noteFilter === 'info' ? 'bg-blue-400 text-white' : 'bg-gray-200'}`}>Инфо</button>
        <button onClick={() => setNoteFilter('success')} className={`px-2 py-1 rounded ${noteFilter === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Успех</button>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Последние уведомления</h2>
        </div>
        <ul className="space-y-2">
          {filteredNotes.map(n => (
            <li key={n.id} className="bg-white p-3 rounded-lg shadow flex justify-between items-start">
              <div className="flex space-x-3">
                {noteIcon(n.type)}
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-gray-500">{n.description}</p>
                </div>
              </div>
              <button
                className="text-xs text-gray-400"
                onClick={() => setNotes(notes => notes.filter(note => note.id !== n.id))}
              >Закрыть</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
