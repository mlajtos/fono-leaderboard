import React, { useEffect, useState } from "react";
import { countBy } from "lodash-es";

import "./styles.css";
import "./dm.css";

import stats from "./stats";
import Bar from "./Bar";
import Dot from "./Dot";

import { formatTime, stringToColor, loadData } from "./utils"

type Data = {
  [level: string]: {
    [player: string]: number;
  };
}

const Player = ({ name }: { name: string }) => <><Dot color={stringToColor(name)} /> {name.substring(0, 10)}</>

export default function App() {
  const [data, setData] = useState<Data>(stats);

  useEffect(() => {
    loadData("http://fono.ninja/leaderboard/json", setData);
  }, []);

  return (
    <div className="App">
      <h2>Players</h2>
      <p>Players who won most of the levels.</p>
      <table
        style={{
          borderCollapse: "collapse",
          textAlign: "left",
          minWidth: "10em"
        }}
      >
        <thead>
          <tr>
            <td>Player</td>
            <td>Levels</td>
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

      <h2>Speedrun</h2>
      <p>Players who finished all levels.</p>
      <table
        style={{
          borderCollapse: "collapse",
          textAlign: "left",
          minWidth: "15em"
        }}
      >
        <thead>
          <tr><td>Player</td><td style={{ textAlign: "right" }}>Time</td></tr>
        </thead>
        <tbody>
          {
            (() => {
              const stats: { [player: string]: { totalTime: number, finishedLevels: number } } = {};
              let numberOfLevels = Object.keys(data).length;

              Object.entries(data).forEach(([level, playerList]) => {
                Object.entries(playerList).forEach(([player, time]) => {
                  if (!stats.hasOwnProperty(player)) {
                    stats[player] = { totalTime: 0, finishedLevels: 0 };
                  }

                  stats[player].totalTime += time;
                  stats[player].finishedLevels += 1;
                })
              })

              return Object.entries(stats)
                .filter(([_, { finishedLevels }]) => finishedLevels === numberOfLevels)
                .sort(([_, { totalTime: t1 }], [__, { totalTime: t2 }]) => t1 - t2)
                .map(([player, { totalTime }]) => <tr key={player}><td><Player name={player} /></td><td style={{ textAlign: "right" }}>{formatTime(totalTime)}</td></tr>)
            })()
          }
        </tbody>
      </table>


      <h2>Levels</h2>
      <p>Breakdown of all levels. Sorted by number of players who finished the level.</p>
      <table style={{ borderCollapse: "collapse", textAlign: "left" }}>
        <tbody>
          {Object.entries(data)
            .sort(([_, l1], [__, l2]) => Object.keys(l2).length - Object.keys(l1).length)
            .map(([level, playerList]) => (
              <React.Fragment key={level}>
                <tr>
                  <td valign="top" style={{ paddingTop: 5 }}>
                    <h3 style={{ textAlign: "left" }}>{level}</h3>
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
                              <tr
                                key={player}
                                style={{
                                  fontWeight: isBestTime ? 900 : 100
                                }}
                              >
                                <td style={{ minWidth: "8em" }}>
                                  <Player name={player} />
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {formatTime(time)}
                                </td>
                                <td>
                                  {isBestTime ? null : (
                                    <small
                                      style={{ color: "#aaa", fontWeight: 100 }}
                                    >
                                      {" "}
                                  (+{formatTime(time - bestTime)})
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
                    {Object.entries(playerList)
                      .sort((a, b) => a[1] - b[1])
                      .map(([player, time], i) => (
                        <Bar key={player} color={stringToColor(player)} width={time} />
                      ))}
                  </td>
                </tr>
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
}