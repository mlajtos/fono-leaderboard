import React from "react";

export default function Dot({ color }: { color: string }) {
    return <div
        style={{
            width: "0.8rem",
            height: "0.8rem",
            backgroundColor: color,
            display: "inline-block",
            borderRadius: "1rem",
            marginRight: "0.2rem",
            verticalAlign: "middle"
        }}
    />
}