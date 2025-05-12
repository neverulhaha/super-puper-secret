import { Project } from '@/types/project'

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects')
  if (!res.ok) throw new Error('Не удалось загрузить проекты')
  return res.json()
}

export async function createProject(payload: Omit<Project, 'id'>): Promise<Project> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Не удалось создать проект')
  }
  return res.json()
}
