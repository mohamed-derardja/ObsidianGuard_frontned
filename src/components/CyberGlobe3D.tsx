import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* Rotating wireframe sphere with scan effect */
const ScanGlobe = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const ringRef3 = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z = t * 0.3;
      ringRef1.current.rotation.x = Math.sin(t * 0.2) * 0.3;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -t * 0.2;
      ringRef2.current.rotation.y = Math.cos(t * 0.15) * 0.4;
    }
    if (ringRef3.current) {
      ringRef3.current.rotation.x = t * 0.25;
      ringRef3.current.rotation.z = Math.sin(t * 0.3) * 0.2;
    }
    // Scan plane sweeps up and down
    if (scanRef.current) {
      scanRef.current.position.y = Math.sin(t * 0.8) * 1.8;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group>
        {/* Core sphere - wireframe globe */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.4, 32, 32]} />
          <meshBasicMaterial
            color="#6366f1"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Inner glowing sphere */}
        <mesh>
          <sphereGeometry args={[1.35, 32, 32]} />
          <MeshDistortMaterial
            color="#4f46e5"
            transparent
            opacity={0.08}
            distort={0.2}
            speed={2}
          />
        </mesh>

        {/* Orbit ring 1 */}
        <mesh ref={ringRef1}>
          <torusGeometry args={[1.8, 0.012, 16, 100]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.4} />
        </mesh>

        {/* Orbit ring 2 */}
        <mesh ref={ringRef2}>
          <torusGeometry args={[2.1, 0.008, 16, 100]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.25} />
        </mesh>

        {/* Orbit ring 3 */}
        <mesh ref={ringRef3}>
          <torusGeometry args={[2.4, 0.006, 16, 100]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.15} />
        </mesh>

        {/* Scan plane */}
        <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 0.02]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.6} />
        </mesh>

        {/* Scan glow plane */}
        <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.5, 0.15]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.08} />
        </mesh>

        {/* Particle dots on surface */}
        <SurfaceParticles />

        {/* Shield icon in center - a simple octahedron */}
        <mesh>
          <octahedronGeometry args={[0.4, 0]} />
          <meshBasicMaterial
            color="#a78bfa"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>
    </Float>
  );
};

/* Small dots scattered on the sphere surface */
const SurfaceParticles = () => {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pts = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 1.45;
      pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3 + 2] = r * Math.cos(phi);
    }
    return pts;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#818cf8"
        size={0.025}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const CyberGlobe3D = () => (
  <div className="w-full h-[420px] md:h-[500px] relative">
    {/* Ambient glow behind */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
    </div>
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#818cf8" />
      <ScanGlobe />
    </Canvas>
  </div>
);

export default CyberGlobe3D;
