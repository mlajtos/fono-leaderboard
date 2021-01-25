import React, { useEffect } from "react";

// @ts-ignore
import particles from 'particles.js-es';
import particlesConfig from "./particlesjs-config.json";

export default function Particles() {
    useEffect(() => {
        particles.init("background", particlesConfig);
    }, []);

    return (
        <div id="background" />
    );
}