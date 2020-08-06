import React from 'react';
import { Canvas, useFrame, useThree} from 'react-three-fiber';
import {Physics, useSphere, useBox, usePlane}from 'use-cannon'

import './App.css';


function Ball() {

const [ref, api] =  useSphere(() => ({ args: 0.5, mass: 1}));
const { viewport } = useThree();

usePlane(() => ({
  position: [0, -viewport.height, 0],
  rotation: [ -Math.PI / 2, 0, 0],
  onCollide: () => {
    api.position.set(0, 0, 0);
    api.velocity.set(0, 10, 0);
  }
}))

  return (
    <mesh ref={ref} >
      <sphereBufferGeometry attach="geometry" args={[0.5, 32, 32]}/>
      <meshStandardMaterial attach="material" color="hotpink"/>
    </mesh>
  )
}

function Paddle({colour= 'lightblue' , args=[2, 0.5, 1]}) {
  // no mass because we need to control it with the mouse

  const [ ref, api ] = useBox(() => ({ args }));
  // You need to multiple state.mouse.x by the width the movement is
  // normalised see need the screen width
  useFrame((state) => {
    api.position.set(state.mouse.x * state.viewport.width / 2, state.mouse.y * state.viewport.height / 2, 0);
    api.rotation.set(0, 0, state.mouse.x * Math.PI / 5);
  })

  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" args={args} />
      <meshStandardMaterial attach="material" color= {colour}/>
    </mesh>
  )
}

function Enemy ({ args= [2, 0.5, 1], colour, ...props }) {

  const [ ref, api ] = useBox(() => ({ args, ...props }));

  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry"  args={args} />
      <meshStandardMaterial attach="material"  color={colour}/>
    </mesh>
  )
}

function App() {
  return (
  <Canvas camera={{ position: [0, 5, 12], fov: 50}}>
    <ambientLight intensity={0.3}/>
    <pointLight position={[10, 10, 5]} />
    <pointLight position={[-10, -10, -5]}/>
    <Physics
      gravity={[0, -30, 0]}
      defaultContactMaterial={{ restitution: 1.1 }}
     >
      <Ball/>
      <Paddle/>
      <Enemy colour="orangered" position={[-2, 1, 0]}/>
      <Enemy colour="yellow" position={[3, 2, 0]}/>
    </Physics>
  </Canvas>
  );
}

export default App;
