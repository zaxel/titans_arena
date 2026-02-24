import { useState } from "react";
import { COLORS, patrolPoints, WEAPONS } from "../../const/const";
import { Bot } from "./Bot";


export function Bots() {
    const [bots] = useState(() =>
        patrolPoints.map((pos, i) => ({
            ...pos,
            weapon: WEAPONS[Math.floor(Math.random() * WEAPONS.length)],
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            id: i
        }))
    );

    return (
        <>
            {bots.map((bot, i) => (
                <Bot
                    key={bot.id}
                    position={[bot.x, bot.y, bot.z]}
                    weapon={bot.weapon}
                    color={bot.color}
                    index={i}
                />
            ))}
        </>
    );
}