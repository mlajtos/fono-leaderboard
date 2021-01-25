import React from "react";

import type { Data } from "./App";

import Player from "./Player";
import { formatTime, stringToColor } from "./utils";
import levels from "./Levels.json";
import Bar from "./Bar";

export default function Leaderboards({ data }: { data: Data }) {
    return (
        <>
            <h2>Leaderboards</h2>
            <p>Breakdown of all levels.<br />Best time wins.</p>
            <table style={{ borderCollapse: "collapse", textAlign: "left" }}>
                <tbody>
                    {Object.entries(data)
                        .sort(([l1, _], [l2, __]) => levels.indexOf(l1) - levels.indexOf(l2))
                        .map(([level, playerList]) => (
                            <React.Fragment key={level}>
                                <tr>
                                    <td valign="top" style={{ paddingTop: 5 }} colSpan={2}>
                                        <h3 style={{ textAlign: "left" }}>{level} <span style={{ fontSize: "1rem", opacity: 0.5 }}>({Object.keys(playerList).length})</span></h3>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ paddingLeft: "2rem" }}>
                                        <table>
                                            <tbody>
                                                {Object.entries(playerList)
                                                    .sort(([_, t1], [__, t2]) => t1 - t2)
                                                    .map(([player, time], i, a) => {
                                                        const bestTime = Math.min(...a.map(([_, t]) => t));
                                                        const isBestTime = bestTime === time;

                                                        return (
                                                            <tr key={player}>
                                                                <td style={{ minWidth: "8em" }}>
                                                                    <Player name={player} />
                                                                </td>
                                                                <td style={{ textAlign: "right" }}>
                                                                    {formatTime(time)}
                                                                </td>
                                                                <td>
                                                                    {isBestTime ? null : (
                                                                        <small className="relativeTime">
                                                                            {" "}(+{formatTime(time - bestTime)})
                                                                        </small>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    </td>
                                    <td>
                                        <table>
                                            <tbody>
                                                {Object.entries(playerList)
                                                    .sort((a, b) => a[1] - b[1])
                                                    .map(([player, time], i) => (
                                                        <tr key={player}>
                                                            <td>&nbsp;</td>
                                                            <td>
                                                                <Bar color={stringToColor(player)} width={time} />
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                </tbody>
            </table>
        </>
    );
}