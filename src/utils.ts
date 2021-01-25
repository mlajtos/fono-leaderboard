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

export const formatTime = (t: number) => t.toFixed(2);