import React from "react";

export default function Bar({ color, width }: { color: string, width: number }) {
    return <div
        style={{
            width,
            backgroundColor: `${color}70`,
            height: "0.5rem",
            border: `0.5px solid ${color}`,
            margin: 0,
            borderRadius: "2px"
        }}
    />
}