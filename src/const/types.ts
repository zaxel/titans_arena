import type { JSX } from "react";
import type { WEAPONS } from "./const";

export type CharacterAnimationsType = "Death" | "Yes" | "Wave" | "Walk_Shoot" | "Walk" | "Run_Shoot" | "Run_Gun" | "Run"
  | "Punch" | "No" | "Jump_Land" | "Jump_Idle" | "Jump" | "Idle_Shoot" | "Idle" | "HitReact" | "Duck";

export type WeaponType = (typeof WEAPONS)[number];
export type SoldierCharacterProps = Omit<JSX.IntrinsicElements["group"], "id"> & {
  color?: string;
  animation?: string;
  weapon?: WeaponType;
  position?: [number, number, number];
  rotation?: [number, number, number];
  id?: string;
};

export type ExperienceProps = { currentPage: string, setCurrentPage: (page: string) => void };

export interface BotProps {
    position: [number, number, number];
    color?: string;
    weapon?: WeaponType;
    index: number;
}