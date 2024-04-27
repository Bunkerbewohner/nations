import {useMemo, useRef} from "react";
import {extend, useFrame, useLoader, useThree} from "@react-three/fiber";
import * as THREE from "three";
import { Water } from 'three-stdlib'
import waterTexture from "../assets/waternormals.jpeg";

extend({ Water });

export function Ocean() {
    const ref = useRef()
    const gl = useThree((state) => state.gl)
    const waterNormals = useLoader(THREE.TextureLoader, waterTexture)
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
    const geom = useMemo(() => new THREE.PlaneGeometry(1024, 1024), [])
    const config = useMemo(
        () => ({
            textureWidth: 512,
            textureHeight: 512,
            waterNormals,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: false,
            format: (gl as any).encoding
        }),
        [waterNormals]
    )
    useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta * 0.1))
    return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} scale={0.1} depthWrite={false} depthTest={false} />
}
