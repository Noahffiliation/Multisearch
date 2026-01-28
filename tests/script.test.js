const { openTabs, init, mediaWebsites, songWebsites, gameWebsites } = require('../script');

describe('Multisearch logic', () => {
    let searchElement;
    let originalOpen;

    beforeEach(() => {
        // Mock window.open
        originalOpen = window.open;
        window.open = jest.fn();

        // Set up our document body
        document.body.innerHTML = `
      <input id="mediaSearch" value="test query" />
      <button id="mediaButton"></button>
      <input id="songSearch" value="song query" />
      <button id="songButton"></button>
      <input id="gameSearch" value="game query" />
      <button id="gameButton"></button>
    `;
        searchElement = document.getElementById('mediaSearch');
    });

    afterEach(() => {
        window.open = originalOpen;
    });

    test('openTabs opens all websites with correct search value', () => {
        const websites = ['https://site1.com/', 'https://site2.com/'];
        openTabs(websites, searchElement);

        expect(window.open).toHaveBeenCalledTimes(2);
        expect(window.open).toHaveBeenCalledWith('https://site1.com/test%20query');
        expect(window.open).toHaveBeenCalledWith('https://site2.com/test%20query');
    });

    test('openTabs does nothing if search value is empty', () => {
        searchElement.value = '';
        openTabs(['https://site1.com/'], searchElement);

        expect(window.open).not.toHaveBeenCalled();
    });

    test('init sets up event listeners correctly', () => {
        init();

        const mediaButton = document.getElementById('mediaButton');
        mediaButton.click();
        expect(window.open).toHaveBeenCalledTimes(mediaWebsites.length);
        mediaWebsites.forEach(site => {
            expect(window.open).toHaveBeenCalledWith(site + 'test%20query');
        });

        jest.clearAllMocks();

        const songButton = document.getElementById('songButton');
        songButton.click();
        expect(window.open).toHaveBeenCalledTimes(songWebsites.length);

        jest.clearAllMocks();

        const gameButton = document.getElementById('gameButton');
        gameButton.click();
        expect(window.open).toHaveBeenCalledTimes(gameWebsites.length);
    });

    test('init does not crash if elements are missing', () => {
        document.body.innerHTML = '';
        expect(() => init()).not.toThrow();
    });
});
