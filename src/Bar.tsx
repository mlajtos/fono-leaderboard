import React from "react";

export default function Bar({ color, width }: { color: string, width: number }) {
    return <div
        style={{
            boxSizing: "border-box",
            width,
            backgroundColor: color,
            height: "0.5em",
            //border: "0.05em solid black",
            margin: 0,
            marginBottom: "0.1em",
            borderRadius: "0.05em"
        }}
    />
}