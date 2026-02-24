import { useEffect } from "react";
import { navMeshSystem } from "./NavMeshSystem";
import { useThree } from "@react-three/fiber";

export function useNavMeshDebug(enabled: boolean) {
  const { scene } = useThree();

  useEffect(() => {
    if (!enabled) return;

    navMeshSystem.attachDebug(scene);

    return () => {
      navMeshSystem.detachDebug(scene);
    };
  }, [enabled, scene]);
}
