'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  HomeIcon,
  RocketLaunchIcon,
  BeakerIcon,
  BoltIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

const getIconSvg = (typeKey: string, color: string) => {
  if (typeKey === 'module') {
    return `
      <svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3"/>
      </svg>
    `;
  }
  if (typeKey === 'launch') {
    return `
      <svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M8.25 18.25l1.768-.884a1.823 1.823 0 01.774-.183l2.416.006a1.82 1.82 0 01.776.183l1.766.884M15 21l.337-2.022a1.815 1.815 0 00-.09-.938l-.49-1.274A1.818 1.818 0 0013 15h-2a1.818 1.818 0 00-1.757 1.766l-.49 1.274a1.814 1.814 0 00-.09.938L9 21M5 11c0-4.418 3.134-8 7-8s7 3.582 7 8v0a7 7 0 01-14 0v0z"/>
      </svg>
    `;
  }
  if (typeKey === 'lab') {
    return `
      <svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M7 10V6a5 5 0 0110 0v4m2 0a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2"/>
      </svg>
    `;
  }
  if (typeKey === 'power') {
    return `
      <svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    `;
  }
  if (typeKey === 'storage') {
    return `
      <svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
        <rect width="18" height="12" x="3" y="8" rx="2"/>
        <path stroke-linecap="round" stroke-linejoin="round" d="M16 8V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    `;
  }
  return `
    <svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" />
    </svg>
  `;
};

function svgToDataUrl(svg: string) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

interface MapObject {
  id: number;
  typeKey: string;
  lat: number;
  lon: number;
  x: number;
  y: number;
  z: number;
  color?: string;
}

interface Props {
  onSelectCoords?: (lat: number, lon: number, point: { x: number, y: number, z: number }) => void;
  mapObjects?: MapObject[];
  getTypeColor?: (typeKey: string) => string;
}

const MOON_TEXTURE_URL = '/moon_8k_color_brim16.jpg';

export default function LunarMapEmbedInfrastructure({
  onSelectCoords,
  mapObjects = [],
  getTypeColor
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const moonRef = useRef<THREE.Mesh | null>(null);
  const markerGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 3;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const starTexture = new THREE.TextureLoader().load('/stars.jpg');
    const starGeometry = new THREE.SphereGeometry(100, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
      map: starTexture,
      side: THREE.BackSide
    });
    const starSphere = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starSphere);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.3);
    sunLight.position.set(5, 3, 10);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const earthshine = new THREE.DirectionalLight(0x4477aa, 0.09);
    earthshine.position.set(-7, -2, -9);
    scene.add(earthshine);

    const loader = new THREE.TextureLoader();
    loader.load(MOON_TEXTURE_URL, (texture) => {
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      const material = new THREE.MeshPhongMaterial({ map: texture });
      const moon = new THREE.Mesh(geometry, material);
      scene.add(moon);
      moonRef.current = moon;
    });

    const markerGroup = new THREE.Group();
    scene.add(markerGroup);
    markerGroupRef.current = markerGroup;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.2;
    controls.maxDistance = 3;
    controlsRef.current = controls;

    const handleClick = (event: MouseEvent) => {
      if (!moonRef.current || !cameraRef.current || !rendererRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObject(moonRef.current);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        const radius = Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2);
        const lat = Math.asin(point.y / radius) * (180 / Math.PI);
        const lon = Math.atan2(point.z, point.x) * (180 / Math.PI);
        if (onSelectCoords) {
          const offset = 1.08;
          onSelectCoords(
            Number(lat.toFixed(3)),
            Number(lon.toFixed(3)),
            {
              x: point.x * offset / radius,
              y: point.y * offset / radius,
              z: point.z * offset / radius
            }
          );
        }
      }
    };
    renderer.domElement.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    let isUnmounted = false;
    const animate = () => {
      if (isUnmounted) return;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      isUnmounted = true;
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      controls.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!markerGroupRef.current) return;
    const group = markerGroupRef.current;
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }
    mapObjects.forEach(obj => {
      let radius = 0.14;
      if (obj.typeKey === 'module') radius = 0.15;
      if (obj.typeKey === 'launch') radius = 0.25;
      if (obj.typeKey === 'lab') radius = 0.18;
      if (obj.typeKey === 'power') radius = 0.22;
      if (obj.typeKey === 'storage') radius = 0.14;
      const color = getTypeColor ? getTypeColor(obj.typeKey) : '#2196f3';

      const zoneGeometry = new THREE.SphereGeometry(radius, 32, 32);
      const zoneMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.22,
        depthWrite: false
      });
      const zoneMesh = new THREE.Mesh(zoneGeometry, zoneMaterial);
      zoneMesh.position.set(obj.x, obj.y, obj.z);
      group.add(zoneMesh);

      const svg = getIconSvg(obj.typeKey, color);
      const dataUrl = svgToDataUrl(svg);
      const map = new THREE.TextureLoader().load(dataUrl);
      const spriteMaterial = new THREE.SpriteMaterial({ map: map, depthWrite: false });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(obj.x, obj.y, obj.z);
      sprite.scale.set(0.18, 0.18, 1);
      group.add(sprite);
    });
  }, [mapObjects, getTypeColor]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%', minHeight: 300 }}
    />
  );
}
