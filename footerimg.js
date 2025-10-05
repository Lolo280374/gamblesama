(() => {
  const path = [
    "1448242666775.png",
    "fg84g5d5.png",
    "1459039594461.png",
    "e9b96c420ce18817342e49c48a6474c589e681ba.png",
    "1444797896875.png",
    "nz5vnb.png",
    "0405c517061c231de1b82ae64cdc705d84309bec.png"
  ];
  const folder = "src_footer/";

  const img = document.createElement("img");
  img.src = folder + path[Math.floor(Math.random() * path.length)];
  img.className = "image";
  img.alt = "this is meant to be an anime girl";
  img.style.position = "fixed";
  img.style.bottom = "0";
  img.style.right = "0";
  img.style.zIndex = "9999";
  img.style.maxHeight = "40vh";
  document.body.appendChild(img);
})();