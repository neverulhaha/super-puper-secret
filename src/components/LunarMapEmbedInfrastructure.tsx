'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const getIconSvg = (typeKey: string, color: string) => {
  if (typeKey === 'module') {
    return `
      <svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    `;
  }
  if (typeKey === 'launch') {
    return `
      <svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    `;
  }
  if (typeKey === 'lab') {
    return `
      <svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    `;
  }
  if (typeKey === 'power') {
    return `
      <svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    `;
  }
  if (typeKey === 'storage') {
    return `
      <svg width="96" height="96" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
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
