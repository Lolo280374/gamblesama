let dataset = [];
let exchanges = {};
let selectedcurrency = localStorage.getItem("currency") || "JPY";
let rolls = 0;

const failsfx = document.getElementById("sfx_fail");
const rollsfx = document.getElementById("sfx_roll");
const currencyinput = document.getElementById("currency");
const animefilter = document.getElementById("animefilter");
const animeresults = document.getElementById("results");
currencyinput.value = `current currency: ${selectedcurrency}`;

fetch('./dataset/all_fig.json')
  .then(r => r.json())
  .then(d => dataset = d)
  .catch(e => console.error("failed to load fig dataset:", e));

fetch('https://open.er-api.com/v6/latest/JPY')
  .then(r => r.json())
  .then(d => exchanges = d.rates)
  .catch(e => console.error("failed to get currency info, will only show JPY", e));

animefilter.addEventListener("input", () => {
  const query = animefilter.value.trim().toLowerCase();
  if (!query) {
    animeresults.innerHTML = "";
    return;
  }

  const howMany = {};
  dataset.forEach(fig => {
    fig.anime?.forEach(a => {
      if (a.toLowerCase().includes(query)) {
        howMany[a] = (howMany[a] || 0) + 1;
      }
    });
  });

  const closest = Object.entries(howMany)
  .sort((a, b) => b[1]-a[1])
  .slice(0,3);

  animeresults.innerHTML = closest.map(([anime, count]) => 
  `<div>${anime} (${count})</div>`
  ).join("");
});

currencyinput.addEventListener("change", () => {
  const val = currencyinput.value.toUpperCase();
  if (exchanges[val]) {
    selectedcurrency = val;
    localStorage.setItem("currency", val);
    const jpyval = `current currency: ${selectedcurrency}`;
    currencyinput.value = "changed currency!";
    setTimeout(() => { currencyinput.value = jpyval; }, 1000);
  } else {
    const jpyval = `current currency: ${selectedcurrency}`;
    currencyinput.value = "invalid currency...";
    sfx_fail.currentTime = 0;
    sfx_fail.play();
    setTimeout(() => { currencyinput.value = jpyval; }, 1000);
  }
});

document.getElementById('roll').addEventListener('click', () => {
  if (!dataset.length) {
    document.getElementById("status").innerText = "not loaded yet!";
    return;
  }

  let filtered = dataset;
  const animeQuery = animefilter.value.trim().toLowerCase();
  if (animeQuery) {
    filtered = dataset.filter(fig =>
      fig.anime?.some(a => a.toLowerCase().includes(animeQuery))
    );
    if (!filtered.length) {
      failsfx.currentTime = 0;
      failsfx.play();
      return alert("the anime you entered is not in the database. check your spelling!")
    }
  }

  let f;
  if (rolls < 4) {
    const hasPrice = filtered.filter(fig => {
      const raw = Array.isArray(fig.manufacturer_price) ? fig.manufacturer_price[0] : fig.manufacturer_price;
      const num = parseFloat(raw?.toString().replace(/[^0-9.]/g, '')) || 0;
      return num > 0;
    });

    f = hasPrice.length > 0
    ? hasPrice[Math.floor(Math.random() * hasPrice.length)]
    : filtered[Math.floor(Math.random() * filtered.length)];
  } else {
    f = filtered[Math.floor(Math.random() * filtered.length)];
  }

  rolls++;

  const name = f.name || "no name";
  const manufacturer = f.manufacturer || "no known manufacturer";
  const url = f.url || "no url provided";
  const anime = f.anime?.join(", ") || "no anime avalaible";
  const character = f.character?.join(", ") || "no character(s) avalaible";
  const release = f.release_date || "no release date known";
  const raw = Array.isArray(f.manufacturer_price) ? f.manufacturer_price[0] : f.manufacturer_price;
  const num = parseFloat(raw?.toString().replace(/[^0-9.]/g, '')) || 0;

  let price = "no price data";
  if (num > 0) {
    const coin = `<img src="coin.png" alt"coins (JPY)" style="height: 1em">`;
    const base = `${num} ${coin}`;
    if (selectedcurrency !== "JPY" && exchanges[selectedcurrency]) {
      const converted = (num * exchanges[selectedcurrency]).toFixed(2);
      price = `${base} - ${converted} ${selectedcurrency}`;
    } else {
      price = base;
    }
  }

  document.getElementById('figureName').innerText = name;
  document.getElementById('figureAnime').innerText = anime;
  document.getElementById('figureCharacter').innerText = character;
  document.getElementById('figureManufacturerPrice').innerHTML = price;
  document.getElementById('figureManufacturer').innerHTML = manufacturer;
  document.getElementById('figureRelease').innerText = release;
  document.getElementById('google').href = `https://google.com/search?q=${encodeURIComponent(name + ' buy store')}`;
  document.getElementById('google').style.display = 'inline';
  
  const mansep = document.getElementById('mansep');
  const mantag = document.getElementById('mantag');
  const manfig = document.getElementById('figureManufacturer');
  if (manufacturer && manufacturer !== "Unknown") {
    mansep.style.display = 'inline';
    mantag.style.display = 'inline';
    manfig.style.display = 'inline';
    manfig.href = manufacturerURLs[manufacturer] || "#";
  } else {
    mansep.style.display = 'none';
    mantag.style.display = 'none';
    manfig.style.display = 'none';
  }

  const link = document.getElementById('figureName');
  if (url && url !== "") {
    link.href = `https://myanimeshelf.com${url}`;
    link.target = "_blank";
  } else {
    link.removeAttribute("href");
    link.removeAttribute("target");
  }

  sfx_roll.currentTime = 0;
  sfx_roll.play();

  const searchAnime = document.getElementById('search_anime');
  const searchCharacter = document.getElementById('search_chara');
  const separatorAnime = document.getElementById('anisep');
  const separatorCharacter = document.getElementById('charsep');
  if (anime !== "no anime avalaible") {
    searchAnime.style.display = "inline";
    separatorAnime.style.display = "inline";
    searchAnime.href = `https://myanimelist.net/anime.php?q=${encodeURIComponent(anime.split(",")[0])}&cat=anime`;
  } else {
    searchAnime.style.display = "none";
    separatorAnime.style.display = "none";
  }
  if (character !== "no character(s) avalaible") {
    searchCharacter.style.display = "inline";
    separatorCharacter.style.display = "inline";
    searchCharacter.href = `https://myanimelist.net/character.php?q=${encodeURIComponent(character.split(",")[0])}&cat=character`;
  } else {
    searchCharacter.style.display = "none";
    separatorCharacter.style.display = "none";
  }
  
  const img = document.getElementById('figureImage');
  img.innerHTML = f.image
  ? `<img src="https://myanimeshelf.com${f.image}" alt="${name}" class="clickable-img" style="border-radius:10px;max-width:100%;height:auto;">`
  : "?";
});

const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
document.addEventListener("click", e => {
  if (e.target.classList.contains("clickable-img")) {
    modal.style.display = "block";
    modalImg.src = e.target.src;
  }
});
document.querySelector(".close").onclick = () => modal.style.display = "none";

// manufacturer list with each url associated to it.
// this list is used by the "manufacturer" search feature to link to the correct manufacturer.
// pls ignore
const manufacturerURLs = {
  "AMAKUNI": "https://amakuni.info/",
  "APEX-TOY": "http://www.apex-toy.com/",
  "Alphamax": "https://alphamax.jp/",
  "Alter": "https://www.alter-web.jp/",
  "Amiami Zero": "https://www.amiami.jp/eng/",
  "Aniplex": "https://www.aniplexplus.com/",
  "Aoshima": "https://www.aoshima-bk.co.jp/",
  "Arma Bianca": "https://armabianca.com/",
  "Avengerz Inc.": "https://avengerz.co.jp/",
  "Azone International": "https://www.azone-int.co.jp/",
  "B'full": "https://www.fots.jp/",
  "BINDing": "https://native-store.net/en/category/binding-creators-opinion",
  "Bandai": "https://www.bandai.co.jp/",
  "Bandai Namco Entertainment Inc. (NBGI)": "https://www.bandainamcoent.co.jp/",
  "Bandai Spirits": "https://www.bandaispirits.co.jp/",
  "Banpresto": "https://sn.bpnavi.jp/toru-toru/",
  "Bellfine": "https://bellfine.co.jp/",
  "Benelic": "https://benelic.com/",
  "Broccoli": "https://www.broccoli.co.jp/",
  "Bushiroad": "https://bushiroad.com/en/",
  "CCP": "https://ccp.jp/",
  "Caravan": "http://caravan-inc.co.jp/",
  "Contents Seed": "https://contents-seed.co.jp/",
  "Cospa": "https://www.cospa.com/",
  "Daiki Kougyo": "http://www.daikikougyo.co.jp/",
  "Dark Horse": "https://www.darkhorse.com/",
  "Design Co-Co": "https://designcoco.co.jp/",
  "Diamond Select": "https://www.diamondselecttoys.com/",
  "E2046": "https://www.e2046.com/",
  "ENSOUTOYS": "http://www.ensoutoys.com/",
  "Ensky": "https://www.ensky.co.jp/",
  "F-toys": "https://www.f-toys.net/",
  "FLARE": "http://www.flare-corp.jp/",
  "FREEing": "https://www.freeing.co.jp/",
  "Figurama Collectors": "https://figurama-collectors.com/",
  "First 4 Figures": "https://www.first4figures.com/",
  "FuRyu": "https://www.furyu.jp/prize/",
  "Funko": "https://funko.com/",
  "Gift": "http://www.gift-gift.jp/",
  "Good Smile Company": "https://www.goodsmile.com/en",
  "Groove Garage": "https://groovegarage.jp/",
  "HOBBY STOCK": "http://www.hobbystock.jp/",
  "Hakusensha": "https://www.hakusensha.co.jp/",
  "Hasegawa": "https://www.hasegawa-model.co.jp/",
  "Heavy Gauge": "http://www.heavygauge.co.jp/",
  "Hobby Max": "http://hobbymax.co.jp/",
  "Individual sculptor": "#",
  "Infinity Studio": "https://www.infinitystatue.com/",
  "Insight": "http://www.insight-inc.jp/",
  "Kadokawa": "https://store.kadokawa.co.jp/shop/c/c_30/",
  "Kaitendoh": "http://kaitendoh.com/",
  "Kaiyodo": "https://kaiyodo.co.jp/",
  "Kitsune Statue": "https://kitsunestatue.com/",
  "Koei": "https://shop.gamecity.ne.jp/",
  "Kotobukiya": "https://www.kotobukiya.co.jp/",
  "LAWSON": "https://www.lawson.jp/en/",
  "Luminous Box": "https://weibo.com/luminousbox",
  "MIMEYOI": "https://mimeyoi.com/",
  "Max Factory": "https://www.maxfactory.jp/ja/mxf/",
  "Medicos Entertainment": "https://www.medicos-e.net/",
  "MegaHouse": "https://www.megahouse.co.jp/",
  "Movic": "https://www.movic.jp/",
  "Myethos": "http://www.myethos.hk/",
  "Native": "https://www.native-web.jp/",
  "Nihon TV Service": "https://www.ntv.co.jp/goods/",
  "Oniri Créations": "https://oniri-creations.com/",
  "Orange Rouge": "https://orangerouge.com/",
  "Orca Toys": "http://www.orcatoys.com/",
  "Orchid Seed": "http://www.orchidseed.co.jp/",
  "Our Treasure": "http://ourtreasure.co.jp/",
  "PLUM": "https://www.pmoa.co.jp/",
  "PROOF": "https://proof-chara.com/",
  "PROSTO toys": "https://prostostore.ru/",
  "Penguin Parade": "http://www.penguinparade.jp/",
  "Phat": "https://phatcompany.jp/",
  "Pink Cat": "https://www.pinkcat-web.com/",
  "Plex": "https://www.plex-web.com/",
  "Prime 1 Studio": "https://www.prime1studio.com/",
  "PureArts": "https://www.purearts.com/",
  "Q-six": "http://www.q-six.jp/",
  "RIBOSE": "https://www.ribose.com.cn/",
  "Re-Ment": "https://www.re-ment.co.jp/",
  "Revolve": "http://www.revolve.ac/",
  "Riot Games": "https://merch.riotgames.com/",
  "Rocket Boy": "https://www.rocket-boy.com/",
  "S-Mist": "https://www.s-mist.jp/",
  "Sega": "https://segaplaza.jp/",
  "Sentinel": "http://www.sentinel-toys.com/",
  "Showa Note": "https://www.showa-note.co.jp/",
  "SkyTube": "https://skytube.jp/",
  "Sony Interactive Entertainment": "https://gear.playstation.com/",
  "Souyokusha": "https://souyokusha.com/",
  "Square Enix": "https://store.jp.square-enix.com/merchandise",
  "Storm Collectibles": "https://www.stormcollectibles.com/",
  "Stronger": "http://stronger.co.jp/",
  "Sum-Art": "https://www.sumart.co.jp/",
  "System Service": "https://fans.co.jp/",
  "Taito": "https://www.taito.co.jp/prize",
  "Takara Tomy A.R.T.S": "https://www.takaratomy-arts.co.jp/",
  "Toei Animation": "https://store.toei-anim.co.jp/",
  "Tomytec": "https://www.tomytec.co.jp/",
  "Underdog Squad": "https://myfigurecollection.net/entry/52298",
  "Union Creative International Ltd": "https://union-creative.jp/",
  "Vertex": "https://www.vertex-figure.com/",
  "Volks": "https://www.volks.co.jp/",
  "WING": "https://www.wing-kai.com/",
  "Wanderer": "http://wanderer.jp/",
  "Wani Books": "https://www.wani.co.jp/",
  "Wave": "https://www.hobby-wave.com/",
  "Wonderful Works": "https://www.wonderfulworks.co.jp/",
  "Xebec Toys": "https://www.lulu-berlu.com/our-brands/xebec-toys-c1515-en.html",
  "Zero-G Act": "http://zerogact.com/",
  "eStream": "https://estream.co.jp/",
  "ques Q": "https://www.quesq.net/",
  "threezero": "https://www.threezerohk.com/",
  "Unknown": "#"
};