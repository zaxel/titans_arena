import { useThree } from "@react-three/fiber";

const usePatrolPoints = () => {
    const scene = useThree(state => state.scene);
    console.log(scene)
   
    const patrolPoints = [];
    for (let i = 0; i < 100; i++) {
        const point = scene.getObjectByName(`character_spawn_${i}`);
        console.log(point)
        if (!point) break;
        patrolPoints.push(point);
    }


    // scene.traverse((obj) => {
    //     if (obj.name.startsWith("character_spawn_")) {
    //         console.log(99)
    //         patrolPoints.push(obj.position.clone());
    //     }
    // });


    if (!patrolPoints.length) return;
    return patrolPoints;
}

export default usePatrolPoints;