import { degToRad } from "three/src/math/MathUtils.js";
import type { SoldierCharacterProps } from "./types";

export const WEAPONS = [
  "GrenadeLauncher",
  "AK",
  "Knife_1",
  "Knife_2",
  "Pistol",
  "Revolver",
  "Revolver_Small",
  "RocketLauncher",
  "ShortCannon",
  "SMG",
  "Shotgun",
  "Shovel",
  "Sniper",
  "Sniper_2",
] as const;

export const players: SoldierCharacterProps[] = [
    {
        id: "1",
        position: [4.6, 2.02, -3.0],
        rotation: [0, degToRad(70), 0],
        weapon: "AK",
        animation: "Idle",
        color: "red"
    },
    {
        id: "2",
        position: [7.5, 2.02, -1.15],
        rotation: [0, degToRad(310), 0],
        weapon: "AK",
        animation: "Idle_Shoot",
        color: "blue"
    },
    {
        id: "3",
        position: [5.28, 2.02, 0.35],
        rotation: [0, degToRad(120), 0],
        weapon: "RocketLauncher",
        animation: "HitReact",
        color: "orange"
    },
    {
        id: "4",
        position: [5.9, 2.06, 0.5],
        rotation: [0, degToRad(240), 0],
        weapon: "Pistol",
        animation: "Death",
        color: "red"
    },
    {
        id: "5",
        position: [6.8, 2.21, 1.6],
        rotation: [0, degToRad(60), 0],
        weapon: "AK",
        animation: "Duck",
        color: "green"
    },
    {
        id: "6",
        position: [2.5, 2.02, -0.5],
        rotation: [0, degToRad(240), 0],
        weapon: "Sniper",
        animation: "Wave",
        color: "black"
    },
    {
        id: "7",
        position: [4.6, 2.21, 2.7],
        rotation: [0, degToRad(-30), 0],
        weapon: "Knife_2",
        animation: "Wave",
        color: "red"
    },
    {
        id: "8",
        position: [3.4, 1.24, 1.5],
        rotation: [0, degToRad(60), 0],
        weapon: "Shovel",
        animation: "Punch",
        color: "yellow"
    },
    {
        id: "9",
        position: [3.5, 1.24, 1.56],
        rotation: [0, degToRad(240), 0],
        weapon: "AK",
        animation: "No",
        color: "gray"
    },
]