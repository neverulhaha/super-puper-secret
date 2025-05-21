'use client'
import React, { useState, useRef, useEffect } from 'react'
import {
    DocumentTextIcon,
    TruckIcon,
    UsersIcon,
    ClockIcon,
    ChartBarIcon,
    PlusIcon,
    ArrowDownTrayIcon,
    FunnelIcon,
    ExclamationCircleIcon,
    TrashIcon,
    PencilIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

type Doc = {
    id: number
    title: string
    type: string
    status: 'РАЗРЕШЕНО' | 'ПРИНЯТО' | 'РАССМОТРЕНИЕ'
    dept: string
}

type Shipment = {
    id: number
    title: string
    subtitle: string
    eta: string
    level: 'Критический' | 'Высокий' | 'Средний'
    color: string
    icon: React.ComponentType<{ className: string }>
}

type Upcoming = {
    id: number
    title: string
    date: string
}

type Group = {
    id: number
    name: string
    count: number
    utilization: number
    shifts: number
    color: 'green' | 'yellow'
}

type Performance = {
    id: number
    name: string
    value: number
    color: 'blue' | 'green' | 'purple'
}

function colorToClass(color: string) {
    if (color === 'green') return 'bg-green-500'
    if (color === 'yellow') return 'bg-yellow-500'
    if (color === 'blue') return 'bg-blue-500'
    if (color === 'purple') return 'bg-purple-500'
    return 'bg-gray-500'
}

export default function AdminPage() {
    const [docs, setDocs] = useState<Doc[]>([
        { id: 1, title: 'Разрешение на строительство - Модуль E7', type: 'Разрешение', status: 'РАЗРЕШЕНО', dept: 'Машины' },
        { id: 2, title: 'Ежемесячный отчет о выделении ресурсов', type: 'Отчет', status: 'ПРИНЯТО', dept: 'Ресурсы' },
        { id: 3, title: 'График обслуживания оборудования', type: 'График', status: 'РАССМОТРЕНИЕ', dept: 'Техобслуживание' }
    ])
    const [search, setSearch] = useState('')
    const [showDocModal, setShowDocModal] = useState(false)
    const [docForm, setDocForm] = useState<Omit<Doc, 'id'>>({ title: '', type: '', status: 'РАССМОТРЕНИЕ', dept: '' })
    const [editDocId, setEditDocId] = useState<number | null>(null)
    const [sortField, setSortField] = useState<keyof Doc | ''>('')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

    const [shipments, setShipments] = useState<Shipment[]>([
        { id: 1, title: 'Поставка груза', subtitle: 'Строительные материалы', eta: '2 дня', level: 'Высокий', color: 'text-yellow-600 bg-yellow-100', icon: TruckIcon },
        { id: 2, title: 'Перемещение оборудования', subtitle: 'Научное оборудование', eta: '5 дней', level: 'Средний', color: 'text-green-600 bg-green-100', icon: UsersIcon },
        { id: 3, title: 'Транспортировка ресурсов', subtitle: 'Вода и кислород', eta: 'задержка', level: 'Критический', color: 'text-red-600 bg-red-100', icon: ExclamationCircleIcon }
    ])
    const [showShipmentModal, setShowShipmentModal] = useState(false)
    const [shipmentForm, setShipmentForm] = useState<Omit<Shipment, 'id' | 'color' | 'icon'>>({ title: '', subtitle: '', eta: '', level: 'Средний' })
    const [editShipmentId, setEditShipmentId] = useState<number | null>(null)

    const [upcoming] = useState<Upcoming[]>([
        { id: 1, title: 'Корабль снабжения "Альфа"', date: '20 марта 2025 г.' },
        { id: 2, title: 'Грузовой транспорт "Бета"', date: '25 марта 2025 г.' }
    ])

    const [groups, setGroups] = useState<Group[]>([
        { id: 1, name: 'Инженерия', count: 28, utilization: 92, shifts: 3, color: 'green' },
        { id: 2, name: 'Операции', count: 22, utilization: 95, shifts: 3, color: 'green' },
        { id: 3, name: 'Исследования', count: 15, utilization: 87, shifts: 2, color: 'yellow' },
        { id: 4, name: 'Техобслуживание', count: 19, utilization: 78, shifts: 2, color: 'yellow' }
    ])
    const [groupModal, setGroupModal] = useState<Group | null>(null)

    const [performance, setPerformance] = useState<Performance[]>([
        { id: 1, name: 'Общая эффективность', value: 88, color: 'blue' },
        { id: 2, name: 'Процент выполненных задач', value: 92, color: 'green' },
        { id: 3, name: 'Использование ресурсов', value: 85, color: 'purple' }
    ])
    const [perfModal, setPerfModal] = useState(false)
    const [perfForm, setPerfForm] = useState<Omit<Performance, 'id'>>({ name: '', value: 0, color: 'blue' })

    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && audioRef.current === null) {
            audioRef.current = new window.Audio('/warning.mp3')
            audioRef.current.loop = true
        }
        const hasCritical = shipments.some(s => s.level === 'Критический')
        if (audioRef.current) {
            if (hasCritical) {
                if (audioRef.current.paused) {
                    audioRef.current.currentTime = 0
                    audioRef.current.play()
                }
            } else {
                if (!audioRef.current.paused) {
                    audioRef.current.pause()
                    audioRef.current.currentTime = 0
                }
            }
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
        }
    }, [shipments])

    function filteredDocs(): Doc[] {
        let d = docs.filter(doc =>
            doc.title.toLowerCase().includes(search.toLowerCase()) ||
            doc.type.toLowerCase().includes(search.toLowerCase()) ||
            doc.status.toLowerCase().includes(search.toLowerCase()) ||
            doc.dept.toLowerCase().includes(search.toLowerCase())
        )
        if (sortField) {
            d = [...d].sort((a, b) => {
                if (a[sortField] < b[sortField]) return sortDir === 'asc' ? -1 : 1
                if (a[sortField] > b[sortField]) return sortDir === 'asc' ? 1 : -1
                return 0
            })
        }
        return d
    }

    function startEditDoc(doc: Doc) {
        setEditDocId(doc.id)
        setDocForm({ title: doc.title, type: doc.type, status: doc.status, dept: doc.dept })
        setShowDocModal(true)
    }

    function saveDoc() {
        if (editDocId !== null) {
            setDocs(docs =>
                docs.map(d =>
                    d.id === editDocId ? { ...d, ...docForm } : d
                )
            )
            toast.success('Документ обновлен')
        } else {
            setDocs(docs => [
                ...docs,
                { ...docForm, id: Date.now() }
            ])
            toast.success('Документ добавлен')
        }
        setShowDocModal(false)
        setEditDocId(null)
        setDocForm({ title: '', type: '', status: 'РАССМОТРЕНИЕ', dept: '' })
    }

    function removeDoc(id: number) {
        setDocs(docs => docs.filter(d => d.id !== id))
        toast.info('Документ удалён')
    }

    function startEditShipment(sh: Shipment) {
        setEditShipmentId(sh.id)
        setShipmentForm({ title: sh.title, subtitle: sh.subtitle, eta: sh.eta, level: sh.level })
        setShowShipmentModal(true)
    }

    function saveShipment() {
        if (editShipmentId !== null) {
            setShipments(arr => arr.map(s => s.id === editShipmentId ? { ...s, ...shipmentForm } : s))
            toast.success('Перевозка обновлена')
        } else {
            setShipments(arr => [
                ...arr,
                {
                    ...shipmentForm,
                    id: Date.now(),
                    color:
                        shipmentForm.level === 'Критический'
                            ? 'text-red-600 bg-red-100'
                            : shipmentForm.level === 'Высокий'
                                ? 'text-yellow-600 bg-yellow-100'
                                : 'text-green-600 bg-green-100',
                    icon: TruckIcon
                }
            ])
            toast.success('Перевозка добавлена')
        }
        setShowShipmentModal(false)
        setEditShipmentId(null)
        setShipmentForm({ title: '', subtitle: '', eta: '', level: 'Средний' })
    }

    function removeShipment(id: number) {
        setShipments(arr => arr.filter(s => s.id !== id))
        toast.info('Перевозка удалена')
    }

    function savePerf() {
        setPerformance(arr => [
            ...arr,
            { ...perfForm, id: Date.now() }
        ])
        toast.success('Метрика добавлена')
        setPerfForm({ name: '', value: 0, color: 'blue' })
        setPerfModal(false)
    }

    function updateGroup(id: number, field: keyof Omit<Group, 'id'>, val: number | string) {
        setGroups(arr => arr.map(g => g.id === id ? { ...g, [field]: val } : g))
        toast.info('Данные группы обновлены')
    }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      {showDocModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{editDocId ? 'Редактировать документ' : 'Добавить документ'}</h2>
            <input type="text" placeholder="Название" className="w-full mb-2 border rounded px-2 py-1"
              value={docForm.title} onChange={e => setDocForm(f => ({ ...f, title: e.target.value }))} />
            <input type="text" placeholder="Тип" className="w-full mb-2 border rounded px-2 py-1"
              value={docForm.type} onChange={e => setDocForm(f => ({ ...f, type: e.target.value }))} />
            <select
  className="w-full mb-2 border rounded px-2 py-1"
  value={docForm.status}
  onChange={e => setDocForm(f => ({ ...f, status: e.target.value as Doc['status'] }))}
>
  <option value="РАЗРЕШЕНО">РАЗРЕШЕНО</option>
  <option value="ПРИНЯТО">ПРИНЯТО</option>
  <option value="РАССМОТРЕНИЕ">РАССМОТРЕНИЕ</option>
</select>
            <input type="text" placeholder="Отдел" className="w-full mb-4 border rounded px-2 py-1"
              value={docForm.dept} onChange={e => setDocForm(f => ({ ...f, dept: e.target.value }))} />
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={saveDoc}>Сохранить</button>
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setShowDocModal(false); setEditDocId(null); }}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {showShipmentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{editShipmentId ? 'Редактировать перевозку' : 'Добавить перевозку'}</h2>
            <input type="text" placeholder="Название" className="w-full mb-2 border rounded px-2 py-1"
              value={shipmentForm.title} onChange={e => setShipmentForm(f => ({ ...f, title: e.target.value }))} />
            <input type="text" placeholder="Описание" className="w-full mb-2 border rounded px-2 py-1"
              value={shipmentForm.subtitle} onChange={e => setShipmentForm(f => ({ ...f, subtitle: e.target.value }))} />
            <input type="text" placeholder="ETA" className="w-full mb-2 border rounded px-2 py-1"
              value={shipmentForm.eta} onChange={e => setShipmentForm(f => ({ ...f, eta: e.target.value }))} />
            <select
  className="w-full mb-4 border rounded px-2 py-1"
  value={shipmentForm.level}
  onChange={e => setShipmentForm(f => ({ ...f, level: e.target.value as Shipment['level'] }))}
>
  <option value="Критический">Критический</option>
  <option value="Высокий">Высокий</option>
  <option value="Средний">Средний</option>
</select>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={saveShipment}>Сохранить</button>
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => { setShowShipmentModal(false); setEditShipmentId(null); }}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {groupModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{groupModal.name}</h2>
            <div>Количество: <input type="number" value={groupModal.count} onChange={e => updateGroup(groupModal.id, 'count', Number(e.target.value))} className="border px-2 py-1 rounded mb-2" /></div>
            <div>Утилизация: <input type="number" value={groupModal.utilization} min={0} max={100} onChange={e => updateGroup(groupModal.id, 'utilization', Number(e.target.value))} className="border px-2 py-1 rounded mb-2" />%</div>
            <div>Смены: <input type="number" value={groupModal.shifts} onChange={e => updateGroup(groupModal.id, 'shifts', Number(e.target.value))} className="border px-2 py-1 rounded mb-4" /></div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setGroupModal(null)}>Закрыть</button>
          </div>
        </div>
      )}

      {perfModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Добавить метрику</h2>
            <input type="text" placeholder="Название" className="w-full mb-2 border rounded px-2 py-1"
              value={perfForm.name} onChange={e => setPerfForm(f => ({ ...f, name: e.target.value }))} />
            <input type="number" placeholder="Значение" className="w-full mb-2 border rounded px-2 py-1"
              value={perfForm.value} onChange={e => setPerfForm(f => ({ ...f, value: Number(e.target.value) }))} />
            <select
  className="w-full mb-4 border rounded px-2 py-1"
  value={perfForm.color}
  onChange={e => setPerfForm(f => ({ ...f, color: e.target.value as Performance['color'] }))}
>
  <option value="blue">Синий</option>
  <option value="green">Зелёный</option>
  <option value="purple">Фиолетовый</option>
</select>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={savePerf}>Добавить</button>
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setPerfModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Администрирование</h1>
        <div className="flex space-x-2">
          <button className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => { setShowDocModal(true); setEditDocId(null); }}>
            <PlusIcon className="w-5 h-5 mr-1" /> Новый документ
          </button>
          <button className="inline-flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded"
            onClick={() => toast.info('Экспорт отчета скоро будет доступен')}>
            <ArrowDownTrayIcon className="w-5 h-5 mr-1" /> Экспорт отчета
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <DocumentTextIcon className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Действующие документы</p>
            <p className="text-lg font-medium">{docs.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <TruckIcon className="w-6 h-6 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Ожидающие отправки</p>
            <p className="text-lg font-medium">{shipments.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <UsersIcon className="w-6 h-6 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">Действующий персонал</p>
            <p className="text-lg font-medium">{groups.reduce((acc, g) => acc + g.count, 0)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-3">
          <ClockIcon className="w-6 h-6 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Текущее время работы</p>
            <p className="text-lg font-medium">642</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Управление документацией</h2>
            <FunnelIcon className="w-5 h-5 text-gray-500 cursor-pointer" onClick={() => { setSortField('status'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc') }} />
          </div>
          <input
            type="text"
            placeholder="Поиск документов..."
            className="w-full border rounded px-3 py-2 text-sm mb-2"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200 mt-2">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => { setSortField('title'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc') }}>Документ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => { setSortField('type'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc') }}>Тип</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => { setSortField('status'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc') }}>Статус</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => { setSortField('dept'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc') }}>Отдел</th>
                  <th />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocs().map(d => (
                  <tr key={d.id} className="group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <select
  className="px-2 py-1 text-xs rounded-full"
  value={d.status}
  onChange={e =>
    setDocs(arr =>
      arr.map(doc =>
        doc.id === d.id
          ? { ...doc, status: e.target.value as Doc['status'] }
          : doc
      )
    )
  }
>
  <option value="РАЗРЕШЕНО">РАЗРЕШЕНО</option>
  <option value="ПРИНЯТО">ПРИНЯТО</option>
  <option value="РАССМОТРЕНИЕ">РАССМОТРЕНИЕ</option>
</select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.dept}</td>
                    <td>
                      <button className="text-gray-400 hover:text-red-500 mr-2" onClick={() => removeDoc(d.id)}><TrashIcon className="w-5 h-5" /></button>
                      <button className="text-gray-400 hover:text-blue-500" onClick={() => startEditDoc(d)}><PencilIcon className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Логистика и перевозки</h2>
          <div className="flex space-x-2 mb-4">
            <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm" onClick={() => setShowShipmentModal(true)}>Добавить перевозку</button>
          </div>
          <ul className="space-y-3">
            {shipments.map(s => (
              <li key={s.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <s.icon className="w-5 h-5 text-gray-700" />
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.subtitle}</p>
                    <p className="text-xs text-gray-400 mt-1">Время прибытия: {s.eta}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 text-xs rounded-full ${s.color}`}>{s.level}</span>
                  <div className="flex mt-1">
                    <button className="text-gray-400 hover:text-blue-500 mr-2" onClick={() => startEditShipment(s)}><PencilIcon className="w-5 h-5" /></button>
                    <button className="text-gray-400 hover:text-red-500" onClick={() => removeShipment(s.id)}><TrashIcon className="w-5 h-5" /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Предстоящие перевозки</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              {upcoming.map(u => (
                <li key={u.id} className="flex justify-between">
                  <span>{u.title}</span>
                  <span>{u.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map(g => (
          <div key={g.id} className="bg-white rounded-lg shadow p-6 space-y-2 cursor-pointer"
            onClick={() => setGroupModal(g)}>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <UsersIcon className={`w-6 h-6 ${colorToClass(g.color)}`} />
                <div>
                  <p className="font-medium">{g.name}</p>
                  <p className="text-sm text-gray-500">{g.count} кадр.</p>
                </div>
              </div>
              {g.utilization < 90 && <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />}
            </div>
            <div className="text-sm text-gray-500">Утилизация</div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className={`h-2 ${colorToClass(g.color)}`}
                style={{ width: `${g.utilization}%` }} />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Активные смены</span>
              <span>{g.shifts}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="w-6 h-6 text-gray-700" />
          <h2 className="text-lg font-medium">Обзор производительности</h2>
        </div>
        <ul className="space-y-4">
          {performance.map(p => (
            <li key={p.id}>
              <div className="flex justify-between text-sm mb-1">
                <span>{p.name}</span>
                <span>{p.value}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className={`h-2 ${colorToClass(p.color)}`}
                  style={{ width: `${p.value}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <div className="flex space-x-4 mt-4">
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setPerfModal(true)}>Добавить метрику</button>
          <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded" onClick={() => toast.info('Просмотр отчётов скоро будет доступен')}>Просмотр отчетов</button>
        </div>
      </div>
    </div>
  )
}
