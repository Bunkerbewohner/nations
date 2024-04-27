import {createRoot} from 'react-dom/client'
import React, {Suspense, useRef, useState} from 'react'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {Environment, FlyControls, OrbitControls, PerspectiveCamera, ScrollControls, Sky} from '@react-three/drei'
import environmentMap from './assets/example-terrain/rooitou_park_4k.hdr';

import './index.css';
import {Terrain} from "./map/Terrain";
import {Ocean} from "./map/Ocean";

const TileRadius = 1;

interface TileProps {
    position: [number, number];
}

function Tile(props: TileProps) {
    // This reference will give us direct access to the mesh
    const meshRef = useRef<any>()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    const color = active
        ? (hovered ? '#4fda27' : '#3fba1c')
        : (hovered ? '#a2eaac' : '#fff8e1');

    const position = [
        3 / 4 * TileRadius * props.position[0] * 2,
        Math.sqrt(3) * TileRadius * props.position[1] + (props.position[0] % 2) * Math.sqrt(3) / 2 * TileRadius,
        0
    ]

    return (
        <mesh
            position={position as any}
            ref={meshRef}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <circleGeometry args={[TileRadius * 0.99, 6]}/>
            <meshStandardMaterial color={color} wireframe={false}
                                  opacity={0.2} transparent={true} depthWrite={false} depthTest={false}/>
        </mesh>
    )
}

function Grid() {
    const tiles = [];
    for (let x = -10; x < 10; x++) {
        for (let y = -10; y < 10; y++) {
            tiles.push(<Tile key={`tile-${x}-${y}`} position={[x, y, 0] as any}/>);
        }
    }

    return (
        <group position={[0, 0, 1]}>
            {tiles}
        </group>
    )
}

// const cameraRotation = [0, 0, MathUtils.deg2Rad()] as any;
// Rotate camera to look from top down
const cameraRotation = [0, 0, 0] as any;
const cameraPosition = [0, 17, 0] as any;

function App() {
    useThree(({camera}) => {
        camera.lookAt(0, 0, 0);
    });


    return <>
        <Environment files={environmentMap} background={false}/>
        <OrbitControls/>
        <PerspectiveCamera makeDefault rotation={cameraRotation} position={cameraPosition}/>
        <ambientLight intensity={0.15}/>
        {/*<directionalLight position={[0, 10, 10]} color={'#b7b2af'} intensity={1.3}/>*/}
        <Terrain/>
        <Ocean/>
        <Sky scale={1000} sunPosition={[500, 150, -1000]} turbidity={0.1} />
        {/*<Grid/>*/}
    </>;
}


createRoot(document.getElementById('root')!).render(
    <Suspense fallback={<div>Wait</div>}>
        <Canvas frameloop={"always"}>
            <App/>
        </Canvas>
    </Suspense>,
)
