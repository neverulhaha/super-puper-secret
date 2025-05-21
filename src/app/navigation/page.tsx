'use client'
import React, { useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  RocketLaunchIcon,
  BeakerIcon,
  BoltIcon,
  CubeIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  InformationCircleIcon,
  XMarkIcon,
  PencilIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'
import NavigationRoute, { RouteLine, ArcPoint } from '@/components/NavigationRoute'
import { toast } from 'react-toastify'
import { getZoneRadius } from '@/lib/zoneRadii'

type MapObject = {
  id: number
  typeKey: string
  lat: number
  lon: number
  x: number
  y: number
  z: number
}

type InfrastructureType = {
  id: string
  name: string
  icon: React.ReactNode
  color: string
}

const MOON_RADIUS_KM = 1737.4

const infrastructureTypes: InfrastructureType[] = [
  { id: 'module', name: 'Жилой модуль', icon: <HomeIcon className="w-5 h-5 text-blue-600" />, color: 'border-blue-400' },
  { id: 'lab', name: 'Исследовательская лаборатория', icon: <BeakerIcon className="w-5 h-5 text-green-600" />, color: 'border-green-400' },
  { id: 'launch', name: 'Космодром', icon: <RocketLaunchIcon className="w-5 h-5 text-purple-600" />, color: 'border-purple-400' },
  { id: 'storage', name: 'Хранилище', icon: <CubeIcon className="w-5 h-5 text-red-600" />, color: 'border-red-400' },
  { id: 'power', name: 'Электростанция', icon: <BoltIcon className="w-5 h-5 text-yellow-600" />, color: 'border-yellow-400' }
]

type DbRoute = {
  path: ArcPoint[]
  id: number
  created_at: string
  name?: string | null
  description?: string | null
  transport?: string | null
  priority?: string | null
  status?: string | null
}

function getObjectLabel(obj: MapObject, idx: number, all: MapObject[]) {
  const type = infrastructureTypes.find(t => t.id === obj.typeKey)
  const sameTypeObjs = all.filter(o => o.typeKey === obj.typeKey)
  return type
    ? sameTypeObjs.length > 1
      ? `${type.name} #${sameTypeObjs.indexOf(obj) + 1} (id:${obj.id})`
      : type.name
    : obj.typeKey + ` (id:${obj.id})`
}

function getNearestObject(point: ArcPoint, mapObjects: MapObject[]) {
  let minDist = Infinity
  let nearest: MapObject | null = null
  for (const obj of mapObjects) {
    const dist = Math.sqrt(
      Math.pow(obj.x - point.x, 2) +
      Math.pow(obj.y - point.y, 2) +
      Math.pow(obj.z - point.z, 2)
    )
    if (dist < minDist) {
      minDist = dist
      nearest = obj
    }
  }
  return nearest
}

function slerpVectors(a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 {
  const theta = Math.acos(a.dot(b) / (a.length() * b.length()))
  if (theta === 0) return a.clone()
  const sinTheta = Math.sin(theta)
  const w1 = Math.sin((1 - t) * theta) / sinTheta
  const w2 = Math.sin(t * theta) / sinTheta
  return a.clone().multiplyScalar(w1).add(b.clone().multiplyScalar(w2))
}

function getArcPointsBetweenZonesOnMoon(
  fromObj: MapObject,
  toObj: MapObject,
  segments = 128,
  moonRadius = 1
): ArcPoint[] {
  const fromCenter = new THREE.Vector3(fromObj.x, fromObj.y, fromObj.z)
  const toCenter = new THREE.Vector3(toObj.x, toObj.y, toObj.z)

  const dir = toCenter.clone().sub(fromCenter).normalize()

  const fromZoneRadius = getZoneRadius(fromObj.typeKey)
  const toZoneRadius = getZoneRadius(toObj.typeKey)

  const start = fromCenter.clone().add(dir.clone().multiplyScalar(fromZoneRadius))
  const toDir = fromCenter.clone().sub(toCenter).normalize()
  const end = toCenter.clone().add(toDir.multiplyScalar(toZoneRadius))

  const points: ArcPoint[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const vec = slerpVectors(start, end, t)
    points.push({ x: vec.x, y: vec.y, z: vec.z })
  }
  return points
}





export default function NavigationPage() {
  const [statsRouteId, setStatsRouteId] = useState<number | null>(null)
  const [visibleRouteIds, setVisibleRouteIds] = useState<number[]>([])
  const [editingRouteId, setEditingRouteId] = useState<number | null>(null)
  const [editingRouteName, setEditingRouteName] = useState('')
  const [routeDescription, setRouteDescription] = useState('')
  const [routeName, setRouteName] = useState('')
  const [layoutId, setLayoutId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [mapObjects, setMapObjects] = useState<MapObject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null)
  const [routeParams, setRouteParams] = useState({
    from: '',
    to: '',
    transport: 'Пешком',
    priority: 'Стандартный'
  })
  const [routeLine, setRouteLine] = useState<RouteLine | undefined>(undefined)
  const [routeColor, setRouteColor] = useState<string | undefined>(undefined)
  const [distance, setDistance] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [routes, setRoutes] = useState<RouteLine[]>([])
  const [dbRoutes, setDbRoutes] = useState<DbRoute[]>([])

  const [animationRoute, setAnimationRoute] = useState<ArcPoint[] | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setVisibleRouteIds(dbRoutes.map(r => r.id))
  }, [dbRoutes])

  useEffect(() => {
    async function getCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)
    }
    getCurrentUser()
  }, [])

  useEffect(() => {
    async function fetchObjectsAndRoutes() {
      if (!userId) return
      setLoading(true)
      const { data: layoutData, error: layoutError } = await supabase
        .from('layouts')
        .select('id, data')
        .eq('user_id', userId)
        .single()
      if (layoutError) {
        setMapObjects([])
        setLayoutId(null)
        setRoutes([])
        setLoading(false)
        setDbRoutes([])
        return
      }
      if (layoutData && layoutData.data && Array.isArray(layoutData.data)) {
        setMapObjects(layoutData.data)
        setLayoutId(layoutData.id)
        await fetchDbRoutes(layoutData.id, layoutData.data)
      } else {
        setMapObjects([])
        setLayoutId(null)
        setRoutes([])
        setDbRoutes([])
      }
      setLoading(false)
    }
    async function fetchDbRoutes(layoutId: number, mapObjs: MapObject[]) {
      const { data, error } = await supabase
        .from('routes')
        .select('id, path, created_at, name, description, transport, priority')
        .eq('layout_id', layoutId)
        .order('created_at', { ascending: false })
      if (error) {
        setDbRoutes([])
        setRoutes([])
      } else if (Array.isArray(data)) {
        setDbRoutes(data.filter(r => Array.isArray(r.path) && r.path.length >= 2))
        setRoutes(data.filter(r => Array.isArray(r.path) && r.path.length >= 2).map(r => ({ points: r.path })))
      }
    }
    if (userId) {
      fetchObjectsAndRoutes()
    }
  }, [userId])

  useEffect(() => {
    if (!isAnimating || !animationRoute) return
    let frame: number
    const totalSteps = animationRoute.length - 1
    const duration = 2500
    const startTime = performance.now()
    function animate(now: number) {
      const elapsed = now - startTime
      let t = Math.min(1, elapsed / duration)
      setAnimationProgress(Math.floor(t * totalSteps))
      if (t < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [isAnimating, animationRoute])

  function playRouteAnimation(route: DbRoute) {
    setAnimationRoute(route.path)
    setAnimationProgress(0)
    setIsAnimating(true)
  }

  const getTypeColor = (typeKey: string) => {
    const found = infrastructureTypes.find(t => t.id === typeKey)
    if (!found) return '#2196f3'
    if (found.id === 'module') return '#3b82f6'
    if (found.id === 'lab') return '#22c55e'
    if (found.id === 'launch') return '#a855f7'
    if (found.id === 'power') return '#f59e42'
    if (found.id === 'storage') return '#f43f5e'
    return '#2196f3'
  }

  const groupedBases = useMemo(() => {
    const groups: Record<string, { name: string, count: number }> = {}
    mapObjects.forEach(obj => {
      const type = infrastructureTypes.find(t => t.id === obj.typeKey)
      if (type) {
        if (!groups[type.id]) {
          groups[type.id] = { name: type.name, count: 0 }
        }
        groups[type.id].count++
      }
    })
    return Object.entries(groups).map(([id, { name, count }]) => ({
      id,
      name,
      count,
      status: id === 'launch' ? 'Техобслуживание' : 'Эксплуатируется'
    }))
  }, [mapObjects])

  const handleRouteBuild = () => {
    if (!routeParams.from || !routeParams.to) return
    const fromObj = mapObjects.find(obj => obj.id.toString() === routeParams.from)
    const toObj = mapObjects.find(obj => obj.id.toString() === routeParams.to)
    if (fromObj && toObj) {
      const points = getArcPointsBetweenZonesOnMoon(fromObj, toObj)

      setRouteLine({ points })
      setRouteName('')
      setRouteColor(getTypeColor(fromObj.typeKey))
      setDistance(
        points.reduce((acc, curr, i, arr) => {
          if (i === 0) return 0
          const prev = arr[i - 1]
          return acc + Math.sqrt(
            Math.pow(curr.x - prev.x, 2) +
            Math.pow(curr.y - prev.y, 2) +
            Math.pow(curr.z - prev.z, 2)
          )
        }, 0)
      )
    } else {
      setRouteLine(undefined)
      setDistance(null)
    }
  }

  async function saveRouteNameOptimistic(routeId: number, name: string) {
    setEditingRouteId(null)
    setDbRoutes(prev =>
      prev.map(r =>
        r.id === routeId ? { ...r, name: name.trim() || null } : r
      )
    )
    if (name.trim().length === 0) {
      await supabase.from('routes').update({ name: null }).eq('id', routeId)
    } else {
      await supabase.from('routes').update({ name: name.trim() }).eq('id', routeId)
    }
  }

  async function fetchDbRoutes(layoutId: number, mapObjs: MapObject[]) {
    const { data, error } = await supabase
      .from('routes')
      .select('id, path, created_at, name, description, transport, priority')
      .eq('layout_id', layoutId)
      .order('created_at', { ascending: false })
    if (error) {
      setDbRoutes([])
      setRoutes([])
    } else if (Array.isArray(data)) {
      setDbRoutes(data.filter(r => Array.isArray(r.path) && r.path.length >= 2))
      setRoutes(data.filter(r => Array.isArray(r.path) && r.path.length >= 2).map(r => ({ points: r.path })))
    }
  }

  async function handleDeleteRoute(routeId: number) {
    if (!window.confirm('Удалить этот маршрут?')) return
    if (!layoutId) return
    const { error } = await supabase.from('routes').delete().eq('id', routeId)
    if (error) {
      toast.error("Ошибка при удалении: " + error.message)
    } else {
      toast.success("Маршрут удалён!")
      await fetchDbRoutes(layoutId, mapObjects)
      setSelectedRouteId(null)
    }
  }

  async function handleSaveToDb() {
    if (!userId) {
      toast.error("Необходимо войти в аккаунт.")
      return
    }
    if (!layoutId) {
      toast.error("Ошибка: не найден макет объектов!")
      return
    }
    if (!routeLine || !routeLine.points || routeLine.points.length < 2) {
      toast.error("Сначала рассчитайте маршрут!")
      return
    }
    setSaving(true)
    const { error } = await supabase.from('routes').insert({
      user_id: userId,
      layout_id: layoutId,
      path: routeLine.points,
      name: routeName.trim() ? routeName.trim() : null,
      description: routeDescription.trim() ? routeDescription.trim() : null,
      transport: routeParams.transport,
      priority: routeParams.priority,
      created_at: new Date().toISOString()
    })
    setSaving(false)
    if (error) {
      toast.error("Ошибка при сохранении: " + error.message)
    } else {
      toast.success("Сохранено!")
      setRouteName('')
      setRouteDescription('')
      await fetchDbRoutes(layoutId, mapObjects)
    }
  }

  function estimateTime(distance: number, transport: string) {
    let speed = 1
    if (transport === 'Пешком') speed = 1
    else if (transport === 'Ровер') speed = 2.5
    else if (transport === 'Транспорт') speed = 3
    const minutes = distance / speed
    return `${minutes < 1 ? '<1' : Math.round(minutes)} мин`
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Навигационная система</h1>
      </header>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 bg-gray-100 rounded-lg h-[500px] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">Загрузка карты...</div>
          ) : (
            <NavigationRoute
              mapObjects={mapObjects}
              getTypeColor={getTypeColor}
              routeLine={routeLine}
              routeColor={routeColor}
              routes={routes.filter((_, idx) => visibleRouteIds.includes(dbRoutes[idx]?.id))}
              dbRoutes={dbRoutes}
              selectedRouteId={selectedRouteId}
              animationPoint={isAnimating && animationRoute
                ? animationRoute[animationProgress]
                : undefined}
            />
          )}
        </div>
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Текущие маршруты</h2>
          <ul className="space-y-3">
            {dbRoutes.length === 0 && (
              <li className="text-gray-500 text-sm px-3">Нет сохранённых маршрутов</li>
            )}
            {dbRoutes.map((r) => {
              const from = getNearestObject(r.path[0], mapObjects)
              const to = getNearestObject(r.path[r.path.length - 1], mapObjects)
              let total = 0
              for (let i = 1; i < r.path.length; i++) {
                const prev = r.path[i - 1]
                const curr = r.path[i]
                total += Math.sqrt(
                  Math.pow(curr.x - prev.x, 2) +
                  Math.pow(curr.y - prev.y, 2) +
                  Math.pow(curr.z - prev.z, 2)
                )
              }
              return (
                <li
                  key={r.id}
                  onClick={() => setSelectedRouteId(r.id)}
                  className={`group p-4 rounded-lg shadow-sm bg-gray-50 border border-gray-200 transition-all duration-150 cursor-pointer flex flex-col gap-2
                    ${selectedRouteId === r.id ? 'bg-blue-50 ring-2 ring-blue-200' : 'hover:bg-blue-100'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        className="flex-shrink-0"
                        title={visibleRouteIds.includes(r.id) ? "Скрыть на карте" : "Показать на карте"}
                        onClick={e => {
                          e.stopPropagation()
                          setVisibleRouteIds(ids =>
                            ids.includes(r.id) ? ids.filter(id => id !== r.id) : [...ids, r.id]
                          )
                        }}
                      >
                        {visibleRouteIds.includes(r.id)
                          ? <EyeIcon className="w-5 h-5 text-blue-600" />
                          : <EyeSlashIcon className="w-5 h-5 text-gray-400" />}
                      </button>
                      <MapPinIcon className="w-5 h-5 flex-shrink-0 text-gray-600" />
                      {editingRouteId === r.id ? (
                        <input
                          className="border rounded px-2 py-1 text-sm font-semibold min-w-0 flex-1"
                          value={editingRouteName}
                          autoFocus
                          onChange={e => setEditingRouteName(e.target.value)}
                          onBlur={() => saveRouteNameOptimistic(r.id, editingRouteName)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveRouteNameOptimistic(r.id, editingRouteName)
                            if (e.key === 'Escape') setEditingRouteId(null)
                          }}
                        />
                      ) : (
                        <span
                          className="truncate font-semibold cursor-pointer hover:underline"
                          title={r.name || ''}
                          onDoubleClick={e => {
                            e.stopPropagation()
                            setEditingRouteId(r.id)
                            setEditingRouteName(r.name ?? '')
                          }}
                        >
                          {r.name
                            ? r.name
                            : (
                              <>
                                {from ? getObjectLabel(from, 0, mapObjects) : 'Неизвестно'}
                                {' → '}
                                {to ? getObjectLabel(to, 0, mapObjects) : 'Неизвестно'}
                              </>
                            )}
                        </span>
                      )}
                      <button
                        className="text-gray-400 hover:text-blue-600 ml-2"
                        onClick={e => {
                          e.stopPropagation()
                          setEditingRouteId(r.id)
                          setEditingRouteName(r.name ?? '')
                        }}
                        title="Переименовать"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      className="ml-2 text-gray-400 hover:text-indigo-600"
                      title="Статистика маршрута"
                      onClick={e => {
                        e.stopPropagation()
                        setStatsRouteId(r.id)
                      }}
                    >
                      <InformationCircleIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-red-100 transition flex-shrink-0"
                      title="Удалить маршрут"
                      onClick={e => {
                        e.stopPropagation()
                        handleDeleteRoute(r.id)
                      }}
                    >
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                  {r.description && (
                    <div className="text-xs text-gray-500 mt-1 mb-1 px-2">
                      {r.description}
                    </div>
                  )}
                  {(r.transport || r.priority) && (
                    <div className="flex flex-wrap items-center gap-3 text-xs px-2 text-gray-500 mb-1">
                      {r.transport && <span className="flex gap-1">Транспорт: <span className="font-bold text-gray-700">{r.transport}</span></span>}
                      {r.priority && <span className="flex gap-1">| Приоритет: <span className="font-bold text-gray-700">{r.priority}</span></span>}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-1 px-2">
                    <span className="text-xs text-gray-400">Добавлено: {new Date(r.created_at).toLocaleString()}</span>
                    <span className="ml-4 px-2 py-1 text-xs text-gray-600 bg-white rounded whitespace-nowrap">
                      {'~' + (total * MOON_RADIUS_KM).toFixed(1) + ' км'}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Расположение баз</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск локации..."
              className="w-full border rounded px-3 py-2"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute right-3 top-3" />
          </div>
          <ul className="divide-y divide-gray-200">
            {groupedBases.map(b => (
              <li key={b.id} className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-2 flex-1 truncate">
                  <MapPinIcon className="w-5 h-5 text-gray-700" />
                  <span className="truncate">{b.name}</span>
                </div>
                <span className="text-sm text-gray-500">Занято: {b.count}</span>
                <span className={`ml-4 px-2 py-1 text-xs rounded ${b.status === 'Эксплуатируется' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium">Планирование маршрута</h2>
          <div className="space-y-3 text-sm">
            <select
              value={routeParams.from}
              onChange={e => setRouteParams({ ...routeParams, from: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Выберите точку отправления</option>
              {mapObjects.map((obj, idx, all) => (
                <option key={obj.id} value={obj.id}>
                  {getObjectLabel(obj, idx, all)}
                </option>
              ))}
            </select>
            <select
              value={routeParams.to}
              onChange={e => setRouteParams({ ...routeParams, to: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Выберите точку назначения</option>
              {mapObjects.map((obj, idx, all) => (
                <option key={obj.id} value={obj.id}>
                  {getObjectLabel(obj, idx, all)}
                </option>
              ))}
            </select>
            <select
              value={routeParams.transport}
              onChange={e => setRouteParams({ ...routeParams, transport: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Выберите способ перелвижения</option>
              <option>Пешком</option>
              <option>Транспорт</option>
              <option>Ровер</option>
            </select>
            <select
              value={routeParams.priority}
              onChange={e => setRouteParams({ ...routeParams, priority: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Выберите приоритет пути</option>
              <option>Стандартный</option>
              <option>Высокий</option>
              <option>Низкий</option>
            </select>
          </div>
          <button
            className="w-full bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleRouteBuild}
            disabled={!routeParams.from || !routeParams.to}
          >
            Рассчитать маршрут
          </button>
          {distance !== null && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm flex flex-col gap-1">
              <span>Расстояние: {(distance * MOON_RADIUS_KM).toFixed(1)} км</span>
              <span>
                Оценочное время ({routeParams.transport}):{' '}
                {estimateTime(distance, routeParams.transport)}
              </span>
              <input
                type="text"
                value={routeName}
                onChange={e => setRouteName(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Название маршрута (необязательно)"
              />
              <input
                type="text"
                value={routeDescription}
                onChange={e => setRouteDescription(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Описание маршрута (необязательно)"
              />
              <button
                className="w-full bg-green-600 text-white px-4 py-2 rounded mt-3"
                onClick={handleSaveToDb}
                disabled={!routeLine || saving}
              >
                {saving ? "Сохраняем..." : "Сохранить в БД"}
              </button>
            </div>
          )}
        </div>
      </div>
      {statsRouteId && (() => {
        const route = dbRoutes.find(r => r.id === statsRouteId)
        if (!route) return null
        const from = getNearestObject(route.path[0], mapObjects)
        const to = getNearestObject(route.path[route.path.length - 1], mapObjects)
        let total = 0
        for (let i = 1; i < route.path.length; i++) {
          const prev = route.path[i - 1]
          const curr = route.path[i]
          total += Math.sqrt(
            Math.pow(curr.x - prev.x, 2) +
            Math.pow(curr.y - prev.y, 2) +
            Math.pow(curr.z - prev.z, 2)
          )
        }
        return (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={() => setStatsRouteId(null)}
          >
            <div
              className="bg-white rounded-2xl p-7 shadow-2xl min-w-[320px] max-w-full relative animate-fade-in"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 text-xl"
                onClick={() => setStatsRouteId(null)}
              >
                <XMarkIcon className="w-7 h-7" />
              </button>
              <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <InformationCircleIcon className="w-6 h-6 text-blue-600" />
                Статистика маршрута
              </h3>
              <div className="flex flex-col gap-2 text-[15px]">
                <div>
                  <b>Название:</b> {route.name || (
                    <>
                      {from ? getObjectLabel(from, 0, mapObjects) : 'Неизвестно'}
                      {' → '}
                      {to ? getObjectLabel(to, 0, mapObjects) : 'Неизвестно'}
                    </>
                  )}
                </div>
                <div><b>Расстояние:</b> {(total * MOON_RADIUS_KM).toFixed(1)} км</div>
                <div><b>Время:</b> {estimateTime(total, route.transport || 'Пешком')}</div>
                <div><b>Транспорт:</b> {route.transport || '—'}</div>
                <div><b>Приоритет:</b> {route.priority || '—'}</div>
                <div><b>Дата создания:</b> {new Date(route.created_at).toLocaleString()}</div>
                {route.description && (
                  <div className="pt-2"><b>Описание:</b> <span className="block">{route.description}</span></div>
                )}
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 mt-4 w-full transition flex items-center justify-center gap-2"
                onClick={() => {
                  setStatsRouteId(null)
                  playRouteAnimation(route)
                }}
              >
                <PlayIcon className="w-5 h-5" />
                Воспроизвести маршрут
              </button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
