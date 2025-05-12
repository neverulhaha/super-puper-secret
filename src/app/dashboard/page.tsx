'use client'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { CheckCircle2, Clock } from 'lucide-react'
import SystemsContainer from '@/components/SystemsContainer'
import NotificationsContainer from '@/components/NotificationsContainer'
import { fetchProjects } from '@/lib/api/projects'
import { Project } from '@/types/project'
import { ProjectsList } from '@/components/ProjectsList'
import ProjectsContainer from '@/components/ProjectsContainer'


const Dashboard: React.FC = () => {
  const [personnel, setPersonnel] = useState({ current: 0, total: 0, message: '' })
  const [energySystem, setEnergySystem] = useState({ efficiency: 0, message: '' })
  const [lifeSupport, setLifeSupport] = useState({ status: 'Оптимально', message: '' })
  const [securityStatus, setSecurityStatus] = useState({ status: 'Защищено', message: '' })
  const [systemStatus, setSystemStatus] = useState('Оптимально')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notification, setNotification] = useState<string>('Все системы работают')
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false)
  const [projectsError, setProjectsError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personnelData = await fetch('/api/personnel').then(res => res.json())
        setPersonnel(personnelData)
        const energyData = await fetch('/api/energy').then(res => res.json())
        setEnergySystem(energyData)
        const lifeSupportData = await fetch('/api/life-support').then(res => res.json())
        setLifeSupport(lifeSupportData)
        const securityData = await fetch('/api/security-status').then(res => res.json())
        setSecurityStatus(securityData)
      } catch {
        setPersonnel({ current: 24, total: 30, message: 'Используются дефолтные данные о персонале' })
        setEnergySystem({ efficiency: 90, message: 'Используются дефолтные данные об энергосистеме' })
        setLifeSupport({ status: 'Оптимально', message: 'Используются дефолтные данные о системе жизнеобеспечения' })
        setSecurityStatus({ status: 'Защищено', message: 'Используются дефолтные данные о безопасности' })
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (systemStatus === 'Оптимально') {
      setNotification('Все системы работают')
    } else if (systemStatus === 'Предупреждение') {
      setNotification('Есть предупреждения в системе')
    } else if (systemStatus === 'Ошибка') {
      setNotification('Системы требуют внимания')
    }
  }, [systemStatus])

  useEffect(() => {
    const loadProjects = async () => {
      setLoadingProjects(true)
      try {
        const data = await fetchProjects()
        setProjects(data)
        toast.success('Проекты успешно загружены!')
      } catch {
        setProjectsError('Ошибка при загрузке проектов')
        toast.error('Ошибка при загрузке проектов!')
      } finally {
        setLoadingProjects(false)
      }
    }
    loadProjects()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Панель управления базой</h1>
        <div className="flex items-center gap-4">
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {notification}
          </span>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Лунное время: {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Персонал</p>
              <p className="text-2xl font-bold text-gray-900">
                {personnel.current}/{personnel.total}
              </p>
              {personnel.message && <p className="text-sm text-red-600">{personnel.message}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Энергосистемы</p>
              <p className="text-2xl font-bold text-gray-900">{energySystem.efficiency}%</p>
              {energySystem.message && <p className="text-sm text-red-600">{energySystem.message}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Системы жизнеобеспечения</p>
              <p className="text-2xl font-bold text-gray-900">{lifeSupport.status}</p>
              {lifeSupport.message && <p className="text-sm text-gray-600">{lifeSupport.message}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Безопасность</p>
              <p className="text-2xl font-bold text-gray-900">{securityStatus.status}</p>
              {securityStatus.message && <p className="text-sm text-gray-600">{securityStatus.message}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Активные проекты</h2>
          </div>
          <div className="p-6">
            <ProjectsContainer />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Состояние инфраструктуры</h2>
          </div>
          <div className="p-6">
            <SystemsContainer />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Последние уведомления</h2>
            <button className="text-blue-600 hover:text-blue-800">Все уведомления</button>
          </div>
        </div>
        <div className="p-6">
          <NotificationsContainer />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
