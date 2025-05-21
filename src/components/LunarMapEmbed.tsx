'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Props {
  onSelectCoords?: (lat: number, lon: number) => void;
}

const MOON_TEXTURE_URL = '/moon_8k_color_brim16.jpg';

export default function LunarMapEmbed({ onSelectCoords }: Props) {
  console.log('LunarMapEmbed mounted');
  const containerRef = useRef<HTMLDivElement>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const moonRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;
    const initialCameraZ = 3;
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
          onSelectCoords(Number(lat.toFixed(3)), Number(lon.toFixed(3)));
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

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%', minHeight: 300 }}
    />
  );
}

