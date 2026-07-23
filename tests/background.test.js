const {
	CONTEXT_MENUS,
	getWebsites,
	createContextMenus,
	handleContextMenuClick,
	setupBackground
} = require('../background');
const { mediaWebsites, songWebsites, gameWebsites } = require('../script');

describe('Background script context menu logic', () => {
	let originalChrome;

	beforeEach(() => {
		originalChrome = global.chrome;
		global.chrome = {
			contextMenus: {
				removeAll: jest.fn(callback => callback && callback()),
				create: jest.fn(),
				onClicked: {
					addListener: jest.fn()
				}
			},
			runtime: {
				onInstalled: {
					addListener: jest.fn()
				},
				onStartup: {
					addListener: jest.fn()
				}
			},
			tabs: {
				create: jest.fn()
			}
		};
	});

	afterEach(() => {
		global.chrome = originalChrome;
		delete globalThis.mediaWebsites;
		delete globalThis.songWebsites;
		delete globalThis.gameWebsites;
	});

	test('getWebsites returns correct array based on menuItemId', () => {
		expect(getWebsites(CONTEXT_MENUS.MEDIA)).toEqual(mediaWebsites);
		expect(getWebsites(CONTEXT_MENUS.SONG)).toEqual(songWebsites);
		expect(getWebsites(CONTEXT_MENUS.GAME)).toEqual(gameWebsites);
		expect(getWebsites('unknown-id')).toEqual([]);
	});

	test('getWebsites retrieves lists from globalThis when present', () => {
		globalThis.mediaWebsites = ['https://globalmedia.com/'];
		globalThis.songWebsites = ['https://globalsong.com/'];
		globalThis.gameWebsites = ['https://globalgame.com/'];

		expect(getWebsites(CONTEXT_MENUS.MEDIA)).toEqual(['https://globalmedia.com/']);
		expect(getWebsites(CONTEXT_MENUS.SONG)).toEqual(['https://globalsong.com/']);
		expect(getWebsites(CONTEXT_MENUS.GAME)).toEqual(['https://globalgame.com/']);
	});

	test('createContextMenus creates parent menu and submenus after removeAll', () => {
		createContextMenus();

		expect(global.chrome.contextMenus.removeAll).toHaveBeenCalled();
		expect(global.chrome.contextMenus.create).toHaveBeenCalledTimes(4);

		expect(global.chrome.contextMenus.create).toHaveBeenCalledWith({
			id: 'multisearch-parent',
			title: 'Multisearch',
			contexts: ['selection']
		});

		expect(global.chrome.contextMenus.create).toHaveBeenCalledWith({
			id: CONTEXT_MENUS.MEDIA,
			parentId: 'multisearch-parent',
			title: 'Search Media',
			contexts: ['selection']
		});

		expect(global.chrome.contextMenus.create).toHaveBeenCalledWith({
			id: CONTEXT_MENUS.SONG,
			parentId: 'multisearch-parent',
			title: 'Search Songs',
			contexts: ['selection']
		});

		expect(global.chrome.contextMenus.create).toHaveBeenCalledWith({
			id: CONTEXT_MENUS.GAME,
			parentId: 'multisearch-parent',
			title: 'Search Games',
			contexts: ['selection']
		});
	});

	test('createContextMenus does not crash if chrome or contextMenus is undefined', () => {
		delete global.chrome;
		expect(() => createContextMenus()).not.toThrow();
	});

	test('handleContextMenuClick opens tabs for Media searches', () => {
		const info = {
			menuItemId: CONTEXT_MENUS.MEDIA,
			selectionText: 'Inception'
		};
		handleContextMenuClick(info);

		expect(global.chrome.tabs.create).toHaveBeenCalledTimes(mediaWebsites.length);
		mediaWebsites.forEach(site => {
			expect(global.chrome.tabs.create).toHaveBeenCalledWith({
				url: site + 'Inception'
			});
		});
	});

	test('handleContextMenuClick opens tabs for Song searches with URL encoding', () => {
		const info = {
			menuItemId: CONTEXT_MENUS.SONG,
			selectionText: 'hello world & extra'
		};
		handleContextMenuClick(info);

		expect(global.chrome.tabs.create).toHaveBeenCalledTimes(songWebsites.length);
		const encoded = encodeURIComponent('hello world & extra');
		songWebsites.forEach(site => {
			expect(global.chrome.tabs.create).toHaveBeenCalledWith({
				url: site + encoded
			});
		});
	});

	test('handleContextMenuClick opens tabs for Game searches', () => {
		const info = {
			menuItemId: CONTEXT_MENUS.GAME,
			selectionText: 'Zelda'
		};
		handleContextMenuClick(info);

		expect(global.chrome.tabs.create).toHaveBeenCalledTimes(gameWebsites.length);
		gameWebsites.forEach(site => {
			expect(global.chrome.tabs.create).toHaveBeenCalledWith({
				url: site + 'Zelda'
			});
		});
	});

	test('handleContextMenuClick ignores empty or missing selection', () => {
		handleContextMenuClick(null);
		handleContextMenuClick({});
		handleContextMenuClick({ selectionText: '   ' });

		expect(global.chrome.tabs.create).not.toHaveBeenCalled();
	});

	test('handleContextMenuClick does not crash if chrome or tabs is undefined', () => {
		delete global.chrome;
		const info = {
			menuItemId: CONTEXT_MENUS.MEDIA,
			selectionText: 'Inception'
		};
		expect(() => handleContextMenuClick(info)).not.toThrow();
	});

	test('setupBackground adds listener for runtime and contextMenus events', () => {
		setupBackground();

		expect(global.chrome.runtime.onInstalled.addListener).toHaveBeenCalledWith(createContextMenus);
		expect(global.chrome.runtime.onStartup.addListener).toHaveBeenCalledWith(createContextMenus);
		expect(global.chrome.contextMenus.onClicked.addListener).toHaveBeenCalledWith(handleContextMenuClick);
	});

	test('setupBackground handles missing chrome object gracefully', () => {
		delete global.chrome;
		expect(() => setupBackground()).not.toThrow();
	});
});
