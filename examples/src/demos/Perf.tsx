import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Debug, Physics, useSphere, usePlane } from '@react-three/cannon'
import { OrbitControls } from '@react-three/drei'

const speed = 10

function posForTime(time: number) {
  return [
    Math.cos(time * speed) * 2,
    2,
    Math.sin(time * speed) * 2,
  ]
}

function useFastFrame(callback: Function) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const i = setInterval(() => {
      callbackRef.current()
    }, 1)
    return () => clearInterval(i)
  }, [])

}

function PhysicsBall() {
  const { clock } = useThree()
  const size = 0.5
  const [ref, api] = useSphere(() => ({
    type: 'Kinematic', //'Static',
    args: [size],
    mass: 1,
    position: [0, 5, 0],
  }))
  
  useFastFrame(() => {
    const t = clock.getElapsedTime()

    // api.position.set(Math.cos(t) * 3, 2, Math.sin(t) * 3)
    const pos = posForTime(t)
    api.position.set(pos[0], 2, pos[2])
  })

  return (
    <mesh castShadow receiveShadow ref={ref}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color="blue" transparent opacity={0.5} />
    </mesh>
  )
}

function VisualBall() {
  const { clock } = useThree()
  const ref = useRef()

  useFrame(() => {
    const t = clock.getElapsedTime()

    // ref.current.position.set(Math.cos(t) * 3, 1, Math.sin(t) * 3)
    const pos = posForTime(t)
    ref.current.position.set(pos[0], 1, pos[2])
  })

  return (
    <mesh castShadow receiveShadow ref={ref} position={[0, 5, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="red" transparent opacity={0.5} />
    </mesh>
  )
}


function Plane() {
  const [ref] = usePlane(() => ({ type: 'Static', rotation: [-Math.PI / 2, 0, 0] }))
  return (
    <mesh receiveShadow ref={ref}>
      <planeBufferGeometry args={[20, 20]} />
      <shadowMaterial color="#171717" />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas shadows camera={{ position: [-1, 2, 4] }}>
      <OrbitControls />
      <color attach="background" args={['#a6d1f6']} />
      <hemisphereLight />
      <directionalLight position={[5, 10, 5]} castShadow />
      <Physics allowSleep={false}>
        <Debug scale={1.0}>
          <Plane />
          <PhysicsBall />
          <VisualBall />
        </Debug>
      </Physics>
    </Canvas>
  )
}
