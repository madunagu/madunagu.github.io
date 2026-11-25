
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
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

const PIECE_COUNT = 12;
const R_IN = 0.65;
const notePulse: number[] = Array.from(
  { length: PIECE_COUNT },
  () => 0
);

function makePieces(): Piece[] {
  const phi = (1 + Math.sqrt(5)) / 2;

  // Preserve this order: it determines the matching face orientations.
  const raw: [number, number, number][] = [];

  for (const a of [-1, 1]) {
    for (const b of [-phi, phi]) {
      raw.push([0, a, b], [a, b, 0], [b, 0, a]);
    }
  }

  const directions = raw.map(([x, y, z]) =>
    new THREE.Vector3(x, y, z).normalize()
  );

  /**
   * Dodecahedron face dimensions.
   *
   * R_IN is the distance from the dodecahedron centre to a face.
   * The face pentagons must have this exact circumradius.
   */
  const halfAngle = Math.acos(1 / Math.sqrt(5)) / 2;
  const apothem = R_IN * Math.tan(halfAngle);
  const baseRadius = apothem / Math.cos(Math.PI / 5);

  const pyramidHeight = R_IN;
  const sides = 5;
  const vertices: number[] = [];

  // Build the pentagonal pyramid in local coordinates.
  // Base: z = 0
  // Apex: local +Z, z = R_IN
  for (let i = 0; i < sides; i++) {
    // +X points towards a flat edge midpoint.
    const a = (Math.PI * 2 * i) / sides + Math.PI / 5;
    const b = (Math.PI * 2 * (i + 1)) / sides + Math.PI / 5;

    const p1x = Math.cos(a) * baseRadius;
    const p1y = Math.sin(a) * baseRadius;

    const p2x = Math.cos(b) * baseRadius;
    const p2y = Math.sin(b) * baseRadius;

    // Outer triangular face.
    vertices.push(
      p1x, p1y, 0,
      p2x, p2y, 0,
      0, 0, pyramidHeight
    );

    // Triangulated pentagonal base.
    vertices.push(
      0, 0, 0,
      p2x, p2y, 0,
      p1x, p1y, 0
    );
  }

  const sharedGeometry = new THREE.BufferGeometry();

  sharedGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  sharedGeometry.computeVertexNormals();

  return directions.map((direction, index) => {
    /**
     * Find an adjacent face normal.
     *
     * Adjacent dodecahedron face normals have a dot product
     * of 1 / sqrt(5).
     *
     * The projection of this neighbor onto the face plane
     * determines the local +X direction, pointing towards
     * the shared edge midpoint.
     */
    const neighbor = directions.find(
      (candidate, candidateIndex) =>
        candidateIndex !== index &&
        direction.dot(candidate) > 0.4
    );

    if (!neighbor) {
      throw new Error(`No adjacent face found for piece ${index}`);
    }

    const zAxis = direction.clone();

    const xAxis = neighbor
      .clone()
      .addScaledVector(zAxis, -neighbor.dot(zAxis))
      .normalize();

    const yAxis = new THREE.Vector3()
      .crossVectors(zAxis, xAxis)
      .normalize();

    const basisMatrix = new THREE.Matrix4().makeBasis(
      xAxis,
      yAxis,
      zAxis
    );

    const rotation = new THREE.Quaternion()
      .setFromRotationMatrix(basisMatrix);

    return {
      direction,
      rotation,
      geometry: sharedGeometry,
      seed: index * 1.73,
    };
  });
}

function Sculpture({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);

  const pieces = useMemo(() => makePieces(), []);

  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(pieces[0].geometry),
    [pieces]
  );

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c7c9c7",
        metalness: 0.88,
        roughness: 0.22,
        side: THREE.DoubleSide,
      }),
    []
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#f07836",
        transparent: true,
        opacity: 0.82,
      }),
    []
  );

  const lightRef = useRef<THREE.PointLight>(null);
  const starMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Reusable animation objects.
  const assembledPos = useMemo(() => new THREE.Vector3(), []);
  const explodedPos = useMemo(() => new THREE.Vector3(), []);
  const invertedPos = useMemo(() => new THREE.Vector3(), []);
  const currentPos = useMemo(() => new THREE.Vector3(), []);

  const flipQuaternion = useMemo(
    () => new THREE.Quaternion(),
    []
  );

  const spinQuaternion = useMemo(
    () => new THREE.Quaternion(),
    []
  );

  const finalQuaternion = useMemo(
    () => new THREE.Quaternion(),
    []
  );

  const localXAxis = useMemo(
    () => new THREE.Vector3(1, 0, 0),
    []
  );

  const localZAxis = useMemo(
    () => new THREE.Vector3(0, 0, 1),
    []
  );

  useEffect(() => {
    const onNote = (event: Event) => {
      const index = (
        event as CustomEvent<{ index: number }>
      ).detail?.index;

      if (
        Number.isInteger(index) &&
        index >= 0 &&
        index < PIECE_COUNT
      ) {
        notePulse[index] = 1;
      }
    };

    window.addEventListener("portfolio-note", onNote);

    return () => {
      window.removeEventListener("portfolio-note", onNote);
    };
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;

    const p = THREE.MathUtils.clamp(progress.current, 0, 1);

    const explode = THREE.MathUtils.smoothstep(
      p,
      0.08,
      0.48
    );

    const collapse = THREE.MathUtils.smoothstep(
      p,
      0.62,
      0.98
    );

    // Both must reach zero when the solid form is complete.
    const returnToAlignment = 1 - collapse;

    let activeIndex = -1;
    let activePulse = 0;

    // Update note pulses and their corresponding stars.
    for (let i = 0; i < PIECE_COUNT; i++) {
      notePulse[i] = Math.max(
        0,
        notePulse[i] - delta * 1.8
      );

      const star = starMeshRefs.current[i];

      if (star) {
        star.visible = notePulse[i] > 0.015;

        star.position.z =
          R_IN + notePulse[i] * 1.35;

        star.scale.setScalar(
          0.45 + notePulse[i] * 1.8
        );
      }

      if (notePulse[i] > activePulse) {
        activePulse = notePulse[i];
        activeIndex = i;
      }
    }

    // Overall sculpture movement.
    group.current.rotation.y +=
      delta * (0.1 + (1 - p) * 0.13);

    group.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.22) * 0.055;

    pieces.forEach((piece, index) => {
      const child = group.current!.children[index] as THREE.Group;
      const radial = piece.direction;

      // Assembled: face bases sit at the dodecahedron's face centres.
      assembledPos
        .copy(radial)
        .multiplyScalar(R_IN);

      // Exploded: move each component outwards.
      explodedPos
        .copy(radial)
        .multiplyScalar(1.88 + (index % 3) * 0.07);

      // Solid inverted state: bases remain on the same face planes.
      invertedPos
        .copy(radial)
        .multiplyScalar(R_IN);

      currentPos
        .copy(assembledPos)
        .lerp(explodedPos, explode)
        .lerp(invertedPos, collapse);

      child.position.copy(currentPos);

      /**
       * INVERSION
       *
       * Rotate around local X by 180 degrees.
       * The local X axis points towards a pentagon edge midpoint.
       * This preserves the pentagon's vertex set while turning
       * the pyramid apex inward.
       */
      flipQuaternion.setFromAxisAngle(
        localXAxis,
        Math.PI * collapse
      );

      /**
       * BUG FIX 1:
       *
       * Previously axialSpin was multiplied by explode only.
       * Since explode remains 1 after separation, every piece
       * retained a different axial rotation in the final solid.
       *
       * Fade the spin out as collapse completes.
       */
      const axialSpin =
        Math.sin(piece.seed) *
        0.1 *
        explode *
        returnToAlignment;

      spinQuaternion.setFromAxisAngle(
        localZAxis,
        axialSpin
      );

      finalQuaternion
        .copy(piece.rotation)
        .multiply(flipQuaternion)
        .multiply(spinQuaternion);

      child.quaternion.copy(finalQuaternion);

      /**
       * BUG FIX 2:
       *
       * Previously scale oscillated permanently by 0.012.
       * That caused small gaps and overlaps between faces.
       *
       * Fade the scale variation to zero during collapse.
       */
      const scaleWobble =
        Math.sin(
          piece.seed + state.clock.elapsedTime
        ) *
        0.012 *
        returnToAlignment;

      child.scale.setScalar(1 + scaleWobble);
    });

    // Shared light follows the most active note.
    const activeStar =
      activeIndex >= 0
        ? starMeshRefs.current[activeIndex]
        : null;

    if (lightRef.current && activeStar && activePulse > 0.015) {
      activeStar.getWorldPosition(
        lightRef.current.position
      );

      lightRef.current.intensity = activePulse * 36;
    } else if (lightRef.current) {
      lightRef.current.intensity = 0;
    }
  });

  return (
    <>
      <group ref={group}>
        {pieces.map((piece, index) => (
          <group key={index}>
            <mesh
              geometry={piece.geometry}
              material={material}
              castShadow
              receiveShadow
            />

            <lineSegments
              geometry={edgesGeometry}
              material={edgeMaterial}
            />

            <mesh
              ref={(node) => {
                starMeshRefs.current[index] = node;
              }}
              visible={false}
              position={[0, 0, R_IN]}
            >
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshBasicMaterial
                color="#fff2c7"
                toneMapped={false}
              />
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

        if (labelRef.current) {
          labelRef.current.textContent =
            self.progress < 0.28
              ? "ASSEMBLED FORM"
              : self.progress < 0.58
                ? "COMPONENT SEPARATION"
                : self.progress < 0.82
                  ? "INVERSION SEQUENCE"
                  : "RECONFIGURED FORM";
        }
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div className="sculpture-canvas" ref={wrap}>
      <div className="object-orbit orbit-one" />
      <div className="object-orbit orbit-two" />

      <Canvas
        camera={{
          position: [0, 0, 5.2],
          fov: 36,
        }}
        dpr={[1, 1.7]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <ambientLight intensity={1.2} />

        <directionalLight
          position={[4, 5, 4]}
          intensity={3.2}
        />

        <pointLight
          position={[-4, -2, 1]}
          intensity={18}
          color="#f07836"
        />

        <pointLight
          position={[1, 3, -3]}
          intensity={10}
          color="#dbe8ff"
        />

        <Sculpture progress={progress} />
      </Canvas>

      <div className="object-caption">
        <span>12 / HEXAGONAL PYRAMIDS</span>
        <span ref={labelRef}>ASSEMBLED FORM</span>
      </div>
    </div>
  );
}
