import React, { useEffect, useState } from "react";
import { countBy } from "lodash-es";
import "./styles.css";

const loadData = async (cb) => {
  const response = await fetch("https://fono.ninja/leaderboard/json");
  const data = await response.json();
  cb(data);
};

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

export default function App() {
  const [data, setData] = useState({
    "TOTO NIE SÚ SKUTOČNÉ DÁTA": {
      majno: 11.428009033203125,
      majro: 14.23333740234375
    },
    "Above only Sky": { majno: 11.428009033203125, majro: 14.23333740234375 },
    Ball: { majno: 3.1720895767211914, majro: 4.813331604003906 },
    "Ball and Square": { majno: 10.455375671386719, majro: 17.553329467773438 },
    "Big Ball": { majno: 22.2637939453125, majro: 2.673309326171875 },
    Blackhoe: { majno: 28.287382125854492, majro: 27.3133544921875 },
    Bridge: { majno: 4.743692398071289, majro: 6.833343505859375 },
    Canon: { majno: 12.2078857421875, majro: 10.693328857421875 },
    Combination: { majno: 269.677490234375, majro: 165.85333251953125 },
    "Dont forget": { majno: 19.163665771484375, majro: 23.7933349609375 },
    Empty: { majno: 21.9720458984375, majro: 25.413330078125 },
    "Friendly Shadow": { majno: 7.663818359375, majro: 8.0133056640625 },
    Gate: { majno: 9.771886825561523, majro: 17.833335876464844 },
    Hatch: { majno: 11.036361694335938, majro: 14.493335723876953 },
    Hello: { majno: 18.852100372314453, majro: 23.493331909179688 },
    "In and Out": { majno: 5.7080230712890625, majro: 6.61334228515625 },
    "Leap of Faith": { majno: 7.983978271484375, majro: 8.67333984375 },
    Lobby: { majno: 0.0, majro: 59.383331298828125 },
    Monolith: { majno: 5.719610214233398 },
    "Snake Up, Frog Across": {
      majno: 14.200042724609375,
      majro: 17.893341064453125
    },
    Square: { majno: 15.6475830078125, majro: 28.233322143554688 },
    Support: { majno: 17.812416076660156, majro: 30.553329467773438 },
    "There and Back": { majno: 14.10797119140625, majro: 14.95330810546875 },
    "Up Up": { majno: 5.8043975830078125, majro: 7.0533447265625 },
    Waterfall: { majno: 42.38398742675781 },
    "Zig Zag": { majno: 6.391815185546875, majro: 7.5333251953125 }
  });

  useEffect(() => {
    loadData(setData);
  }, []);

  return (
    <div className="App">
      <h2>Players</h2>
      <table
        style={{
          borderCollapse: "collapse",
          textAlign: "left",
          minWidth: "10em"
        }}
      >
        <thead style={{ borderBottom: "1px solid #aaa" }}>
          <tr>
            <td>Player</td>
            <td>Wins</td>
          </tr>
        </thead>
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
              style={{
                fontWeight:
                  Math.max(...a.map(([_, w]) => w)) === wins ? 900 : 100
              }}
            >
              <td>{player}</td>
              <td>{wins}</td>
            </tr>
          ))}
      </table>

      <h2>Levels</h2>
      <table style={{ borderCollapse: "collapse", textAlign: "left" }}>
        <tbody>
          {Object.entries(data).map(([level, playerList]) => (
            <>
              <tr>
                <td valign="top" style={{ paddingTop: 5 }}>
                  <h3 style={{ textAlign: "left" }}>{level}</h3>
                </td>
              </tr>
              <tr>
                <td style={{ paddingLeft: "2rem" }}>
                  <table>
                    {Object.entries(playerList)
                      .sort(([_, t1], [__, t2]) => t1 - t2)
                      .map(([player, time], i, a) => {
                        const bestTime = Math.min(...a.map(([_, t]) => t));
                        const isBestTime = bestTime === time;

                        return (
                          <tr
                            style={{
                              fontWeight: isBestTime ? 900 : 100
                            }}
                          >
                            <td style={{ minWidth: "8em" }}>
                              <div
                                style={{
                                  width: "0.8rem",
                                  height: "0.8rem",
                                  backgroundColor: stringToColor(player),
                                  display: "inline-block",
                                  borderRadius: "1rem",
                                  marginRight: "0.2rem",
                                  verticalAlign: "middle"
                                }}
                              />
                              {player}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {time.toFixed(2)}
                            </td>
                            <td>
                              {isBestTime ? null : (
                                <small
                                  style={{ color: "#aaa", fontWeight: 100 }}
                                >
                                  {" "}
                                  (+{(time - bestTime).toFixed(2)})
                                </small>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </table>
                </td>
                <td>
                  {Object.entries(playerList)
                    .sort((a, b) => a[1] - b[1])
                    .map(([player, time], i) => (
                      <div
                        style={{
                          boxSizing: "border-box",
                          width: time,
                          backgroundColor: stringToColor(player),
                          height: "0.5em",
                          border: "0.05em solid white",
                          margin: 0,
                          borderRadius: 0
                        }}
                      />
                    ))}
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
