import heightmapFile from "../assets/example-terrain/heightmap.png";
import normalmapFile from "../assets/example-terrain/normalmap.png";
import {useLoader} from "@react-three/fiber";
import React from "react";
import {MartiniGeometry, TerrainMaterial} from "three-landscape";
import {TextureLoader, Vector4} from "three";
import {Surface} from "three-landscape/dist/three/TerrainMaterial";
import grassTexture from "../assets/example-terrain/Grass_02/ground_Grass1_col.jpg";
import grassNormalsTexture from "../assets/example-terrain/Grass_02/ground_Grass1_norm.jpg";
import mudTexture from "../assets/example-terrain/Mud_03/Ground_WetBumpyMud_col.jpg";
import mudNormalsTexture from "../assets/example-terrain/Mud_03/Ground_WetBumpyMud_norm.jpg";
import cliffTexture from "../assets/example-terrain/Cliffs_02/Rock_DarkCrackyCliffs_col.jpg";
import cliffNormalsTexture from "../assets/example-terrain/Cliffs_02/Rock_DarkCrackyCliffs_norm.jpg";
import rockTexture from "../assets/example-terrain/Rock_04/Rock_sobermanRockWall_col.jpg";
import rockNormalsTexture from "../assets/example-terrain/Rock_04/Rock_sobermanRockWall_norm.jpg";
import grassDisplacementTexture from "../assets/example-terrain/Grass_02/ground_Grass1_dsp.png";
import mudDisplacementTexture from "../assets/example-terrain/Mud_03/Ground_WetBumpyMud_dsp.png";
import cliffDisplacementTexture from "../assets/example-terrain/Cliffs_02/Rock_DarkCrackyCliffs_dsp.png";
import rockDisplacementTexture from "../assets/example-terrain/Rock_04/Rock_sobermanRockWall_dsp.png";
import splatMapTexture1 from "../assets/example-terrain/splatmap_00@0.5.png";
import splatMapTexture2 from "../assets/example-terrain/splatmap_01.png";
import ambientOcclusionTexture from "../assets/example-terrain/aomap.png";
import macroTexture from "../assets/example-terrain/T_MacroVariation_sm.png";

function useSurfaces() {
    const [
        grassDiffuse, grassNormals, grassDisplacement,
        mudDiffuse, mudNormals, mudDisplacement,
        cliffDiffuse, cliffNormals, cliffDisplacement,
        rockDiffuse, rockNormals, rockDisplacement
    ] = useLoader(TextureLoader, [
        grassTexture,
        grassNormalsTexture,
        grassDisplacementTexture,
        mudTexture,
        mudNormalsTexture,
        mudDisplacementTexture,
        cliffTexture,
        cliffNormalsTexture,
        cliffDisplacementTexture,
        rockTexture,
        rockNormalsTexture,
        rockDisplacementTexture,
    ]);

    const gridless = false;
    const triplanar = false;

    const grass2: Surface = {
        diffuse: grassDiffuse,
        normal: grassNormals,
        normalStrength: 0.3,
        repeat: 300,
        gridless: gridless,
        aperiodic: gridless,
        saturation: 0.55,
        tint: new Vector4(0.7, 0.8, 0.7, 1),
        displacement: grassDisplacement,
    };

    const grass1: Surface = {
        diffuse: grassDiffuse,
        normal: grassNormals,
        normalStrength: 0.3,
        repeat: 300,
        // saturation: 0.5,
        gridless: gridless,
        aperiodic: gridless,
        tint: new Vector4(0.8, 0.9, 0.8, 1),
        displacement: grassDisplacement,
    };

    const noiseBlend = true;
    if (noiseBlend) {
        const octaves = [
            {
                blur: 0.5,
                amplitude: 1.25,
                wavelength: 1024.0 * 16.0,
                accuracy: 1.25,
            },
            {
                blur: 1.0,
                amplitude: 1.0,
                wavelength: 1024.0 * 64.0,
                accuracy: 1.0,
            },
        ];
        //@ts-ignore
        grass1.blend = {
            mode: "noise",
            octaves,
        };
        //@ts-ignore
        grass2.blend = {
            mode: "noise",
            octaves,
        };
    }

    const mud: Surface = {
        diffuse: mudDiffuse,
        normal: mudNormals,
        normalStrength: 0.5,
        repeat: 300,
        saturation: 0.5,
        displacement: mudDisplacement,
    };

    const clif: Surface = {
        diffuse: cliffDiffuse,
        normal: cliffNormals,
        normalStrength: 0.5,
        // normalY: -1,
        flipNormals: true,
        tint: new Vector4(1.2, 1.2, 1.2, 1),
        triplanar: triplanar,
        gridless: gridless,
        aperiodic: gridless,
        repeat: 300,
        saturation: 0.5,
        displacement: cliffDisplacement,
    };

    const rock: Surface = {
        diffuse: rockDiffuse,
        normal: rockNormals,
        normalStrength: 0.4,
        tint: new Vector4(1.2, 1.2, 1.2, 1),
        triplanar: triplanar,
        gridless: gridless,
        aperiodic: gridless,
        repeat: 300,
        saturation: 0.3,
        displacement: rockDisplacement,
    }

    return [grass1, grass2, mud, clif, rock];
}

export function Terrain() {
    const [
        heightmap,
        normalmap,
        splat1,
        splat2,
        aomap,
        macromap
    ] = useLoader(TextureLoader, [
        heightmapFile,
        normalmapFile,
        splatMapTexture1,
        splatMapTexture2,
        ambientOcclusionTexture,
        macroTexture
    ]);
    const [grass1, grass2, mud, clif, rock] = useSurfaces();

    return (
        <mesh scale={0.035} position={[0, -0.15, 0]} rotation={[(-1 * Math.PI) / 2, 0, (-3.35 * Math.PI) / 2]}>
            {/*<MartiniGeometry displacementMap={heightmap} error={10} mobileError={100}/>*/}
            <planeBufferGeometry args={[1024, 1024, 2 ** 9, 2 ** 9]} ref={geometry => {
                if (geometry) {
                    geometry.attributes.uv2 = geometry.attributes.uv.clone();
                    geometry.needsUpdate = true;
                }
            }}/>
            <TerrainMaterial
                splats={[splat1, splat2]}
                surfaces={[rock, {...clif, normalStrength:0.5}, mud, grass1, grass2, mud, mud]}
                normalMap={normalmap}
                envMapIntensity={1}
                surfaceSamples={1}
                displacementMap={heightmap}
                displacementScale={120.0}
                displacementBias={0.0}
                metalness={0.125}
                roughness={0.8}
                macroMap={macromap}
                smoothness={1.0}
                anisotropy={4}
                aoMap={aomap}
                aoMapIntensity={0.62}
                far={1000}
                distanceTextureScale={1/3}
                meshSize={1024}/>
        </mesh>
    )
}
