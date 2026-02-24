import { CameraControls, Environment, Float, MeshReflectorMaterial, RenderTexture, Text, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Color } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";
import { SoldierCharacter } from "./SoldierCharacter";
import type { ExperienceProps } from "../const/types";
import { players } from "../const/const";
import NavMesh from "./NavMesh";
import { Bots } from "../game/agents/Bots";



const Experience = ({ currentPage, setCurrentPage }: ExperienceProps) => {

    const { scene } = useGLTF("./models/map.glb");
    const camControlRef = useRef<CameraControls>(null);
    const fitCameraHomeRef = useRef<THREE.Mesh>(null);
    const fitCameraArenaRef = useRef<THREE.Mesh>(null);
    const reflectionRef = useRef<THREE.Mesh>(null);
    const sceneRotationRef = useRef<boolean>(false);
    const [isPortrait, setIsPortrait] = useState<boolean>(window.innerHeight > window.innerWidth);
    const resizeAllowedRef = useRef<boolean>(true);

    const textRef = useRef<THREE.Mesh>(null);
    const opacityRef = useRef<number>(1);

    const bloomColor = new Color("#ffffff");
    bloomColor.multiplyScalar(1.5);

    const arenaClone = useMemo(() => scene.clone(true), [scene]);


    const adjustCamera = async () => {
        if (!camControlRef.current || !fitCameraHomeRef.current || !fitCameraArenaRef.current || !resizeAllowedRef.current) return;
        if (currentPage === "store") {
            const fit = camControlRef.current.fitToBox(fitCameraArenaRef.current, true);
            const tilt = camControlRef.current.rotatePolarTo(degToRad(75), true);
            await Promise.all([fit, tilt]);
            sceneRotationRef.current = true;
            resizeAllowedRef.current = false;

        } else {
            await camControlRef.current.fitToBox(fitCameraHomeRef.current, true)
        }
    }

    const intro = async () => {
        if (!camControlRef.current || !fitCameraHomeRef.current) return;

        camControlRef.current.smoothTime = 0.1;
        await camControlRef.current.dolly(-1, true);
        camControlRef.current.smoothTime = 1.6;

        await adjustCamera();
        setCurrentPage("home")
    };

    const initShadow = (scene: THREE.Object3D) => {
        scene.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }

    useEffect(() => {
        initShadow(scene)
    }, [scene]);

    useEffect(() => {
        intro();

        const handleResize = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
            adjustCamera();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);

    }, []);

    useEffect(() => {
        adjustCamera();
    }, [currentPage]);

    useFrame((_, delta) => {
        if (textRef.current) {

            const target = currentPage === "store" ? 0 : 1;
            opacityRef.current = THREE.MathUtils.lerp(
                opacityRef.current,
                target,
                delta * 1
            );
            (textRef.current.material as THREE.MeshBasicMaterial).opacity = opacityRef.current;
            textRef.current.visible = opacityRef.current > 0.02;
        }

        if (reflectionRef.current) {
            const targetY = currentPage === "store" ? 0.8 : -2.5;

            reflectionRef.current.position.y = THREE.MathUtils.lerp(
                reflectionRef.current.position.y,
                targetY,
                delta * 0.2
            );
        }

        if (sceneRotationRef.current && camControlRef.current) {
            camControlRef.current.azimuthAngle += delta * 0.08;
        }
    });

    return (
        <>
            {/* <Stats /> */}
            <CameraControls ref={camControlRef} />
            <Environment preset="sunset" />
            <fog attach={"fog"} args={["#171720", 10, isPortrait ? 50 : 30]} />
            <mesh ref={fitCameraHomeRef} position-z={0.5} position-x={-2.5} visible={false}>
                <boxGeometry args={[13, 3, 2]} />
                <meshBasicMaterial color={"orange"} transparent opacity={0.5} />
            </mesh>
            {currentPage === "store" && players.map(({ ...playerProps }) => (<SoldierCharacter key={playerProps.id} {...playerProps}/>))}
            <Suspense fallback={null}>
                <Text
                    ref={textRef}
                    // font="./fonts/Roboto-Black.ttf"
                    font="./fonts/Poppins-Black.ttf"
                    fontSize={1.5}
                    position-x={-2.2}
                    position-y={-1.2}
                    position-z={1}
                    lineHeight={0.8}
                    letterSpacing={-0.02}
                    rotation-y={degToRad(35)}
                >
                    {/* Tabletop {'\n'} Titans Arena */}
                    TABLETOP {'\n'} TITANS ARENA
                    <meshBasicMaterial color={bloomColor} toneMapped={false} transparent opacity={1}>
                        <RenderTexture attach="map">
                            <color attach={"background"} args={["#ffffff"]} />
                            <Environment preset="sunset" />
                            <Float floatIntensity={3} rotationIntensity={5}>
                                <primitive object={arenaClone} scale={0.35} rotation-x={degToRad(45)} position-x={-1} />
                            </Float>
                        </RenderTexture>
                    </meshBasicMaterial>
                
                </Text>
                <NavMesh />
                <group>
                    <primitive 
                    scale={0.13} 
                    rotation-y={degToRad(145)} position-x={5.0} position-y={1.1} object={scene} />
                    <mesh ref={fitCameraArenaRef} position-x={5} position-y={2} visible={false}>
                        <boxGeometry args={[8, 1.5, 1]} />
                        <meshBasicMaterial color="red" transparent opacity={0.5} />
                    </mesh>
                </group>

                <mesh rotation-x={degToRad(-90)} position-y={-2.5} ref={reflectionRef}>
                    <planeGeometry args={[100, 100]} />
                    <MeshReflectorMaterial
                        blur={[300, 100]}
                        resolution={768}
                        mixBlur={1}
                        mixStrength={80}
                        roughness={1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        color="#050505"
                        metalness={0.5}
                    />
                </mesh>
                {currentPage === "store" && <Bots />}
            </Suspense>
        </>
    )
};

export default Experience;