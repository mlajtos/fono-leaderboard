import React from "react";

import Dot from "./Dot";
import { stringToColor } from "./utils";

const formatName = (name: string) => {
    const hashLenghts = [32, 36, 40];
    const isHash = hashLenghts.includes(name.length);
    return isHash ? <span style={{ opacity: 0.5 }}>{name.substring(0, 10)}</span> : name;
}

export default function Player({ name }: { name: string }) {
    return (
        <div className="Player">
            <Dot color={stringToColor(name)} />
            <a href={`#u/${name}`} style={{ display: "inline-block", }}>{formatName(name)}</a>
        </div>
    )
};

