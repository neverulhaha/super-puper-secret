'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Props {
  onSelectCoords?: (lat: number, lon: number) => void;
}

const MOON_TEXTURE_URL = '/moon_8k_color_brim16.jpg';

export default function LunarMapEmbed({ onSelectCoords }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.offsetWidth / containerRef.current.offsetHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    containerRef.current.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    loader.load(MOON_TEXTURE_URL, (texture) => {
      const geometry = new THREE.SphereGeometry(1, 64, 64);
      const material = new THREE.MeshPhongMaterial({ map: texture });
      const moon = new THREE.Mesh(geometry, material);
      scene.add(moon);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 3, 5);
      scene.add(light);

      const controls = new OrbitControls(camera, renderer.domElement);

      renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(moon);
        if (intersects.length > 0) {
          const point = intersects[0].point;
          const radius = Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2);
          const lat = Math.asin(point.y / radius) * (180 / Math.PI);
          const lon = Math.atan2(point.z, point.x) * (180 / Math.PI);
          if (onSelectCoords) {
            onSelectCoords(Number(lat.toFixed(3)), Number(lon.toFixed(3)));
          }
        }
      });

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        renderer.dispose();
        controls.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      };
    });

    return () => {
      while (containerRef.current?.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    };
  }, [onSelectCoords]);

  return <div ref={containerRef} style={{ width: '100%', height: '500px', minHeight: 300 }} />;
}
