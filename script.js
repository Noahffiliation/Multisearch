const mediaWebsites = [
	'https://letterboxd.com/search/',
	'https://app.trakt.tv/search?m=media&q=',
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
	'https://store.playstation.com/en-us/search/'
];

function openTabs(websites, searchElement) {
	const searchValue = searchElement?.value?.trim();

	if (!searchValue) return;

	const encoded = encodeURIComponent(searchValue);
	for (const website of websites) {
		window.open(website + encoded);
	}
}

function handleFormSubmit(event, websites, searchElement) {
	if (event?.preventDefault) {
		event.preventDefault();
	}
	openTabs(websites, searchElement);
}

function init() {
	const mediaForm = document.getElementById("mediaForm");
	const songForm = document.getElementById("songForm");
	const gameForm = document.getElementById("gameForm");

	const mediaButton = document.getElementById("mediaButton");
	const songButton = document.getElementById("songButton");
	const gameButton = document.getElementById("gameButton");

	const mediaSearch = document.getElementById("mediaSearch");
	const songSearch = document.getElementById("songSearch");
	const gameSearch = document.getElementById("gameSearch");

	if (mediaForm && mediaSearch) {
		mediaForm.addEventListener("submit", (e) => handleFormSubmit(e, mediaWebsites, mediaSearch));
	} else if (mediaButton && mediaSearch) {
		mediaButton.addEventListener("click", (e) => handleFormSubmit(e, mediaWebsites, mediaSearch));
	}

	if (songForm && songSearch) {
		songForm.addEventListener("submit", (e) => handleFormSubmit(e, songWebsites, songSearch));
	} else if (songButton && songSearch) {
		songButton.addEventListener("click", (e) => handleFormSubmit(e, songWebsites, songSearch));
	}

	if (gameForm && gameSearch) {
		gameForm.addEventListener("submit", (e) => handleFormSubmit(e, gameWebsites, gameSearch));
	} else if (gameButton && gameSearch) {
		gameButton.addEventListener("click", (e) => handleFormSubmit(e, gameWebsites, gameSearch));
	}
}

// Only run init if we are in a browser environment with a document
/* istanbul ignore else */
if (typeof document !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
}

globalThis.mediaWebsites = mediaWebsites;
globalThis.songWebsites = songWebsites;
globalThis.gameWebsites = gameWebsites;

/* istanbul ignore next */
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		mediaWebsites,
		songWebsites,
		gameWebsites,
		openTabs,
		handleFormSubmit,
		init
	};
}
