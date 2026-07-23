if (typeof importScripts === 'function') {
	importScripts('script.js');
}

const CONTEXT_MENUS = {
	MEDIA: 'multisearch-media',
	SONG: 'multisearch-song',
	GAME: 'multisearch-game'
};

let websitesModule;

function getWebsites(menuItemId) {
	let mediaList = globalThis.mediaWebsites;
	let songList = globalThis.songWebsites;
	let gameList = globalThis.gameWebsites;

	if (!mediaList && typeof require !== 'undefined') {
		if (!websitesModule) {
			websitesModule = require('./script');
		}
		mediaList = websitesModule.mediaWebsites;
		songList = websitesModule.songWebsites;
		gameList = websitesModule.gameWebsites;
	}

	if (menuItemId === CONTEXT_MENUS.MEDIA) {
		return mediaList || [];
	}
	if (menuItemId === CONTEXT_MENUS.SONG) {
		return songList || [];
	}
	if (menuItemId === CONTEXT_MENUS.GAME) {
		return gameList || [];
	}
	return [];
}

function createContextMenus() {
	if (globalThis.chrome?.contextMenus) {
		globalThis.chrome.contextMenus.removeAll(() => {
			chrome.contextMenus.create({
				id: 'multisearch-parent',
				title: 'Multisearch',
				contexts: ['selection']
			});

			chrome.contextMenus.create({
				id: CONTEXT_MENUS.MEDIA,
				parentId: 'multisearch-parent',
				title: 'Search Media',
				contexts: ['selection']
			});

			chrome.contextMenus.create({
				id: CONTEXT_MENUS.SONG,
				parentId: 'multisearch-parent',
				title: 'Search Songs',
				contexts: ['selection']
			});

			chrome.contextMenus.create({
				id: CONTEXT_MENUS.GAME,
				parentId: 'multisearch-parent',
				title: 'Search Games',
				contexts: ['selection']
			});
		});
	}
}

function handleContextMenuClick(info, tab) {
	if (!info?.selectionText) return;
	const query = info.selectionText.trim();
	if (!query) return;

	const websites = getWebsites(info.menuItemId);

	for (const website of websites) {
		globalThis.chrome?.tabs?.create?.({ url: website + encodeURIComponent(query) });
	}
}

function setupBackground() {
	globalThis.chrome?.runtime?.onInstalled?.addListener(createContextMenus);
	globalThis.chrome?.runtime?.onStartup?.addListener(createContextMenus);
	globalThis.chrome?.contextMenus?.onClicked?.addListener(handleContextMenuClick);
}

setupBackground();

if (typeof module !== 'undefined' && module?.exports) {
	module.exports = {
		CONTEXT_MENUS,
		getWebsites,
		createContextMenus,
		handleContextMenuClick,
		setupBackground
	};
}
