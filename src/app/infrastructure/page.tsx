'use client'
import dynamic from "next/dynamic"
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { ZONE_RADII, getZoneRadius } from '@/lib/zoneRadii'
import {
  HomeIcon,
  RocketLaunchIcon,
  BeakerIcon,
  BoltIcon,
  CubeIcon,
  ArrowUpTrayIcon,
  ArrowUpIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import HistoryFaqBlock from '@/components/HistoryFaqBlock'

const LunarMapEmbedInfrastructure = dynamic(
  () => import('@/components/LunarMapEmbedInfrastructure'),
  { ssr: false }
)

type InfrastructureType = {
  key: string
  name: string
  description: string
  range: string
  icon: React.ReactNode
  color: string
}

type MapObject = {
  id: number
  typeKey: string
  lat: number
  lon: number
  x: number
  y: number
  z: number
}

function getSafetyAlerts(
  safety: ReturnType<typeof calcSafetyMetrics>,
  objects: MapObject[]
) {
  if (objects.length === 0) return []
  const alerts: { type: "success" | "warning" | "danger"; text: string }[] = []

  if (safety.integrity < 90)
    alerts.push({
      type: safety.integrity < 75 ? "danger" : "warning",
      text: "Внимание: обнаружены пересечения объектов! Переместите объекты дальше друг от друга."
    })

  if (safety.radiation < 80)
    alerts.push({
      type: safety.radiation < 60 ? "danger" : "warning",
      text: "Радиационная безопасность снижена — лаборатории и электростанции расположены слишком близко к жилым модулям."
    })

  if (safety.emergency < 80)
    alerts.push({
      type: "warning",
      text: "Проверьте аварийный доступ — объекты либо слишком кучно, либо слишком далеко друг от друга."
    })

  if (safety.resource < 80)
    alerts.push({
      type: "warning",
      text: "Распределение ресурсов неравномерно: слишком много объектов одного типа."
    })

  if (alerts.length === 0 && safety.overall === 100)
    alerts.push({
      type: "success",
      text: "Макет оптимален! Всё отлично."
    })

  return alerts
}

function generateUniqueId(objects: MapObject[]) {
  let id = Date.now() + Math.floor(Math.random() * 100000)
  while (objects.some(o => o.id === id)) {
    id += Math.floor(Math.random() * 100)
  }
  return id
}

function calcSafetyMetrics(objects: MapObject[]) {
  if (objects.length === 0) {
    return {
      integrity: 0,
      radiation: 0,
      emergency: 0,
      resource: 0,
      overall: 0,
    }
  }

  let totalPairs = 0
  let overlapValue = 0
  for (let i = 0; i < objects.length; i++) {
    for (let j = i + 1; j < objects.length; j++) {
      totalPairs++
      const r1 = getZoneRadius(objects[i].typeKey)
      const r2 = getZoneRadius(objects[j].typeKey)
      const dx = objects[i].x - objects[j].x
      const dy = objects[i].y - objects[j].y
      const dz = objects[i].z - objects[j].z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      const minDist = r1 + r2
      if (dist < minDist) {
        overlapValue += ((minDist - dist) / minDist)
      }
    }
  }
  const integrity = Math.max(0, 100 - (overlapValue / (totalPairs || 1)) * 100)

  let dangerLab = 0, dangerPower = 0, countLab = 0, countPower = 0
  objects.forEach(obj1 => {
    if (obj1.typeKey === 'module') {
      objects.forEach(obj2 => {
        if (obj2.typeKey === 'power') {
          countPower++
          const d = Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2 + (obj1.z - obj2.z) ** 2)
          if (d < 0.28) dangerPower++
        }
        if (obj2.typeKey === 'lab') {
          countLab++
          const d = Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2 + (obj1.z - obj2.z) ** 2)
          if (d < 0.28) dangerLab++
        }
      })
    }
  })
  let labPowerDanger = 0
  objects.forEach(obj1 => {
    if (obj1.typeKey === 'lab') {
      objects.forEach(obj2 => {
        if (obj2.typeKey === 'power') {
          const d = Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2 + (obj1.z - obj2.z) ** 2)
          if (d < 0.1) labPowerDanger++
        }
      })
    }
  })
  let radiation = 100 - ((dangerLab + dangerPower) * 12 / ((countLab + countPower) || 1))
  if (labPowerDanger > 0) radiation -= 5
  radiation = Math.max(20, Math.round(radiation))

  let emergencySum = 0
  let modules = objects.filter(o => o.typeKey === 'module')
  modules.forEach(mod => {
    let uniqueTypes = new Set()
    objects.forEach(obj2 => {
      if (obj2.id !== mod.id) {
        const d = Math.sqrt((mod.x - obj2.x) ** 2 + (mod.y - obj2.y) ** 2 + (mod.z - obj2.z) ** 2)
        if (d < 0.3) uniqueTypes.add(obj2.typeKey)
      }
    })
    if (uniqueTypes.size < 2) emergencySum++
  })
  let emergency = 100 - emergencySum * 25
  if (emergency < 0) emergency = 0

  let typeCounts: Record<string, number> = {}
  objects.forEach(obj => {
    typeCounts[obj.typeKey] = (typeCounts[obj.typeKey] || 0) + 1
  })
  let resource = 100
  let mustHaveTypes = ['lab', 'power', 'storage']
  mustHaveTypes.forEach(t => {
    if (!typeCounts[t]) resource -= 15
  })
  Object.values(typeCounts).forEach(count => {
    if (count > objects.length / 2) resource -= 15
  })
  resource = Math.max(0, resource)
  const overall = Math.round((integrity * 0.4 + radiation * 0.2 + emergency * 0.2 + resource * 0.2))

  return {
    integrity: Math.round(integrity),
    radiation: Math.round(radiation),
    emergency: Math.round(emergency),
    resource: Math.round(resource),
    overall: Math.round(overall),
  }
}

export default function InfrastructurePage() {
  const types: InfrastructureType[] = [
    {
      key: 'module',
      name: 'Жилой модуль',
      description: 'Для экипажа и жизнеобеспечения',
      range: '100–300 м²',
      icon: <HomeIcon className="w-5 h-5 text-blue-600" />,
      color: '#3b82f6'
    },
    {
      key: 'launch',
      name: 'Космодром',
      description: 'Запуск и посадка ракет',
      range: '1000–2000 м²',
      icon: <RocketLaunchIcon className="w-5 h-5 text-purple-600" />,
      color: '#a855f7'
    },
    {
      key: 'lab',
      name: 'Исследовательская лаборатория',
      description: 'Анализ образцов и эксперименты',
      range: '200–500 м²',
      icon: <BeakerIcon className="w-5 h-5 text-green-600" />,
      color: '#22c55e'
    },
    {
      key: 'power',
      name: 'Электростанция',
      description: 'Генерация энергии',
      range: '300–1000 м²',
      icon: <BoltIcon className="w-5 h-5 text-yellow-600" />,
      color: '#f59e42'
    },
    {
      key: 'storage',
      name: 'Хранилище',
      description: 'Складские помещения',
      range: '150–400 м²',
      icon: <CubeIcon className="w-5 h-5 text-red-600" />,
      color: '#f43f5e'
    }
  ]

  const selectedRef = useRef<string>(types[0].key)
  const [selected, setSelected] = useState<string>(types[0].key)
  const [mapObjects, setMapObjects] = useState<MapObject[]>([])
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const rightRef = useRef<HTMLDivElement>(null)
  const [sideHeight, setSideHeight] = useState<number | undefined>(undefined)
  const [history, setHistory] = useState<string[]>([])

  const safety = calcSafetyMetrics(mapObjects)
  const safetyAlerts = getSafetyAlerts(safety, mapObjects)
  const [previewObj, setPreviewObj] = useState<MapObject | null>(null)

  useEffect(() => { selectedRef.current = selected }, [selected])

  const handlePreviewPosition = useCallback(
    (pos: { x: number, y: number, z: number, lat: number, lon: number } | null) => {
      if (!selectedRef.current || !pos) return setPreviewObj(null)
      setPreviewObj({
        id: -1,
        typeKey: selectedRef.current,
        lat: pos.lat,
        lon: pos.lon,
        x: pos.x,
        y: pos.y,
        z: pos.z,
      })
    },
    []
  )

  useEffect(() => {
    selectedRef.current = selected
  }, [selected])

  useEffect(() => {
    if (rightRef.current) setSideHeight(rightRef.current.offsetHeight)
  }, [rightRef.current, types.length, mapObjects.length])

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  const getTypeColor = (typeKey: string) => {
    return types.find(t => t.key === typeKey)?.color || '#ff3333'
  }

  const isValidObject = (obj: any): obj is MapObject =>
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.typeKey === 'string' &&
    typeof obj.x === 'number' &&
    typeof obj.y === 'number' &&
    typeof obj.z === 'number' &&
    !Number.isNaN(obj.x) &&
    !Number.isNaN(obj.y) &&
    !Number.isNaN(obj.z)

  const handleMapClick = useCallback(
    (lat: number, lon: number, point?: { x: number, y: number, z: number }) => {
      if (!selectedRef.current || !point) return
      setMapObjects(prev => {
        const radius = getZoneRadius(selectedRef.current)
        const hasIntersection = prev.some(obj => {
          const otherRadius = getZoneRadius(obj.typeKey)
          const dx = point.x - obj.x
          const dy = point.y - obj.y
          const dz = point.z - obj.z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          return dist < (radius + otherRadius)
        })
        if (hasIntersection) {
          setError("Ошибка: Зоны объектов не должны пересекаться. Попробуйте разместить объект дальше от других.")
          return prev
        }
        setError(null)
        const id = generateUniqueId(prev)
        if (
          typeof point.x !== 'number' || typeof point.y !== 'number' || typeof point.z !== 'number' ||
          Number.isNaN(point.x) || Number.isNaN(point.y) || Number.isNaN(point.z)
        ) {
          setError("Ошибка: Координаты объекта некорректны.")
          return prev
        }
        setHistory(h => [
          ...h,
          `Добавлен объект: ${types.find(t => t.key === selectedRef.current)?.name || selectedRef.current}`
        ])
        return [
          ...prev,
          {
            id,
            typeKey: selectedRef.current,
            lat,
            lon,
            x: point.x,
            y: point.y,
            z: point.z
          }
        ]
      })
    },
    []
  )

  async function getUserId() {
    const { data } = await supabase.auth.getUser()
    if (data && data.user) return data.user.id
    return null
  }

  async function saveLayout() {
    setSaving(true)
    const userId = await getUserId()
    if (!userId) {
      setError("Необходима авторизация")
      setSaving(false)
      return
    }
    const { error: dbError } = await supabase
      .from('layouts')
      .upsert(
        [{ user_id: userId, data: mapObjects }],
        { onConflict: 'user_id' }
      )
    setSaving(false)
    if (dbError) setError("Ошибка при сохранении макета: " + dbError.message)
    else {
      setSuccess("Макет успешно сохранён!")
      setHistory(h => [...h, "Макет сохранён в базу"])
    }
  }

  async function loadLayoutFromSupabase() {
    setLoading(true)
    const userId = await getUserId()
    if (!userId) {
      setError("Необходима авторизация")
      setLoading(false)
      return
    }
    const { data, error: dbError } = await supabase
      .from('layouts')
      .select('data')
      .eq('user_id', userId)
      .single()
    setLoading(false)
    if (dbError) setError("Ошибка при загрузке макета: " + dbError.message)
    else if (data && data.data) {
      setMapObjects(data.data)
      setSuccess("Макет успешно загружен из Supabase!")
      setHistory(h => [...h, "Макет загружен из базы"])
    } else setError("Макет не найден")
  }

  function handleExport() {
    try {
      const dataStr = JSON.stringify(mapObjects, null, 2)
      const blob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "infrastructure_layout.json"
      a.click()
      setSuccess("Макет успешно экспортирован в JSON!")
      setHistory(h => [...h, "Макет экспортирован"])
    } catch {
      setError("Ошибка экспорта макета")
    }
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = function (ev) {
      try {
        const imported = JSON.parse(ev.target?.result as string)
        if (!Array.isArray(imported)) throw new Error()
        const filtered = imported.filter(isValidObject)
        setMapObjects(filtered)
        setSuccess("Макет успешно импортирован из файла!")
        setHistory(h => [...h, "Макет импортирован из файла"])
      } catch {
        setError("Ошибка при импорте макета")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  useEffect(() => {
    async function fetchUserLayout() {
      setLoading(true)
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData?.user?.id
      if (!userId) {
        setError("Необходима авторизация")
        setLoading(false)
        return
      }
      const { data, error: dbError } = await supabase
        .from('layouts')
        .select('data')
        .eq('user_id', userId)
        .single()
      setLoading(false)
      if (dbError) setError("Ошибка при загрузке макета: " + dbError.message)
      else if (data && data.data) {
        setMapObjects(data.data)
        setHistory(h => [...h, "Макет загружен из базы"])
      }
      else setError("Макет не найден")
    }
    fetchUserLayout()
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8 text-black">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Планирование инфраструктуры</h1>
        <div className="space-x-2 flex flex-wrap">
          <button
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded"
            onClick={saveLayout}
            disabled={saving}
          >
            <Cog6ToothIcon className="w-5 h-5 mr-1" />
            {saving ? "Сохраняем..." : "Сохранить макет в базу"}
          </button>
          <button
            className="inline-flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded"
            onClick={handleExport}
          >
            <ArrowUpTrayIcon className="w-5 h-5 mr-1" /> Экспортировать
          </button>
          <label className="inline-flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer">
            <ArrowUpIcon className="w-5 h-5 mr-1" /> Импортировать
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportFile}
            />
          </label>
        </div>
      </header>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <div
            className="relative bg-white rounded-lg shadow overflow-hidden w-full"
            style={sideHeight ? { height: sideHeight } : { minHeight: 400 }}
          >
            <LunarMapEmbedInfrastructure
              onSelectCoords={handleMapClick}
              mapObjects={mapObjects}
              getTypeColor={getTypeColor}
              previewObject={previewObj}
              onPreviewPosition={handlePreviewPosition}
            />
          </div>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Анализ безопасности</h3>
              <span className="text-sm text-blue-600">Детали &gt;</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Общая безопасность</span>
              <span className="font-medium">{safety.overall}%</span>
            </div>
            {[
              ['Структурная целостность', safety.integrity],
              ['Радиационная безопасность', safety.radiation],
              ['Аварийный доступ', safety.emergency],
              ['Распределение ресурсов', safety.resource],
            ].map(([label, value], i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <span>{value}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                  <div className="bg-blue-500 h-2" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
            {safetyAlerts.length > 0 && (
              <div className="space-y-2 mb-3">
                {safetyAlerts.map((alert, i) => (
                  <div
                    key={i}
                    className={
                      "px-4 py-2 rounded flex items-center " +
                      (alert.type === "success"
                        ? "bg-green-100 border border-green-400 text-green-800"
                        : alert.type === "danger"
                          ? "bg-red-100 border border-red-400 text-red-800"
                          : "bg-yellow-100 border border-yellow-400 text-yellow-800")
                    }
                  >
                    {alert.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div
            className="bg-white rounded-lg shadow p-6 space-y-4"
            ref={rightRef}
          >
            <h2 className="text-lg font-medium">Планирование объекта</h2>
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-3 flex items-center justify-between">
                <span>{success}</span>
                <button className="ml-3" onClick={() => setSuccess(null)} title="Закрыть">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3 flex items-center justify-between">
                <span>{error}</span>
                <button className="ml-3" onClick={() => setError(null)} title="Закрыть">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="space-y-2">
              {types.map((t) => (
                <div
                  key={t.key}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${selected === t.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400'} transition`}
                  onClick={() => setSelected(t.key)}
                >
                  <div className="flex items-center gap-3">
                    {t.icon}
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.description}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-600">{t.range}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 bg-blue-600 text-white rounded py-2 px-4"
                onClick={() => {
                  setMapObjects([])
                  setError(null)
                  setSuccess(null)
                  setHistory(h => [...h, "Макет сброшен"])
                }}
              >
                Сброс
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <HistoryFaqBlock history={history} />
          </div>
        </div>
      </div>
    </div>
  )
}
