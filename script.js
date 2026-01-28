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
	'https://www.notion.so/noahffiliation/61f7093e99ed455fb4e497d2da55873f?v=10901b25e6fa41be83893d27b81a58c9',
	'https://www.backloggd.com/search/games/',
	'https://store.steampowered.com/search/?term=',
	'https://store.playstation.com/en-us/search/',
	'https://www.gog.com/en/games?query=',
	'https://store.rockstargames.com/search?query=',
	'https://store.epicgames.com/en-US/browse?q='
];

function openTabs(websites, searchElement) {
	const searchValue = searchElement.value;

	if (!searchValue) return;

	for (const website of websites) {
		window.open(website + encodeURIComponent(searchValue));
	}
}

function init() {
	const mediaButton = document.getElementById("mediaButton");
	const songButton = document.getElementById("songButton");
	const gameButton = document.getElementById("gameButton");
	const mediaSearch = document.getElementById("mediaSearch");
	const songSearch = document.getElementById("songSearch");
	const gameSearch = document.getElementById("gameSearch");

	if (mediaButton && mediaSearch) {
		mediaButton.addEventListener("click", () => openTabs(mediaWebsites, mediaSearch));
	}
	if (songButton && songSearch) {
		songButton.addEventListener("click", () => openTabs(songWebsites, songSearch));
	}
	if (gameButton && gameSearch) {
		gameButton.addEventListener("click", () => openTabs(gameWebsites, gameSearch));
	}
}

// Only run init if we are in a browser environment with a document
if (typeof document !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		mediaWebsites,
		songWebsites,
		gameWebsites,
		openTabs,
		init
	};
}
