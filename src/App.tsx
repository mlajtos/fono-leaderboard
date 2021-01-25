import React, { useEffect, useState } from "react";

import "./styles.css";
import "./dm.css";

import stats from "./stats";

import { loadData } from "./utils";

import Particles from "./Particles";
// import Winners from "./Winners";
import HallOfFame from "./HallOfFame";
import Leaderboards from "./Leaderboards";

export type Data = {
  [level: string]: {
    [player: string]: number;
  };
}

export default function App() {
  const [data, setData] = useState<Data>(stats);

  useEffect(() => {
    loadData("http://fono.ninja/leaderboard/json", setData);
  }, []);

  return (
    <>
      <Particles />
      <div className="App">

        <h1>Fono</h1>
        <p><a href="https://store.steampowered.com/app/1513670/Fono/">play on Steam</a></p>
        <p><a href="https://www.youtube.com/watch?v=NscKjhr1hkI">watch trailer</a></p>

        {/* <Winners data={data} /> */}
        <HallOfFame data={data} />
        <Leaderboards data={data} />

      </div>
    </>
  );
}
