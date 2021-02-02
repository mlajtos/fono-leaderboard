import React from "react";

export const loadData = async (url: string, cb: (data: any) => void) => {
  const response = await fetch(url);
  const data = await response.json();
  cb(data);
};

export const stringToColor = (str: string) => {
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

const $ = (n: number) => {
  return `${n}`.padStart(2, '0');
}

// this is awful, just drop zeros and separators until you can
export const formatTime = (t: number) => {
  const m = t / 60 | 0;
  const s = t % 60 | 0;
  const cs = ((t - (t | 0)) * 100) | 0;

  const parts = [];

  if (m > 10) {
    parts.push($(m));
    parts.push(":");
  } else if (m > 0) {
    parts.push(m);
    parts.push(":");
  }

  if (parts.length === 0) {
    if (s > 10) {
      parts.push($(s));
      parts.push(".");
    } else {
      parts.push(s);
      parts.push(".");
    }
  } else {
    parts.push($(s));
    parts.push(".");
  }

  parts.push($(cs));

  return (
    <span>
      {parts}
    </span>
  );
};