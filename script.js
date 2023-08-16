const mediaWebsites = [
  'https://letterboxd.com/search/',
  'https://trakt.tv/search?query=',
  'https://myanimelist.net/search/all?q=',
  'https://mydramalist.com/search?q='
];

const songWebsites = [
	'https://chorus.fightthe.pw/search?query=',
	'https://bsaber.com/?s='
];

const mediaButton = document.getElementById("mediaButton");
const songButton = document.getElementById("songButton");
const mediaSearch = document.getElementById("mediaSearch");
const songSearch = document.getElementById("songSearch");

function openTabs(websites, searchElement) {
  const searchValue = searchElement.value;

  if (!searchValue) return;

  websites.forEach(website => window.open(website + encodeURIComponent(searchValue)));
}

mediaButton.addEventListener("click", () => openTabs(mediaWebsites, mediaSearch));
songButton.addEventListener("click", () => openTabs(songWebsites, songSearch));
