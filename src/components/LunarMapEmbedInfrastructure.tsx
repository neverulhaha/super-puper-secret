'use client'
import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { getZoneRadius } from '@/lib/zoneRadii'

function getIconSvg(typeKey: string, color: string) {
  if (typeKey === 'module') {
    return `<svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>`
  }
  if (typeKey === 'launch') {
    return `<svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>`
  }
  if (typeKey === 'lab') {
    return `<svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>`
  }
  if (typeKey === 'power') {
    return `<svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>`
  }
  if (typeKey === 'storage') {
    return `<svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>`
  }
  return `<svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" /></svg>`
}

function svgToDataUrl(svg: string) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

const spriteTextureCache: Record<string, THREE.Texture> = {}

function getSpriteTexture(typeKey: string, color: string) {
  const key = `${typeKey}_${color}`
  if (!spriteTextureCache[key]) {
    const svg = getIconSvg(typeKey, color)
    const dataUrl = svgToDataUrl(svg)
    spriteTextureCache[key] = new THREE.TextureLoader().load(dataUrl)
  }
  return spriteTextureCache[key]
}

interface MapObject {
  id: number
  typeKey: string
  lat: number
  lon: number
  x: number
  y: number
  z: number
  color?: string
}

export type ArcPoint = { x: number, y: number, z: number }
export type RouteLine = { points: ArcPoint[] }

interface Props {
  onSelectCoords?: (lat: number, lon: number, point: { x: number, y: number, z: number }) => void
  mapObjects?: MapObject[]
  getTypeColor?: (typeKey: string) => string
  previewObject?: MapObject | null
  onPreviewPosition?: (pos: { x: number, y: number, z: number, lat: number, lon: number } | null) => void
  routeLine?: RouteLine
  routeColor?: string
  routes?: RouteLine[]
  dbRoutes?: any[]
  selectedRouteId?: number | null
  animationPoint?: ArcPoint
}


const MOON_TEXTURE_URL = '/moon_8k_color_brim16.jpg'

export default function LunarMapEmbedInfrastructure({
  onSelectCoords,
  mapObjects = [],
  getTypeColor,
  previewObject,
  onPreviewPosition,
  routeLine,
  routeColor,
  routes,
  dbRoutes,
  selectedRouteId,
  animationPoint
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<any>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const moonRef = useRef<THREE.Mesh | null>(null)
  const markerGroupRef = useRef<THREE.Group | null>(null)
  const isDraggingRef = useRef(false)
  const sizeRef = useRef<{ width: number, height: number }>({ width: 0, height: 0 })

  useEffect(() => {
    if (!containerRef.current) return
    const width = containerRef.current.offsetWidth
    const height = containerRef.current.offsetHeight
    sizeRef.current = { width, height }

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.z = 3
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const starTexture = new THREE.TextureLoader().load('/stars.jpg')
    const starGeometry = new THREE.SphereGeometry(100, 64, 64)
    const starMaterial = new THREE.MeshBasicMaterial({
      map: starTexture,
      side: THREE.BackSide
    })
    const starSphere = new THREE.Mesh(starGeometry, starMaterial)
    scene.add(starSphere)

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.3)
    sunLight.position.set(5, 3, 10)
    scene.add(sunLight)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
    scene.add(ambientLight)

    const earthshine = new THREE.DirectionalLight(0x4477aa, 0.09)
    earthshine.position.set(-7, -2, -9)
    scene.add(earthshine)

    const loader = new THREE.TextureLoader()
    loader.load(MOON_TEXTURE_URL, (texture) => {
      const geometry = new THREE.SphereGeometry(1, 64, 64)
      const material = new THREE.MeshPhongMaterial({ map: texture })
      const moon = new THREE.Mesh(geometry, material)
      scene.add(moon)
      moonRef.current = moon
    })

    const markerGroup = new THREE.Group()
    scene.add(markerGroup)
    markerGroupRef.current = markerGroup

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 1.2
    controls.maxDistance = 3
    controlsRef.current = controls

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return
      const width = containerRef.current.offsetWidth
      const height = containerRef.current.offsetHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)

    renderer.domElement.addEventListener('mousedown', () => {
      isDraggingRef.current = false
    })

    renderer.domElement.addEventListener('mousemove', (e) => {
      if (e.buttons === 1) isDraggingRef.current = true
    })

    renderer.domElement.addEventListener('click', (event) => {
      if (isDraggingRef.current) return
      if (!moonRef.current || !cameraRef.current || !rendererRef.current) return
      const rect = renderer.domElement.getBoundingClientRect()
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, cameraRef.current)
      const intersects = raycaster.intersectObject(moonRef.current)
      if (intersects.length > 0) {
        const point = intersects[0].point
        const radius = Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2)
        const lat = Math.asin(point.y / radius) * (180 / Math.PI)
        const lon = Math.atan2(point.z, point.x) * (180 / Math.PI)
        if (onSelectCoords) {
          onSelectCoords(
            Number(lat.toFixed(3)),
            Number(lon.toFixed(3)),
            {
              x: point.x,
              y: point.y,
              z: point.z
            }
          )
        }
      }
    })

    renderer.domElement.addEventListener('mousemove', (event) => {
      if (!moonRef.current || !cameraRef.current || !rendererRef.current) return
      const rect = renderer.domElement.getBoundingClientRect()
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, cameraRef.current)
      const intersects = raycaster.intersectObject(moonRef.current)
      if (intersects.length > 0) {
        const point = intersects[0].point
        const radius = Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2)
        const lat = Math.asin(point.y / radius) * (180 / Math.PI)
        const lon = Math.atan2(point.z, point.x) * (180 / Math.PI)
        if (typeof onPreviewPosition === 'function') {
          onPreviewPosition({ x: point.x, y: point.y, z: point.z, lat, lon })
        }
      } else if (typeof onPreviewPosition === 'function') {
        onPreviewPosition(null)
      }
    })

    let isUnmounted = false
    const animate = () => {
      if (isUnmounted) return
      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      isUnmounted = true
      window.removeEventListener('resize', handleResize)
      renderer.domElement.remove()
      controls.dispose()
      renderer.dispose()
    }
  }, [onSelectCoords, onPreviewPosition])

  useEffect(() => {
  const group = markerGroupRef.current
  if (!group) return

  while (group.children.length > 0) group.remove(group.children[0])

  mapObjects.forEach(obj => {
    const radius = getZoneRadius(obj.typeKey)
    const color = getTypeColor ? getTypeColor(obj.typeKey) : '#2196f3'
    const zoneGeometry = new THREE.SphereGeometry(radius, 32, 32)
    const zoneMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.22,
      depthWrite: false
    })
    const zoneMesh = new THREE.Mesh(zoneGeometry, zoneMaterial)
    zoneMesh.position.set(obj.x, obj.y, obj.z)
    group.add(zoneMesh)

    const texture = getSpriteTexture(obj.typeKey, color)
    if (texture) {
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthWrite: false })
      const len = Math.sqrt(obj.x * obj.x + obj.y * obj.y + obj.z * obj.z)
      const shift = 0.07
      const sx = obj.x / len * (1 + shift)
      const sy = obj.y / len * (1 + shift)
      const sz = obj.z / len * (1 + shift)
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.position.set(sx, sy, sz)
      sprite.scale.set(0.14, 0.14, 1)
      group.add(sprite)
    }
  })

  if (previewObject) {
    const radius = getZoneRadius(previewObject.typeKey)
    const color = getTypeColor ? getTypeColor(previewObject.typeKey) : '#8888ff'
    const zoneGeometry = new THREE.SphereGeometry(radius, 32, 32)
    const zoneMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.11,
      depthWrite: false
    })
    const zoneMesh = new THREE.Mesh(zoneGeometry, zoneMaterial)
    zoneMesh.position.set(previewObject.x, previewObject.y, previewObject.z)
    group.add(zoneMesh)

    const texture = getSpriteTexture(previewObject.typeKey, color)
    if (texture) {
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthWrite: false, opacity: 0.45 })
      const len = Math.sqrt(previewObject.x * previewObject.x + previewObject.y * previewObject.y + previewObject.z * previewObject.z)
      const shift = 0.07
      const sx = previewObject.x / len * (1 + shift)
      const sy = previewObject.y / len * (1 + shift)
      const sz = previewObject.z / len * (1 + shift)
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.position.set(sx, sy, sz)
      sprite.scale.set(0.14, 0.14, 1)
      group.add(sprite)
    }
  }

  if (routes && Array.isArray(routes)) {
  for (let idx = 0; idx < routes.length; idx++) {
    const r = routes[idx]
    if (r.points && r.points.length > 1) {
      const points = r.points.map(p => new THREE.Vector3(p.x, p.y, p.z))
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      let lineColor = 0x7777ff
      if (mapObjects.length > 0) {
        const start = points[0]
        let minDist = Infinity
        let objColor = null
        for (const obj of mapObjects) {
          const dist = Math.sqrt(
            Math.pow(obj.x - start.x, 2) +
            Math.pow(obj.y - start.y, 2) +
            Math.pow(obj.z - start.z, 2)
          )
          if (dist < minDist) {
            minDist = dist
            if (getTypeColor) {
              objColor = new THREE.Color(getTypeColor(obj.typeKey)).getHex()
            }
          }
        }
        if (objColor) {
          lineColor = objColor
        }
      }
      let isSelected = false
      if (typeof selectedRouteId === 'number' && dbRoutes && dbRoutes[idx] && dbRoutes[idx].id === selectedRouteId) {
        isSelected = true
      }
      const material = new THREE.LineBasicMaterial({
        color: isSelected ? 0x06b6d4 : lineColor,
        linewidth: isSelected ? 8 : 3,
        transparent: true,
        opacity: isSelected ? 1 : 0.7,
        depthTest: false,
        depthWrite: false,
      })
      const line = new THREE.Line(geometry, material)
      group.add(line)
      const end = points[points.length - 1]
      const prev = points[points.length - 2]
      const dir = new THREE.Vector3().subVectors(end, prev).normalize()
      const arrowLength = 0.13
      const arrowHelper = new THREE.ArrowHelper(dir, end, arrowLength, isSelected ? 0x06b6d4 : lineColor, 0.07, 0.05)
      group.add(arrowHelper)
    }
  }
}

  if (routeLine && routeLine.points && routeLine.points.length > 1) {
  const points = routeLine.points.map(p => new THREE.Vector3(p.x, p.y, p.z))
  let lineColor = 0x22c55e
  if (routeColor) {
    lineColor = new THREE.Color(routeColor).getHex()
  } else if (mapObjects.length > 0) {
    const start = points[0]
    const obj = mapObjects.find(obj =>
      Math.abs(obj.x - start.x) < 1e-6 &&
      Math.abs(obj.y - start.y) < 1e-6 &&
      Math.abs(obj.z - start.z) < 1e-6
    )
    if (obj && getTypeColor) {
      lineColor = new THREE.Color(getTypeColor(obj.typeKey)).getHex()
    }
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({
    color: lineColor,
    linewidth: 3,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    opacity: 1
  })
  const line = new THREE.Line(geometry, material)
  group.add(line)
  const end = points[points.length - 1]
  const prev = points[points.length - 2]
  const dir = new THREE.Vector3().subVectors(end, prev).normalize()
  const arrowLength = 0.13
  const arrowHelper = new THREE.ArrowHelper(dir, end, arrowLength, lineColor, 0.07, 0.05)
  group.add(arrowHelper)
}
  if (typeof animationPoint === 'object' && animationPoint !== null) {
    const geometry = new THREE.SphereGeometry(0.033, 28, 28)
    const material = new THREE.MeshBasicMaterial({
      color: '#facc15',
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      depthTest: false
    })
    const marker = new THREE.Mesh(geometry, material)
    marker.position.set(animationPoint.x, animationPoint.y, animationPoint.z)
    group.add(marker)
  }

}, [mapObjects, getTypeColor, previewObject, routeLine, routes])


  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%', minHeight: 500 }}
    />
  )
}
