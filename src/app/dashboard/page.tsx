'use client';

import { useState, useEffect } from 'react';

type Project = { id: number; name: string; description: string };
type InfrastructureStatus = {
  id: string;
  label: string;
  value: number | string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
};
type Notification = { id: number; message: string; date: string; read: boolean };

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProj, setNewProj] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editProj, setEditProj] = useState({ name: '', description: '' });

  const [infra, setInfra] = useState<InfrastructureStatus[]>([]);

  const [notes, setNotes] = useState<Notification[]>([]);

  useEffect(() => {
    setProjects([
      { id: 1, name: 'Лунная база α', description: 'Проект первой жилой модуля.' },
      { id: 2, name: 'Ровер-разведчик', description: 'Разработка автономного ровера.' },
    ]);
    setInfra([
      { id: 'power', label: 'Энергия', value: 95, unit: '%', status: 'normal' },
      { id: 'o2',    label: 'Кислород', value: 18, unit: '%', status: 'warning' },
      { id: 'temp',  label: 'Температура', value: -20, unit: '℃', status: 'critical' },
    ]);
    setNotes([
      { id: 1, message: 'Установлен новый солнечный панельный массив.', date: '2025-05-12', read: false },
      { id: 2, message: 'Проверка резервного генератора прошла успешно.', date: '2025-05-11', read: true },
    ]);
  }, []);

  const addProject = () => {
    if (!newProj.name.trim()) return;
    const nextId = projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    setProjects([...projects, { id: nextId, ...newProj }]);
    setNewProj({ name: '', description: '' });
  };

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setEditProj({ name: p.name, description: p.description });
  };

  const saveEdit = (id: number) => {
    setProjects(projects.map(p => p.id === id ? { id, ...editProj } : p));
    setEditingId(null);
  };

  const deleteProject = (id: number) => {
    if (confirm('Удалить проект?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const markRead = (id: number) => {
    setNotes(notes.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const borderColor = (status: string) => {
    switch (status) {
      case 'normal':   return 'border-green-500';
      case 'warning':  return 'border-yellow-500';
      case 'critical': return 'border-red-500';
      default:         return 'border-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-12">
      <h1 className="text-3xl font-bold">Панель управления</h1>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Управление проектом</h2>
        <div className="mb-4 flex space-x-2">
          <input
            type="text"
            placeholder="Название проекта"
            className="border p-2 rounded flex-1"
            value={newProj.name}
            onChange={e => setNewProj({ ...newProj, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Описание"
            className="border p-2 rounded flex-2"
            value={newProj.description}
            onChange={e => setNewProj({ ...newProj, description: e.target.value })}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={addProject}
          >
            Добавить
          </button>
        </div>
        <ul className="space-y-2">
          {projects.map(p =>
            <li key={p.id} className="border p-3 rounded flex justify-between items-center">
              {editingId === p.id ? (
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    className="border p-1 rounded flex-1"
                    value={editProj.name}
                    onChange={e => setEditProj({ ...editProj, name: e.target.value })}
                  />
                  <input
                    type="text"
                    className="border p-1 rounded flex-2"
                    value={editProj.description}
                    onChange={e => setEditProj({ ...editProj, description: e.target.value })}
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </div>
              )}

              <div className="ml-4 flex space-x-2">
                {editingId === p.id ? (
                  <>
                    <button
                      className="text-green-600"
                      onClick={() => saveEdit(p.id)}
                    >
                      Сохранить
                    </button>
                    <button
                      className="text-gray-600"
                      onClick={() => setEditingId(null)}
                    >
                      Отмена
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-blue-600"
                      onClick={() => startEdit(p)}
                    >
                      Ред.
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => deleteProject(p.id)}
                    >
                      Удал.
                    </button>
                  </>
                )}
              </div>
            </li>
          )}
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Мониторинг инфраструктуры</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {infra.map(i =>
            <div
              key={i.id}
              className={`border-l-4 bg-white p-4 rounded shadow ${borderColor(i.status)}`}
            >
              <p className="text-lg font-medium">{i.label}</p>
              <p className="text-3xl">{i.value}{i.unit}</p>
            </div>
          )}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Уведомления</h2>
        <ul className="space-y-2">
          {notes.map(n =>
            <li
              key={n.id}
              className={`border p-3 rounded flex justify-between items-center ${n.read ? 'bg-gray-100' : 'bg-white'}`}
            >
              <div>
                <p>{n.message}</p>
                <p className="text-xs text-gray-500">{n.date}</p>
              </div>
              {!n.read && (
                <button
                  className="text-blue-600"
                  onClick={() => markRead(n.id)}
                >
                  Пометить прочитанным
                </button>
              )}
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
