import * as THREE from "three";
import { Pathfinding, PathfindingHelper } from "three-pathfinding";

const ZONE = "level1";

class NavMeshSystem {
    private pathfinding = new Pathfinding();
    private zoneReady = false;
    private helper = new PathfindingHelper();

    initFromMesh(mesh: THREE.Mesh) {
        if (this.zoneReady) return;

        mesh.updateWorldMatrix(true, false);

        const geometry = mesh.geometry.clone();
        geometry.applyMatrix4(mesh.matrixWorld);

        const zone = Pathfinding.createZone(geometry);
        this.pathfinding.setZoneData(ZONE, zone);

        this.zoneReady = true;
    }

    initFromGeometry(geometry: THREE.BufferGeometry) {
        if (this.zoneReady) return;
        const zone = Pathfinding.createZone(geometry);
        this.pathfinding.setZoneData(ZONE, zone);
        this.zoneReady = true;
    }

    attachDebug(scene: THREE.Scene) {
        scene.add(this.helper);
    }

    detachDebug(scene: THREE.Scene) {
        scene.remove(this.helper);
    }

    debugPath(start: THREE.Vector3, end: THREE.Vector3, path: THREE.Vector3[]) {
        this.helper.reset();
        this.helper.setPlayerPosition(start);
        this.helper.setTargetPosition(end);
        this.helper.setPath(path);
    }

    findPath(start: THREE.Vector3, end: THREE.Vector3) {
        // start = new THREE.Vector3(3.5, 1.24, 1.56)
        if (!this.zoneReady) return null;

        // start = new THREE.Vector3(6.8, 2.21, 1.6);
        const group = this.pathfinding.getGroup(ZONE, start);
        const closest = this.pathfinding.getClosestNode(start, ZONE, group);
        if (!closest) return null;




        const path = this.pathfinding.findPath(
            start,
            end,
            ZONE,
            group
        );

        // console.log("START:", start);
        // console.log("end:", end);
        // console.log("closest:", closest);
        // console.log("GROUP:", group);
        // console.log("PATH:", path);

        if (path) {
            this.debugPath(start, end, path); // visualize successful paths
        } else {
            // Visualize even failed attempts so you can see where it's trying
            this.helper.reset();
            this.helper.setPlayerPosition(start);
            // this.helper.setPlayerPosition(closest.centroid);
            this.helper.setTargetPosition(end);
        }

        return path;
    }

    isReady() {
        return this.zoneReady;
    }
}

export const navMeshSystem = new NavMeshSystem();