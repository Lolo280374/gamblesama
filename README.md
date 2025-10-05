<p align=center><br>
<a href="https://github.com/Lolo280374/gambleSama"><img src="https://hackatime-badge.hackclub.com/U09CBF0DS4F/gambleRightNow"></a>
<a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
<a href="https://devrant.com/rants/4149950/i-fucking-hate-mobile-development-i-already-manage-the-data-devops-infra-and-mos"><img src="https://img.shields.io/badge/not_optimized-for_mobile-red"></a>
<br></p>

<h3 align="center">
you've got money? coins? you love anime? gamble on which next figurine you should buy! made possible thx to <a href="https://myanimeshelf.com/figures/">myAnimeShelf!!1</a>
</h3>

<h1 align="center">
	screenshots
</h1>

<img width="2560" height="1440" alt="Copie d'écran_20251005_151713" src="https://github.com/user-attachments/assets/30606cbd-a50a-460a-81ee-572cf4c89095" />
<img width="2560" height="1440" alt="Copie d'écran_20251005_151913" src="https://github.com/user-attachments/assets/5707db8f-7e90-4136-84b1-85aface697cd" />

<br>

> [!IMPORTANT]  
> the database used for listing figurines does not filter mature content (NSFW) from SFW content. this can mean some figurines in this website could be considered "not safe for work" by some.
> <br>i tried to delete (most) of the NSFW ones so you could use this site correctly, but due to the amount of figurines, i couldn't get them all.
> <br>if you care about this, you should heavily search for animes that are known for SFW content (e.g: Blue Lock, Wind Breaker, Demon Slayer, ...).
> <br>you have been warned! viewer discretion is advised.

## table of contents

- [about ai usage](#about-ai-usage)
- [about](#about)
- [statistics](#statistics)
- [listed manufacturers](#manufacturers)
- [contributing](#contributing)
- [reporting issues](#reporting-issues)
- [credits](#credits)
- [license](#license)

## about ai usage
this project has used AI for all the parts involving python scripts (the dataset folder basically); meaning the scraper, the manufacturer and count finder, and nsfw removers have been made using AI, for the simple reason that I was way too lazy to do Python for something that could be done in half a second. (and cuz I really didn't know where to get started with scrapers.)
<br>that being said, these do go under the 30% rule. (especially since we don't see or use these Python files anyway in the actual usage of the software).

## about
this project has been made for the Siege event, at HackClub! the theme this week was to make "something" with coins. i'll be honest, i really had no idea. and i was watching anime, and i thought, well i could just make a gambling site for finding anime figurines, and that's how it started...
<br>(i got the idea mostly because i love collectioning figurines, from any kind of anime really)
so i guess this uses coins.. in a way? 

<br>i'm not gonna add a usage tab just for a web demo link, just click [here to get started with the project lmao](https://gamblesama.lolodotzip.tech/)

## statistics
for reference, in total, there are 2794 figurines that are picked randomly from the dataset i curated.
<br>here are the amount of figurines for every anime, from the top 20 animes with the most amount of them:
<img width="1150" height="651" alt="graph" src="https://github.com/user-attachments/assets/6a38c276-aeeb-4d1e-997a-af3d0a6cf2db" />
<br>you can get the full list by clicking [here](https://cdn.lolodotzip.tech/dataset_gambleSama/anime_counts.csv).

## manufacturers
this dataset has about 114 manufacturers referenced. to view the full list of manufacturers, please click [here.](https://cdn.lolodotzip.tech/dataset_gambleSama/manufacturers.txt)
<br>(there's just too many and a readme isn't meant to be a book lmao?)

## contributing
to contribute, you can simply git clone this repository, and start editing the main HTML file of this project:

```sh
git clone https://github.com/Lolo280374/gamblesama.git
cd gamblesama
```

and you may then request your modifications via a PR.

## reporting issues
this is a community project, and your help is very much appreciated! if you notice anything wrong during your usage of this software, please report it to the [GitHub issues page](https://github.com/Lolo280374/gamblesama/issues/)!

## credits
many thanks to these who without them, the project may have never seen the light of day:
<br> - [myAnimeShelf](https://myanimeshelf.com/) - main database, used for collecting the information about the figurines (images, anime, characters, etc...)
<br> - [myAnimeList](https://myanimelist.net/) - used as the search for animes, and characters
<br> - [catbox.moe](https://catbox.moe) - used as a source for the images on the footer! many thanks (i couldn't find any lowk)!!
<br> - [ExchangeRate API](https://open.er-api.com/v6/latest) - used for calculating conversion rates from JPY!

## license
this project is licensed under the MIT License, which you may check [here](https://github.com/Lolo280374/gamblesama/blob/master/LICENSE/).
<br>if you have any questions about this project, please reach me [at lolodotzip@hackclub.app](mailto:lolodotzip@hackclub.app).
