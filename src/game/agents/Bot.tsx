import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SoldierCharacter } from "../../components/SoldierCharacter";

import type { BotProps } from "../../const/types";
import { BotController } from "./BotController";


export function Bot({ position, color, weapon, index }: BotProps) {

    const groupRef = useRef<THREE.Group>(null!);
    const controllerRef = useRef<BotController | null>(null);
    const [animation, setAnimation] = useState("Idle");
    const animationRef = useRef("Idle");

    useEffect(() => {
        if (!groupRef.current) return;

        const [x, y, z] = position;
        groupRef.current.position.set(x, y, z);
        controllerRef.current = new BotController(groupRef.current);
        controllerRef.current.startPatrol(index);
    }, [position, index]);

    useFrame((_, delta) => {
        const controller = controllerRef.current;
        if (!controller) return;

        controller.update(delta);

        const next = controller.animation;
        if (next !== animationRef.current) {
            animationRef.current = next;
            setAnimation(next);
        }
    });

    return (
        <group ref={groupRef}>
            <SoldierCharacter
                weapon={weapon}
                color={color}
                animation={animation}
            />
        </group>
    );
}