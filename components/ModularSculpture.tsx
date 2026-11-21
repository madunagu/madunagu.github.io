'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

type Piece = { direction: THREE.Vector3; rotation: THREE.Quaternion; geometry: THREE.BufferGeometry; seed: number };

const notePulse: number[] = Array.from({ length: 12 }, () => 0);

function makePieces(): Piece[] {
  const phi = (1 + Math.sqrt(5)) / 2;
  const raw: [number, number, number][] = [];
  for (const a of [-1, 1]) for (const b of [-phi, phi]) raw.push([0, a, b], [a, b, 0], [b, 0, a]);
  const directions = raw.map(([x, y, z]) => new THREE.Vector3(x, y, z).normalize());
  return directions.map((direction, index) => {
    // Build each pyramid in local space; the group quaternion aims its local +Z axis
    // along the corresponding icosahedral vertex / dodecahedral face normal.
    const basisX = new THREE.Vector3(1, 0, 0);
    const basisY = new THREE.Vector3(0, 1, 0);
    const radius = 0.48;
    const apex = new THREE.Vector3(0, 0, 0.78);
    const vertices: number[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6 + Math.PI / 6;
      const b = (Math.PI * 2 * (i + 1)) / 6 + Math.PI / 6;
      const p1 = basisX.clone().multiplyScalar(Math.cos(a) * radius).addScaledVector(basisY, Math.sin(a) * radius);
      const p2 = basisX.clone().multiplyScalar(Math.cos(b) * radius).addScaledVector(basisY, Math.sin(b) * radius);
      // Six triangular faces, plus a triangulated hexagonal underside.
      vertices.push(p1.x,p1.y,p1.z, p2.x,p2.y,p2.z, apex.x,apex.y,apex.z);
      vertices.push(0,0,0, p2.x,p2.y,p2.z, p1.x,p1.y,p1.z);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    const orient = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
    return { direction, rotation: orient, geometry, seed: index * 1.73 };
  });
}

function Sculpture({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const pieces = useMemo(makePieces, []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c7c9c7', metalness: 0.88, roughness: 0.22, side: THREE.DoubleSide }), []);
  const lightRef = useRef<THREE.PointLight>(null);
  const starMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const edgeMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: '#f07836', transparent: true, opacity: 0.82 }), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    let activeIndex = -1;
    let activePulse = 0;
    for (let i = 0; i < 12; i++) {
      notePulse[i] = Math.max(0, notePulse[i] - delta * 1.8);
      const starMesh = starMeshRefs.current[i];
      if (starMesh) { starMesh.visible = notePulse[i] > 0.015; starMesh.position.z = 0.78 + notePulse[i] * 1.35; starMesh.scale.setScalar(0.45 + notePulse[i] * 1.8); }
      if (notePulse[i] > activePulse) { activePulse = notePulse[i]; activeIndex = i; }
    }
    group.current.rotation.y += delta * (0.1 + (1 - p) * 0.13);
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.055;
    group.current.children.forEach((child, i) => {
      const piece = pieces[i];
      const explode = THREE.MathUtils.smoothstep(p, 0.08, 0.48);
      const collapse = THREE.MathUtils.smoothstep(p, 0.62, 0.98);
      const radial = piece.direction;
      const assembledPos = radial.clone().multiplyScalar(0.78);
      const explodedPos = radial.clone().multiplyScalar(1.88 + (i % 3) * 0.07);
      const invertedPos = radial.clone().multiplyScalar(0.72);
      const pos = assembledPos.clone().lerp(explodedPos, explode).lerp(invertedPos, collapse);
      child.position.copy(pos);
      const mesh = child as THREE.Group;
      // Rotate around each pyramid's local Z axis, preserving its radial axis.
      const axialSpin = Math.sin(piece.seed) * 0.10 * explode;
      const localAxisSpin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), axialSpin);
      const flip = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * collapse);
      mesh.quaternion.copy(piece.rotation).multiply(flip).multiply(localAxisSpin);
      const scale = 1 + Math.sin(piece.seed + state.clock.elapsedTime) * 0.012;
      mesh.scale.setScalar(scale);
    });
    // One shared point light follows the active note's visible star; the 12 star meshes
    // remain independent, avoiding twelve continuously evaluated point lights.
    const activeStar = activeIndex >= 0 ? starMeshRefs.current[activeIndex] : null;
    if (lightRef.current && activeStar && activePulse > 0.015) {
      activeStar.getWorldPosition(lightRef.current.position);
      lightRef.current.intensity = activePulse * 36;
    } else if (lightRef.current) { lightRef.current.intensity = 0; }
  });

  useEffect(() => {
    const onNote = (event: Event) => {
      const index = (event as CustomEvent<{ index: number }>).detail?.index;
      if (Number.isInteger(index) && index >= 0 && index < 12) notePulse[index] = 1;
    };
    window.addEventListener('portfolio-note', onNote);
    return () => window.removeEventListener('portfolio-note', onNote);
  }, []);

  return <><group ref={group}>{pieces.map((piece, i) => <group key={i}>
    <mesh geometry={piece.geometry} material={material} castShadow receiveShadow/>
    <lineSegments geometry={new THREE.EdgesGeometry(piece.geometry)} material={edgeMaterial}/>
    <mesh ref={(node) => { starMeshRefs.current[i] = node; }} visible={false} position={[0, 0, 0.78]}><sphereGeometry args={[0.035, 10, 10]}/><meshBasicMaterial color="#fff2c7" toneMapped={false}/></mesh>
  </group>)}</group><pointLight ref={lightRef} color="#fff0c4" intensity={0} distance={5.5} decay={2}/></>;
}

export default function ModularSculpture() {
  const progress = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!wrap.current) return;
    const trigger = ScrollTrigger.create({
      trigger: '.hero', start: 'top top', end: '+=1800', pin: true, scrub: 0.8, anticipatePin: 1,
      onUpdate: self => {
        progress.current = self.progress;
        if (labelRef.current) labelRef.current.textContent = self.progress < 0.28 ? 'ASSEMBLED FORM' : self.progress < 0.58 ? 'COMPONENT SEPARATION' : self.progress < 0.82 ? 'INVERSION SEQUENCE' : 'RECONFIGURED FORM';
      }
    });
    return () => trigger.kill();
  }, []);

  return <div className="sculpture-canvas" ref={wrap}>
    <div className="object-orbit orbit-one"/><div className="object-orbit orbit-two"/>
    <Canvas camera={{ position: [0, 0, 5.2], fov: 36 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={1.2}/><directionalLight position={[4, 5, 4]} intensity={3.2}/><pointLight position={[-4, -2, 1]} intensity={18} color="#f07836"/><pointLight position={[1, 3, -3]} intensity={10} color="#dbe8ff"/>
      <Sculpture progress={progress}/>
    </Canvas>
    <div className="object-caption"><span>12 / HEXAGONAL PYRAMIDS</span><span ref={labelRef}>ASSEMBLED FORM</span></div>
  </div>;
}
