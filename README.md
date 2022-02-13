<p align="center">
    <a href="https://github.com/TaoLinShowdown/aniMinder">
        <img src="public/mangaquizlogo_light.svg" alt="logo" width="128" height="128">
    </a>
    <h3 align="center">Manga Guessr</h3>
</p>

## About

Manga Guessr is a manga quiz game built with NextJS.  
All manga data (titles, covers, pages, tags, etc.) are taken from the MangaDex API.  
Play here: [mangaguessr.com](https://mangaguessr.com)

## Features

### Multiple Choice/Autocomplete

Manga Guessr supports both multiple choice and autocomplete for a more difficult experience.  
When using multiple choice and filtering by tags, suggested titles will be relevant to the tags chosen.

### Tags

One option to generate mangas for a game is by filtering through tags. Tags are filtered with an OR operator, so filtering by Isekai and Romance will return mangas with either the Isekai or Romance tag. The list of tags is a combination of MangaDex's genres and themes tags. When filtering by tags, players also have the option to filter mangas by min/max release year, min/max rating, and minimum number of followers on MangaDex.

Some issues can arise when filter settings are too restrictive, sometimes resulting in no manga generated. Avoid this by adding more tags or giving more leeway to the year/rating/follower filters. 

### MDLists

The second option to generate mangas is by providing one or more MDLists. MDLists are lists created on MangaDex [here](https://mangadex.org/my/lists). Players can put whatever manga they want here. Since Manga Guessr only stores Japanese manga in its database, this could be useful if a game with manhua or donghua is desired. 

### Saving Settings

Filter settings can be saved through the browser's localstorage for ease of use.

### Statistics

Manga Guessr also stores statistics for the most played, most correct, and least correct mangas. As more games are played more interesting results can be seen.

## Server

Backend is built with Express and PostgreSQL hosted on Heroku  
Code can be found [here](https://github.com/TaoLinShowdown/manga-guessr-server)  
