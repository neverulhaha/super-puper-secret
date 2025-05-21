'use client'
import React, { useState, useEffect } from 'react'
import {
  UsersIcon,
  HeartIcon,
  SparklesIcon,
  BellAlertIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

type Patient = {
  id: number
  name: string
  role: string
  heartRate: number
  temperature: number
  bp: string
  spo2: number
  status: 'ok' | 'alert'
}

type Protocol = {
  id: number
  title: string
  category: string
  description: string
  nextDue: string
  status: 'ok' | 'alert' | 'info'
  completed?: boolean
}

type Report = {
  id: number
  title: string
  date: string
  type: string
  status: 'Выполнено' | 'В ожидании'
  worker: string
  details?: string
}

type Notification = {
  id: number
  type: 'error' | 'info' | 'success' | 'warn'
  title: string
  description: string
  patientId?: number
}

const initialPatients: Patient[] = [
  { id: 1, name: 'Егор Ильин', role: 'Командир миссии', heartRate: 72, temperature: 36.6, bp: '120/80 мм рт.ст.', spo2: 98, status: 'ok' },
  { id: 2, name: 'Дмитрий Павлов', role: 'Научный сотрудник', heartRate: 85, temperature: 37.2, bp: '135/85 мм рт.ст.', spo2: 96, status: 'alert' },
  { id: 3, name: 'Анна Соколова', role: 'Медработник', heartRate: 68, temperature: 36.8, bp: '118/75 мм рт.ст.', spo2: 99, status: 'ok' }
]

const initialProtocols: Protocol[] = [
  { id: 1, title: 'Ежедневный осмотр здоровья', category: 'Общий', description: 'Стандартный мониторинг жизненных показателей', nextDue: '2 часа', status: 'ok' },
  { id: 2, title: 'Проверка радиационного облучения', category: 'Безопасность', description: 'Ежедневная оценка радиации', nextDue: 'Просрочен', status: 'alert' },
  { id: 3, title: 'Оценка психического здоровья', category: 'Здоровье', description: 'Регулярная психологическая оценка', nextDue: '3 дня', status: 'info' }
]

const initialReports: Report[] = [
  { id: 1, title: 'Ежемесячная оценка состояния здоровья', date: '2025-05-15', type: 'Регулярный осмотр', status: 'Выполнено', worker: 'Доктор Ильин Егор', details: 'Показатели в пределах нормы. Рекомендовано продолжить текущий режим.' },
  { id: 2, title: 'Отчет о радиационном облучении', date: '2025-05-14', type: 'Проверка безопасности', status: 'В ожидании', worker: 'Доктор Ильин Егор', details: 'Необходима дополнительная проверка оборудования и экранации.' },
  { id: 3, title: 'Психологическое обследование', date: '2025-05-13', type: 'Психическое здоровье', status: 'Выполнено', worker: 'Доктор Ильин Егор', details: 'Психоэмоциональное состояние экипажа стабильно.' }
]

function getStatusIcon(status: Patient['status']) {
  if (status === 'ok') return <CheckCircleIcon className="w-6 h-6 text-green-500" />
  return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
}

function getProtocolIcon(status: Protocol['status']) {
  if (status === 'ok') return <CheckCircleIcon className="w-5 h-5 text-green-500" />
  if (status === 'alert') return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
  return <ClockIcon className="w-5 h-5 text-blue-500" />
}

export default function MedicinePage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [protocols, setProtocols] = useState<Protocol[]>(initialProtocols)
  const [reports] = useState<Report[]>(initialReports)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [noteFilter, setNoteFilter] = useState<'all' | 'error' | 'warn' | 'info' | 'success'>('all')

  useEffect(() => {
    patients.forEach(p => {
      let criticals = []
      if (p.heartRate < 50 || p.heartRate > 110) criticals.push('Пульс')
      if (p.temperature < 35.5 || p.temperature > 38) criticals.push('Температура')
      if (parseInt(p.bp) > 150 || parseInt(p.bp) < 90) criticals.push('Давление')
      if (p.spo2 < 92) criticals.push('Кислород (SpO₂)')
      if (criticals.length > 0) {
        if (!notifications.find(n => n.patientId === p.id && n.type === 'error')) {
          setNotifications(prev => [
            ...prev,
            {
              id: Date.now() + p.id,
              type: 'error',
              title: `Критические показатели: ${p.name}`,
              description: `Внимание! У пациента опасные значения: ${criticals.join(', ')}`,
              patientId: p.id
            }
          ])
        }
      } else {
        setNotifications(prev => prev.filter(n => n.patientId !== p.id || n.type !== 'error'))
      }
    })
  }, [patients])

  function handleEmergencyHelp(id: number) {
    setPatients(patients =>
      patients.map(p => p.id === id
        ? { ...p, heartRate: 75, temperature: 36.7, bp: '120/80 мм рт.ст.', spo2: 98, status: 'ok' }
        : p
      )
    )
    setNotifications(prev => prev.filter(n => n.patientId !== id || n.type !== 'error'))
    setNotifications(prev => [
      ...prev,
      {
        id: Date.now() + id,
        type: 'success',
        title: 'Экстренная помощь оказана',
        description: `Параметры пациента восстановлены`,
        patientId: id
      }
    ])
    setSelectedPatient(null)
  }

  function adjustVital(id: number, field: keyof Omit<Patient, 'id' | 'name' | 'role' | 'status'>, delta: number) {
    setPatients(patients =>
      patients.map(p => p.id === id
        ? {
            ...p,
            [field]: typeof p[field] === 'number'
              ? Math.max(20, Math.min(200, (p[field] as number) + delta))
              : p[field],
            status: field === 'heartRate' && ((p[field] as number) + delta) > 100 ? 'alert' : p.status
          }
        : p
      )
    )
  }

  function handleViewReport(report: Report) {
    setSelectedReport(report)
  }

  function handleDownloadReport(report: Report) {
    setNotifications(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'info',
        title: `Отчет "${report.title}" успешно скачан`,
        description: 'Отчет загружен как PDF'
      }
    ])
  }

  function handleProtocolDetails(protocol: Protocol) {
    setNotifications(prev => [
      ...prev,
      {
        id: Date.now(),
        type: protocol.status === 'alert' ? 'warn' : 'info',
        title: protocol.title,
        description: protocol.description
      }
    ])
  }

  function markProtocolCompleted(id: number) {
    setProtocols(protocols =>
      protocols.map(p => p.id === id ? { ...p, completed: true } : p)
    )
    setNotifications(prev => [
      ...prev,
      {
        id: Date.now(),
        type: 'success',
        title: 'Протокол выполнен',
        description: 'Протокол отмечен как выполненный'
      }
    ])
  }

  const filteredNotifications = noteFilter === 'all'
    ? notifications
    : notifications.filter(n => n.type === noteFilter)

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <h1 className="text-2xl font-semibold">Медицинское обслуживание</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <UsersIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Состояние здоровья экипажа</p>
            <p className="text-lg font-medium">24/30</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <HeartIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Средние жизненные показатели</p>
            <p className="text-lg font-medium">Нормальное</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <SparklesIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Психическое здоровье</p>
            <p className="text-lg font-medium">Стабильное</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <BellAlertIcon className="w-6 h-6 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Медицинские уведомления</p>
            <p className="text-lg font-medium">
              {notifications.filter(n => n.type === 'error').length} Активно
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        <button onClick={() => setNoteFilter('all')} className={`px-2 py-1 rounded ${noteFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Все</button>
        <button onClick={() => setNoteFilter('error')} className={`px-2 py-1 rounded ${noteFilter === 'error' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Критичные</button>
        <button onClick={() => setNoteFilter('warn')} className={`px-2 py-1 rounded ${noteFilter === 'warn' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>Внимание</button>
        <button onClick={() => setNoteFilter('info')} className={`px-2 py-1 rounded ${noteFilter === 'info' ? 'bg-blue-400 text-white' : 'bg-gray-200'}`}>Инфо</button>
        <button onClick={() => setNoteFilter('success')} className={`px-2 py-1 rounded ${noteFilter === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Успех</button>
      </div>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Медицинские уведомления</h2>
        <ul className="space-y-2">
          {filteredNotifications.length === 0 && (
            <li className="text-gray-400 text-sm">Нет активных уведомлений</li>
          )}
          {filteredNotifications.map(n => (
            <li key={n.id} className="bg-white rounded p-3 shadow flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {n.type === 'error' && <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />}
                {n.type === 'warn' && <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />}
                {n.type === 'info' && <BellAlertIcon className="w-5 h-5 text-blue-500" />}
                {n.type === 'success' && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                <div>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-sm text-gray-500">{n.description}</div>
                </div>
              </div>
              <button
                className="text-xs text-gray-400"
                onClick={() => setNotifications(notifications.filter(note => note.id !== n.id))}
              >Закрыть</button>
            </li>
          ))}
        </ul>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-medium">Контроль состояния здоровья</h2>
          <ul className="space-y-4">
            {patients.map(p => (
              <li
                key={p.id}
                className="border rounded-lg p-4 flex justify-between items-center cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedPatient(p)}
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.role}</p>
                  <div className="flex space-x-6 text-sm mt-2">
                    <span className="flex items-center gap-1"><HeartIcon className="w-4 h-4 text-red-500" /> {p.heartRate} уд/мин</span>
                    <span className="flex items-center gap-1"><FireIcon className="w-4 h-4 text-orange-500" /> {p.temperature}°C</span>
                  </div>
                  <div className="flex space-x-6 text-sm mt-2">
                    <span className="flex items-center gap-1"><ChartBarIcon className="w-4 h-4 text-blue-500" /> {p.bp}</span>
                    <span className="flex items-center gap-1"><ArrowTrendingUpIcon className="w-4 h-4 text-green-500" /> SpO₂ {p.spo2}%</span>
                  </div>
                </div>
                {getStatusIcon(p.status)}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-medium">Медицинские протоколы</h2>
          <ul className="space-y-4">
            {protocols.map(pr => (
              <li key={pr.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    {getProtocolIcon(pr.status)}
                    <span className="font-medium">{pr.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{pr.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Следующий срок: {pr.nextDue}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button
                    className="text-sm text-blue-600 flex items-center space-x-1"
                    onClick={() => handleProtocolDetails(pr)}
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>Смотреть детали</span>
                  </button>
                  {!pr.completed && (
                    <button
                      className="text-xs text-green-600"
                      onClick={() => markProtocolCompleted(pr.id)}
                    >
                      Отметить как выполнено
                    </button>
                  )}
                  {pr.completed && (
                    <span className="text-xs text-green-600 font-semibold">Выполнено</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded mt-4"
            onClick={() => setNotifications(prev => [
              ...prev,
              {
                id: Date.now(),
                type: 'info',
                title: 'Добавление протокола',
                description: 'Форма добавления протокола в разработке'
              }
            ])}
          >
            Добавить новый протокол
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-medium mb-4">Медицинские отчёты</h2>
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Отчет</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Работник</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map(r => (
              <tr key={r.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    r.status === 'Выполнено' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>{r.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.worker}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex space-x-2">
                  <button onClick={() => handleViewReport(r)}>
                    <EyeIcon className="w-5 h-5 text-gray-600 cursor-pointer" />
                  </button>
                  <button onClick={() => handleDownloadReport(r)}>
                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-600 cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-4 text-gray-400 text-2xl"
              onClick={() => setSelectedPatient(null)}
            >×</button>
            <h3 className="text-xl font-semibold mb-2">{selectedPatient.name}</h3>
            <div className="text-sm text-gray-600 mb-2">{selectedPatient.role}</div>
            <div className="flex flex-col gap-2 mb-4">
              <span className="flex items-center gap-2"><HeartIcon className="w-5 h-5 text-red-500" />Пульс: <b>{selectedPatient.heartRate}</b> уд/мин</span>
              <span className="flex items-center gap-2"><FireIcon className="w-5 h-5 text-orange-500" />Температура: <b>{selectedPatient.temperature}</b>°C</span>
              <span className="flex items-center gap-2"><ChartBarIcon className="w-5 h-5 text-blue-500" />Давление: <b>{selectedPatient.bp}</b></span>
              <span className="flex items-center gap-2"><ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />SpO₂: <b>{selectedPatient.spo2}%</b></span>
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => adjustVital(selectedPatient.id, 'heartRate', 10)}
              >Повысить пульс</button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => adjustVital(selectedPatient.id, 'temperature', 0.5)}
              >Повысить температуру</button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => handleEmergencyHelp(selectedPatient.id)}
              >Экстренная помощь</button>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                onClick={() => setSelectedPatient(null)}
              >Закрыть</button>
            </div>
          </div>
        </div>
      )}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-4 text-gray-400 text-2xl"
              onClick={() => setSelectedReport(null)}
            >×</button>
            <h3 className="text-xl font-semibold mb-2">{selectedReport.title}</h3>
            <div className="text-sm text-gray-600 mb-2">{selectedReport.date} | {selectedReport.type}</div>
            <div className="text-sm text-gray-700 mb-4">{selectedReport.details}</div>
            <div className="flex space-x-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => { handleDownloadReport(selectedReport); setSelectedReport(null); }}
              >Скачать PDF</button>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                onClick={() => setSelectedReport(null)}
              >Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
