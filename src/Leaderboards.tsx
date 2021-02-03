import React, { useEffect, useRef } from "react";

import type { Data } from "./App";

import Player from "./Player";
import { formatTime, stringToColor } from "./utils";
import levels from "./Levels.json";
import Bar from "./Bar";

function LevelHeader({ name, order, count }: { name: string, order: number, count: number }) {
    const selectedLevel = window.location.hash.substring(1);
    const ref = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (selectedLevel === name) {
            ref.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [name, selectedLevel]);

    return (
        <h3 style={{ textAlign: "left" }} id={name} ref={ref}>
            <span style={{ opacity: 0.3, fontSize: "1rem" }}>{order + 1} - </span>
            <span><a href={`#${name}`}>{name}</a> </span>
            <span style={{ fontSize: "1rem", opacity: 0.5 }}>({count})</span>
        </h3>
    );
}

declare global {
    interface Object {
        pipe(func: (value: any) => any): any;
    }
}

// eslint-disable-next-line
Object.prototype.pipe = function (func) {
    return func(this);
}

export default function Leaderboards({ data }: { data: Data }) {
    const levelBreakdown = Object.entries(data)
        .filter(([l, _]) => levels.includes(l))
        .sort(([l1, _], [l2, __]) => levels.indexOf(l1) - levels.indexOf(l2));

    return (
        <>
            <h2>Levels</h2>
            <p>Summary of all levels.</p>
            <table style={{
                textAlign: "left",
                minWidth: "15em"
            }}>
                <thead>
                    <tr>
                        <td colSpan={2}>Level</td>
                        <td colSpan={2}>Finishers</td>
                    </tr>
                </thead>
                <tbody>
                    {levels.map((levelName, levelOrder) => (
                        <tr>
                            <td style={{ opacity: 0.3, fontSize: "1rem", textAlign: "right" }}><span>{levelOrder + 1}. </span></td>
                            <td><span> <a href={`#${levelName}`}>{levelName}</a></span></td>
                            {(() => {
                                const successfulLevelSessions = levelBreakdown.find(([level]) => level === levelName);
                                if (successfulLevelSessions) {
                                    return Object.keys(successfulLevelSessions[1]).length;
                                } else {
                                    return 0;
                                }
                            })().pipe((count) => (
                                <>
                                    <td style={{ textAlign: "right", paddingRight: "0.5rem" }}>{count}</td>
                                    <td><Bar width={count} color={"#555555"} /></td>
                                </>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Leaderboards</h2>
            <p>Breakdown of all levels.<br />Best time wins.</p>
            <table style={{ borderCollapse: "collapse", textAlign: "left" }}>
                <tbody>
                    {
                        levelBreakdown
                            .map(([level, playerList], levelOrder) => (
                                <React.Fragment key={level}>
                                    <tr>
                                        <td valign="top" style={{ paddingTop: "1.5rem" }} colSpan={2}>
                                            <LevelHeader name={level} order={levelOrder} count={Object.keys(playerList).length} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ paddingLeft: "2.5rem" }}>
                                            <table>
                                                <tbody>
                                                    {Object.entries(playerList)
                                                        .sort(([_, t1], [__, t2]) => t1 - t2)
                                                        .map(([player, time], i, a) => {
                                                            const bestTime = Math.min(...a.map(([_, t]) => t));
                                                            const isBestTime = bestTime === time;

                                                            return (
                                                                <tr key={player}>
                                                                    <td style={{ textAlign: "right", opacity: 0.3 }}>
                                                                        {i + 1}.
                                                                </td>
                                                                    <td style={{ minWidth: "8em" }}>
                                                                        <Player name={player} />
                                                                    </td>
                                                                    <td style={{ textAlign: "right" }}>
                                                                        {formatTime(time)}
                                                                    </td>
                                                                    <td style={{ textAlign: "right" }}>
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