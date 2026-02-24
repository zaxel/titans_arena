import { degToRad } from "three/src/math/MathUtils.js";
import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { navMeshSystem } from "../game/navigation/NavMeshSystem";
import { useNavMeshDebug } from "../game/navigation/useNavMeshDebug";

const NavMesh = () => {
    const { scene } = useGLTF("./models/nav_mesh.glb");

    useNavMeshDebug(false);

    useEffect(() => {
        if (!scene) return;
        scene.updateWorldMatrix(true, true);
        scene.traverse((node) => {
            const mesh = node as THREE.Mesh;
            if (!mesh.isMesh) return;
            const geometry = mesh.geometry.clone();
            geometry.applyMatrix4(mesh.matrixWorld);
            navMeshSystem.initFromGeometry(geometry);
        });

    }, [scene]);

    return (
        <primitive
            scale={0.13}
            rotation-y={degToRad(145)}
            position={[5, 1.1, 0]}
            object={scene}
            visible={false} // hide the navmesh visually
        />
    );
};

export default NavMesh;