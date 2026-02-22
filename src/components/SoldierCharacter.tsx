import { useAnimations, useGLTF } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from 'three';
import {
  Color,
  LoopOnce,
  Mesh,
  MeshStandardMaterial,
  Object3D,
} from "three";
import { SkeletonUtils } from "three-stdlib";
import type { SoldierCharacterProps } from "../const/types";
import { WEAPONS } from "../const/const";


export function SoldierCharacter({
  id: _id,
  color = "black",
  animation = "Idle",
  weapon = "AK",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  ...props
}: SoldierCharacterProps) {
  const group = useRef<THREE.Group>(null);

  const { scene, materials, animations } = useGLTF(
    "./models/soldier_character.gltf"
  );

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const { nodes } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  // Configure death animation
  useEffect(() => {
    if (!actions) return;

    const death = actions["Death"];
    if (death) {
      death.setLoop(LoopOnce, 1);
      Object.assign(death, { clampWhenFinished: true });
    }
  }, [actions]);

  // Animation switching
  useEffect(() => {
    const action = actions?.[animation];
    if (!action) return;

    action.reset().fadeIn(0.2).play();

    return () => {
      action.fadeOut(0.2);
    };
  }, [animation, actions]);

  // Player color material
  const playerColorMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(color),
      }),
    [color]
  );

  // Dispose material on change
  useEffect(() => {
    return () => {
      playerColorMaterial.dispose();
    };
  }, [playerColorMaterial]);

  // Weapon visibility + color assignment
  useEffect(() => {
    // Weapon switching
    WEAPONS.forEach((wp) => {
      const obj = nodes[wp] as Object3D | undefined;
      if (obj) obj.visible = wp === weapon;
    });

    // Assign material + shadows
    clone.traverse((child: Object3D) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;

        if (
          !Array.isArray(mesh.material) &&
          mesh.material?.name === "Character_Main"
        ) {
          mesh.material = playerColorMaterial;
        }

        mesh.castShadow = true;
      }
    });
  }, [nodes, clone, weapon, playerColorMaterial]);

  return (
    <group {...props} dispose={null} ref={group} scale={0.1} position={position} rotation={rotation}>
      <group name="Scene">
        <group name="CharacterArmature">
          <primitive object={nodes.Root} />
          <group name="Body_1">
            <skinnedMesh
              geometry={(nodes.Cube004 as any).geometry}
              material={(materials as any).Skin}
              skeleton={(nodes.Cube004 as any).skeleton}
              castShadow
            />
            <skinnedMesh
              geometry={(nodes.Cube004_1 as any).geometry}
              material={(materials as any).DarkGrey}
              skeleton={(nodes.Cube004_1 as any).skeleton}
              castShadow
            />
            <skinnedMesh
              geometry={(nodes.Cube004_2 as any).geometry}
              material={(materials as any).Pants}
              skeleton={(nodes.Cube004_2 as any).skeleton}
              castShadow
            />
            <skinnedMesh
              geometry={(nodes.Cube004_3 as any).geometry}
              material={playerColorMaterial}
              skeleton={(nodes.Cube004_3 as any).skeleton}
              castShadow
            />
            <skinnedMesh
              geometry={(nodes.Cube004_4 as any).geometry}
              material={(materials as any).Black}
              skeleton={(nodes.Cube004_4 as any).skeleton}
              castShadow
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("./models/soldier_character.gltf");
