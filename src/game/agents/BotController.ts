import * as THREE from "three";
import { navMeshSystem } from "../navigation/NavMeshSystem";
import { patrolPoints } from "../../const/const";

export class BotController {
    object: THREE.Object3D; //bot 

    currentPath: THREE.Vector3[] | null = null;
    botSpeed = 0;
    pathIndex = 0;
    notMovedSince = 0;

    runSpeed = 0.3; // units per second
    walkSpeed = 0.18; // units per second
    waypointThreshold = 0.2;

    targetPosition = new THREE.Vector3();

    animation = "Idle";
    prevWaypoint = null;

    constructor(object: THREE.Object3D) {
        this.object = object;
    }

    startPatrol(botIndex: number) {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * patrolPoints.length);
        } while (nextIndex === botIndex % patrolPoints.length);

        this.requestNewPath(patrolPoints[nextIndex]);
    }

    requestNewPath(target: THREE.Vector3) {
        const start = this.object.position.clone();
        const path = navMeshSystem.findPath(start, target);
        if (!path || path.length === 0) return;
        this.currentPath = path;
        this.pathIndex = 0;

        if (Math.random() < 0.5) {
            this.botSpeed = this.runSpeed;
            this.animation = Math.random() < 0.5 ? "Run" : "Run_Shoot";
        } else {
            this.botSpeed = this.walkSpeed;
            this.animation = Math.random() < 0.5 ? "Walk" : "Walk_Shoot";
        }
    }

    update(delta: number) {
        if (!this.currentPath) return;
        const waypoint = this.currentPath[this.pathIndex];
        if (!waypoint) return;

        const position = this.object.position;

        const direction = this.targetPosition
            .copy(waypoint)
            .sub(position);

        const distance = direction.length();

        if (this.notMovedSince + 60*1000 < Date.now()) {
            const next = patrolPoints[Math.floor(Math.random() * patrolPoints.length)];
            this.notMovedSince = Date.now();
            this.requestNewPath(next);
        }

        // If reached waypoint
        if (distance < this.waypointThreshold) {
            this.pathIndex++;

            if (this.pathIndex >= this.currentPath.length) {
                this.currentPath = null; // reached destination
                this.botSpeed = 0;
                const idleAnimations = ["Idle", "Yes", "Wave"];
                const idleAnimIndex = Math.floor(Math.random() * idleAnimations.length);
                this.animation = idleAnimations[idleAnimIndex];
                this.notMovedSince = Date.now();

                setTimeout(() => {
                    const next = patrolPoints[Math.floor(Math.random() * patrolPoints.length)];
                    this.requestNewPath(next);
                }, 2000 + Math.random() * 3000); // wait 2-5 seconds
                return;
            }
            return;
        }

        // Normalize direction
        direction.normalize();

        // Rotate toward movement direction (Y only)
        const angle = Math.atan2(direction.x, direction.z);
        this.object.rotation.y = angle;

        // Move
        position.addScaledVector(direction, this.botSpeed * delta);
    }

    isMoving() {
        return this.currentPath !== null;
    }

    isRunning() {
        return this.botSpeed === this.runSpeed;
    }

    isWalking() {
        return this.botSpeed === this.walkSpeed;
    }
}