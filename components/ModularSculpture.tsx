"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

type Piece = {
  direction: THREE.Vector3;
  rotation: THREE.Quaternion;
  geometry: THREE.BufferGeometry;
  seed: number;
};

const notePulse: number[] = Array.from({ length: 12 }, () => 0);

function makePieces(): Piece[] {
  const phi = (1 + Math.sqrt(5)) / 2;
  const raw: [number, number, number][] = [];
  for (const a of [-1, 1])
    for (const b of [-phi, phi]) raw.push([0, a, b], [a, b, 0], [b, 0, a]);

  const directions = raw.map(([x, y, z]) =>
    new THREE.Vector3(x, y, z).normalize(),
  );

  const rIn = 0.65;
  const halfAngle = Math.acos(1 / Math.sqrt(5)) / 2;
  const apothem = rIn * Math.tan(halfAngle);
  const baseRadius = apothem / Math.cos(Math.PI / 5);

  // Pyramid height equals core inradius so inverted state forms a flush dodecahedron
  const pyramidHeight = rIn;

  const vertices: number[] = [];
  const sides = 5;

  for (let i = 0; i < sides; i++) {
    // Offset by Math.PI / 5 (36°) so +X points to the FLAT EDGE MIDPOINT,
    // which faces directly toward the neighboring pyramid's center.
    const a = (Math.PI * 2 * i) / sides + Math.PI / 5;
    const b = (Math.PI * 2 * (i + 1)) / sides + Math.PI / 5;

    const p1x = Math.cos(a) * baseRadius;
    const p1y = Math.sin(a) * baseRadius;
    const p2x = Math.cos(b) * baseRadius;
    const p2y = Math.sin(b) * baseRadius;

    // 5 outer triangular faces
    vertices.push(p1x, p1y, 0, p2x, p2y, 0, 0, 0, pyramidHeight);
    // 5 pentagonal base triangles
    vertices.push(0, 0, 0, p2x, p2y, 0, p1x, p1y, 0);
  }

  const sharedGeometry = new THREE.BufferGeometry();
  sharedGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  sharedGeometry.computeVertexNormals();

  return directions.map((direction, index) => {
    // Find one of the 5 adjacent faces (dot product = 1/sqrt(5) ≈ 0.4472)
    const neighbor = directions.find(
      (d) => d !== direction && direction.dot(d) > 0.4,
    )!;

    const zAxis = direction.clone();
    const xAxis = neighbor
      .clone()
      .addScaledVector(zAxis, -neighbor.dot(zAxis))
      .normalize();
    const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();

    const basisMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
    const orient = new THREE.Quaternion().setFromRotationMatrix(basisMatrix);

    return {
      direction,
      rotation: orient,
      geometry: sharedGeometry,
      seed: index * 1.73,
    };
  });
}

function Sculpture({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const pieces = useMemo(makePieces, []);
  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(pieces[0].geometry),
    [pieces],
  );

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c7c9c7",
        metalness: 0.88,
        roughness: 0.22,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const lightRef = useRef<THREE.PointLight>(null);
  const starMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#f07836",
        transparent: true,
        opacity: 0.82,
      }),
    [],
  );

  useFrame((state, delta) => {
    const rIn = 0.65;

    if (!group.current) return;
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    let activeIndex = -1;
    let activePulse = 0;
    for (let i = 0; i < 12; i++) {
      notePulse[i] = Math.max(0, notePulse[i] - delta * 1.8);
      const starMesh = starMeshRefs.current[i];
      if (starMesh) {
        starMesh.visible = notePulse[i] > 0.015;
        starMesh.position.z = 1.262 + notePulse[i] * 1.35;

        starMesh.position.z = rIn + notePulse[i] * 1.35;
        starMesh.scale.setScalar(0.45 + notePulse[i] * 1.8);
      }
      if (notePulse[i] > activePulse) {
        activePulse = notePulse[i];
        activeIndex = i;
      }
    }
    group.current.rotation.y += delta * (0.1 + (1 - p) * 0.13);
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.055;
    group.current.children.forEach((child, i) => {
      const piece = pieces[i];
      const explode = THREE.MathUtils.smoothstep(p, 0.08, 0.48);
      const collapse = THREE.MathUtils.smoothstep(p, 0.62, 0.98);
      const radial = piece.direction;

      // Inside useFrame:

      // Inside group.current.children.forEach:
      const assembledPos = radial.clone().multiplyScalar(rIn);
      const explodedPos = radial.clone().multiplyScalar(1.88 + (i % 3) * 0.07);
      const invertedPos = radial.clone().multiplyScalar(rIn); // Flush closed dodecahedron

      const pos = assembledPos
        .clone()
        .lerp(explodedPos, explode)
        .lerp(invertedPos, collapse);
      child.position.copy(pos);
      const mesh = child as THREE.Group;
      // Rotate around each pyramid's local Z axis, preserving its radial axis.
      const axialSpin = Math.sin(piece.seed) * 0.1 * explode;
      const localAxisSpin = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 0, 1),
        axialSpin,
      );
      const flip = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        Math.PI * collapse,
      );
      mesh.quaternion
        .copy(piece.rotation)
        .multiply(flip)
        .multiply(localAxisSpin);
      const scale = 1 + Math.sin(piece.seed + state.clock.elapsedTime) * 0.012;
      mesh.scale.setScalar(scale);
    });
    // One shared point light follows the active note's visible star; the 12 star meshes
    // remain independent, avoiding twelve continuously evaluated point lights.
    const activeStar =
      activeIndex >= 0 ? starMeshRefs.current[activeIndex] : null;
    if (lightRef.current && activeStar && activePulse > 0.015) {
      activeStar.getWorldPosition(lightRef.current.position);
      lightRef.current.intensity = activePulse * 36;
    } else if (lightRef.current) {
      lightRef.current.intensity = 0;
    }
  });

  useEffect(() => {
    const onNote = (event: Event) => {
      const index = (event as CustomEvent<{ index: number }>).detail?.index;
      if (Number.isInteger(index) && index >= 0 && index < 12)
        notePulse[index] = 1;
    };
    window.addEventListener("portfolio-note", onNote);
    return () => window.removeEventListener("portfolio-note", onNote);
  }, []);

  return (
    <>
      <group ref={group}>
        {pieces.map((piece, i) => (
          <group key={i}>
            <mesh
              geometry={piece.geometry}
              material={material}
              castShadow
              receiveShadow
            />
            <lineSegments geometry={edgesGeometry} material={edgeMaterial} />
            <mesh
              ref={(node) => {
                starMeshRefs.current[i] = node;
              }}
              visible={false}
              position={[0, 0, 0.78]}
            >
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshBasicMaterial color="#fff2c7" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
      <pointLight
        ref={lightRef}
        color="#fff0c4"
        intensity={0}
        distance={5.5}
        decay={2}
      />
    </>
  );
}

export default function ModularSculpture() {
  const progress = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!wrap.current) return;
    const trigger = ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "+=1800",
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      onUpdate: (self) => {
        progress.current = self.progress;
        if (labelRef.current)
          labelRef.current.textContent =
            self.progress < 0.28
              ? "ASSEMBLED FORM"
              : self.progress < 0.58
                ? "COMPONENT SEPARATION"
                : self.progress < 0.82
                  ? "INVERSION SEQUENCE"
                  : "RECONFIGURED FORM";
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div className="sculpture-canvas" ref={wrap}>
      <div className="object-orbit orbit-one" />
      <div className="object-orbit orbit-two" />
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 36 }}
        dpr={[1, 1.7]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 5, 4]} intensity={3.2} />
        <pointLight position={[-4, -2, 1]} intensity={18} color="#f07836" />
        <pointLight position={[1, 3, -3]} intensity={10} color="#dbe8ff" />
        <Sculpture progress={progress} />
      </Canvas>
      <div className="object-caption">
        <span>12 / HEXAGONAL PYRAMIDS</span>
        <span ref={labelRef}>ASSEMBLED FORM</span>
      </div>
    </div>
  );
}
