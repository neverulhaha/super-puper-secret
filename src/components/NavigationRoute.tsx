'use client'
import React from 'react'
import dynamic from 'next/dynamic'

export type ArcPoint = { x: number; y: number; z: number }
export type RouteLine = { points: ArcPoint[] }

type MapObject = {
  id: number
  typeKey: string
  lat: number
  lon: number
  x: number
  y: number
  z: number
}

type Props = {
  mapObjects: MapObject[]
  getTypeColor: (typeKey: string) => string
  routeLine?: RouteLine
  routeColor?: string
  routes?: RouteLine[]
  previewObject?: any
  dbRoutes?: any[]
  selectedRouteId?: number | null
  animationPoint?: ArcPoint    
}

const LunarMapEmbedInfrastructure = dynamic(
  () => import('@/components/LunarMapEmbedInfrastructure'),
  { ssr: false }
)

export default function NavigationRoute({
  mapObjects,
  getTypeColor,
  routeLine,
  routeColor,
  routes,
  previewObject,
  dbRoutes,
  selectedRouteId,
  animationPoint
}: Props) {
  return (
    <LunarMapEmbedInfrastructure
      mapObjects={mapObjects}
      getTypeColor={getTypeColor}
      routeLine={routeLine}
      routeColor={routeColor}
      routes={routes}
      previewObject={previewObject}
      dbRoutes={dbRoutes}
      selectedRouteId={selectedRouteId}
      animationPoint={animationPoint}
    />
  )
}
