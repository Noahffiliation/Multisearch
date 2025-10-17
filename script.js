const mediaWebsites = [
  'https://letterboxd.com/search/',
  'https://trakt.tv/search?query=',
  'https://myanimelist.net/search/all?q=',
  'https://mydramalist.com/search?q='
];

const songWebsites = [
	'https://www.enchor.us/?name=',
	'https://beatsaver.com/?q='
];

const gameWebsites = [
	'https://www.backloggd.com/search/games/',
	'https://store.steampowered.com/search/?term=',
  'https://store.playstation.com/en-us/search/',
	'https://www.gog.com/en/games?query=',
	'https://store.rockstargames.com/search?query=',
	'https://store.epicgames.com/en-US/expanded-search-results?q='
];

const mediaButton = document.getElementById("mediaButton");
const songButton = document.getElementById("songButton");
const gameButton = document.getElementById("gameButton");
const mediaSearch = document.getElementById("mediaSearch");
const songSearch = document.getElementById("songSearch");
const gameSearch = document.getElementById("gameSearch");

function openTabs(websites, searchElement) {
  const searchValue = searchElement.value;

  if (!searchValue) return;

	for (const website of websites) {
		window.open(website + encodeURIComponent(searchValue));
	}
}

mediaButton.addEventListener("click", () => openTabs(mediaWebsites, mediaSearch));
songButton.addEventListener("click", () => openTabs(songWebsites, songSearch));
gameButton.addEventListener("click", () => openTabs(gameWebsites, gameSearch));
