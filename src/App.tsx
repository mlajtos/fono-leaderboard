import React, { useEffect, useState } from "react";
//import { countBy } from "lodash-es";

// @ts-ignore
import particles from 'particles.js-es';
import particlesConfig from "./particlesjs-config.json";

import "./styles.css";
import "./dm.css";

import stats from "./stats";
import Bar from "./Bar";
import Dot from "./Dot";

import levels from "./Levels.json";

import { formatTime, stringToColor, loadData } from "./utils"

type Data = {
  [level: string]: {
    [player: string]: number;
  };
}

const formatName = (name: string) => {
  const hashLenghts = [32, 36, 40];
  const isHash = hashLenghts.includes(name.length);
  return isHash ? name.substring(0, 10) : name;
}

const Player = ({ name }: { name: string }) => (
  <div className="Player">
    <Dot color={stringToColor(name)} />
    <span style={{display: "inline-block",}}>{formatName(name)}</span>
  </div>
);

export default function App() {
  const [data, setData] = useState<Data>(stats);

  useEffect(() => {
    loadData("http://fono.ninja/leaderboard/json", setData);
  }, []);

  useEffect(() => {
    particles.init("background", particlesConfig);
  }, []);

  return (
    <>
      <div id="background" />
      <div className="App">

        <h1>Fono</h1>
        <p><a href="https://store.steampowered.com/app/1513670/Fono/">play on Steam</a></p>
        <p><a href="https://www.youtube.com/watch?v=NscKjhr1hkI">watch trailer</a></p>

        {/* <h2>Winners</h2>
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
        </table> */}

        <h2>Hall of Fame</h2>
        <p>Players who finished all levels.<br />Time is the sum of best runs.</p>
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
      </div>
    </>
  );
}
