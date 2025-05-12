'use client'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { fetchProjects, createProject } from '@/lib/api/projects'
import { Project } from '@/types/project'
import { ProjectsList } from './ProjectsList'

const ProjectsContainer: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'in_progress' | 'completed' | 'delayed'>('in_progress')
  const [progress, setProgress] = useState(0)
  const [dueDate, setDueDate] = useState('')
  const [teamInput, setTeamInput] = useState('')

  useEffect(() => {
    setLoading(true)
    fetchProjects()
      .then(data => setProjects(data))
      .catch(() => setError('Ошибка при загрузке проектов'))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const team = teamInput
      .split(',')
      .map(url => url.trim())
      .filter(url => url)
    try {
      const newProject = await createProject({ name, status, progress, dueDate, team })
      setProjects(prev => [...prev, newProject])
      setName('')
      setStatus('in_progress')
      setProgress(0)
      setDueDate('')
      setTeamInput('')
      setShowForm(false)
      toast.success('Проект добавлен')
    } catch {
      toast.error('Не удалось добавить проект')
    }
  }

  return (
    <div>
      <button
        onClick={() => setShowForm(prev => !prev)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {showForm ? 'Отменить' : 'Новый проект'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 p-4 border rounded-lg">
          <div>
            <label className="block mb-1">Название</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Статус</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="in_progress">В работе</option>
              <option value="completed">Завершено</option>
              <option value="delayed">Задержка</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Прогресс (%)</label>
            <input
              type="number"
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              min={0}
              max={100}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Срок</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Команда (URL через запятую)</label>
            <input
              type="text"
              value={teamInput}
              onChange={e => setTeamInput(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
            Добавить
          </button>
        </form>
      )}

      {loading && <p>Загружаем проекты...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && <ProjectsList projects={projects} />}
    </div>
)
}
export default ProjectsContainer;
