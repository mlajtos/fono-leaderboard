import React, { useEffect, useState } from "react";

import "./styles.css";
import "./dm.css";

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
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    loadData("http://fono.ninja/leaderboard/json", setData);
  }, []);

  const [targetPlayer, setTargetPlayer] = useState<string | undefined>(undefined);

  useEffect(() => {
    const setTargetPlayerFromUrl = () => {
      const targetPlayer = document.location.hash.substring(1).replace("u/", "");
      setTargetPlayer(targetPlayer);
    }

    setTargetPlayerFromUrl();

    window.addEventListener("hashchange", setTargetPlayerFromUrl, false);

    return () => {
      window.removeEventListener("hashchange", setTargetPlayerFromUrl, false);
    }
  }, []);

  

  return (
    <>
      <Particles />
      <div className="App">

        <h1>Fono</h1>
        <p><a href="https://store.steampowered.com/app/1513670/Fono/">play on Steam</a></p>
        <p><a href="https://www.youtube.com/watch?v=NscKjhr1hkI">watch trailer</a></p>
        <p><a href="mailto:info@fono.ninja">write us</a></p>

        {
          data === null ? null : [
            //<Winners data={data} />,
            <HallOfFame data={data} />,
            <Leaderboards data={data} targetPlayer={targetPlayer} />,
          ]
        }
      </div>
    </>
  );
}
