'use client'

import React from 'react'
import { Calendar, MoreVertical, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Project } from '@/types/project'

type ProjectsListProps = {
  projects: Project[]
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'delayed':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'delayed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!projects.length) {
    return <p className="text-gray-600">Нет активных проектов.</p>
  }

  return (
    <div className="space-y-4">
      {projects.map(project => (
        <div key={project.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(project.status)}
              <h3 className="font-medium text-gray-900">{project.name}</h3>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Срок: {new Date(project.dueDate).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                project.status
              )}`}
            >
              {project.status === 'completed'
                ? 'ЗАВЕРШЕНО'
                : project.status === 'in_progress'
                ? 'В РАБОТЕ'
                : 'ЗАДЕРЖКА'}
            </span>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {project.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{ width: `${project.progress}%`, backgroundColor: undefined }}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {project.team.map((avatarUrl, idx) => (
                <img
                  key={idx}
                  src={`${avatarUrl}?w=32&h=32&fit=crop&crop=face`}
                  alt="Участник команды"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
