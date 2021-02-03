import React from "react";

import type { Data } from "./App";

import Player from "./Player";
import { formatTime } from "./utils";
import levels from "./Levels.json";

export default function ({ data }: { data: Data }) {
    const stats: { [player: string]: { totalTime: number, finishedLevels: number } } = {};
    let numberOfLevels = levels.length;

    Object.entries(data).forEach(([level, playerList]) => {
        Object.entries(playerList).forEach(([player, time]) => {
            if (!stats.hasOwnProperty(player)) {
                stats[player] = { totalTime: 0, finishedLevels: 0 };
            }

            stats[player].totalTime += time;
            stats[player].finishedLevels += 1;
        })
    })

    const bestPlayers = Object.entries(stats)
        .filter(([_, { finishedLevels }]) => finishedLevels === numberOfLevels)
        .sort(([_, { totalTime: t1 }], [__, { totalTime: t2 }]) => t1 - t2);

    return (
        <>
            <h2>Hall of Fame <span style={{ fontSize: "1rem", opacity: 0.5 }}>({Object.keys(bestPlayers).length})</span></h2>
            <p>Players who finished all levels.<br />Time is the sum of best runs.</p>
            <table
                style={{
                    textAlign: "left",
                    minWidth: "15em"
                }}
            >
                <thead>
                    <tr><td>Player</td><td style={{ textAlign: "right" }}>Time</td></tr>
                </thead>
                <tbody>
                    {
                        bestPlayers.map(
                            ([player, { totalTime }]) => (
                                <tr key={player}>
                                    <td><Player name={player} /></td>
                                    <td style={{ textAlign: "right" }}>{formatTime(totalTime)}</td>
                                </tr>
                            ))
                    }
                </tbody>
            </table>
        </>
    );
}