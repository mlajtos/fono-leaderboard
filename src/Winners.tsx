import React from "react";
import { countBy } from "lodash-es";

import type { Data } from "./App";

import Player from "./Player";

export default function Winner({ data }: { data: Data }) {
    return (
        <>
            <h2>Winners</h2>
            <p>Players who won most of the levels.</p>
            <table
                style={{
                    borderCollapse: "collapse",
                    textAlign: "left",
                    minWidth: "14em"
                }}
            >
                <thead>
                    <tr>
                        <td>Player</td>
                        <td style={{ textAlign: "right" }}>Levels</td>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(
                        countBy(
                            Object.entries(data).map(([level, playerList]) =>
                                Object.entries(playerList)
                                    .map(([player, time], i, a) =>
                                        Math.min(...a.map(([_, t]) => t)) === time ? player : null
                                    )
                                    .reduce((p, c) => (p === null ? c : p))
                            )
                        )
                    )
                        .sort(([_, w1], [__, w2]) => w2 - w1)
                        .map(([player, wins], i, a) => (
                            <tr
                                key={i}
                            >
                                <td><Player name={player} /></td>
                                <td style={{ textAlign: "right" }}>{wins}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </>
    )
}