import {createRoot} from 'react-dom/client'
import React, {useRef, useState} from 'react'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {OrbitControls, PerspectiveCamera} from '@react-three/drei'

import './index.css';

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
        3/4 * TileRadius * props.position[0] * 2,
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
            <meshStandardMaterial color={color}/>
        </mesh>
    )
}

function Grid() {
    const tiles = [];
    for (let x = -10; x < 10; x++) {
        for (let y = -10; y < 10; y++) {
            tiles.push(<Tile position={[x, y, 0] as any}/>);
        }
    }

    return (
        <group>
            {tiles}
        </group>
    )
}

// const cameraRotation = [0, 0, MathUtils.deg2Rad()] as any;
// Rotate camera to look from top down
const cameraRotation = [0, 0, 0] as any;
const cameraPosition = [0, 0, 17] as any;

function App() {
    useThree(({camera}) => {
        camera.lookAt(0, 0, 0);
    });


    return <>
        {/*<OrbitControls />*/}
        <PerspectiveCamera makeDefault rotation={cameraRotation} position={cameraPosition}/>
        <ambientLight intensity={Math.PI / 2}/>
        <directionalLight position={[0, 10, 10]} color={'white'} intensity={Math.PI}/>
        <Grid/>
    </>;
}


createRoot(document.getElementById('root')!).render(
    <Canvas>
        <App/>
    </Canvas>,
)
