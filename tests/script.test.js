const { openTabs, handleFormSubmit, init, mediaWebsites, songWebsites, gameWebsites } = require('../script');

describe('Multisearch logic', () => {
    let searchElement;
    let originalOpen;

    beforeEach(() => {
        // Mock window.open
        originalOpen = window.open;
        window.open = jest.fn();

        // Set up our document body with forms and buttons
        document.body.innerHTML = `
      <form id="mediaForm">
        <input id="mediaSearch" value="test query" />
        <button type="submit" id="mediaButton"></button>
      </form>
      <form id="songForm">
        <input id="songSearch" value="song query" />
        <button type="submit" id="songButton"></button>
      </form>
      <form id="gameForm">
        <input id="gameSearch" value="game query" />
        <button type="submit" id="gameButton"></button>
      </form>
    `;
        searchElement = document.getElementById('mediaSearch');
    });

    afterEach(() => {
        window.open = originalOpen;
    });

    test('openTabs opens all websites with correct trimmed and encoded search value', () => {
        searchElement.value = '  test query  ';
        const websites = ['https://site1.com/', 'https://site2.com/'];
        openTabs(websites, searchElement);

        expect(window.open).toHaveBeenCalledTimes(2);
        expect(window.open).toHaveBeenCalledWith('https://site1.com/test%20query');
        expect(window.open).toHaveBeenCalledWith('https://site2.com/test%20query');
    });

    test('openTabs does nothing if search value is empty or only whitespace', () => {
        searchElement.value = '';
        openTabs(['https://site1.com/'], searchElement);
        expect(window.open).not.toHaveBeenCalled();

        searchElement.value = '   ';
        openTabs(['https://site1.com/'], searchElement);
        expect(window.open).not.toHaveBeenCalled();

        openTabs(['https://site1.com/'], null);
        expect(window.open).not.toHaveBeenCalled();

        openTabs(['https://site1.com/'], {});
        expect(window.open).not.toHaveBeenCalled();
    });

    test('handleFormSubmit calls preventDefault and openTabs', () => {
        const preventDefault = jest.fn();
        const event = { preventDefault };
        handleFormSubmit(event, ['https://site1.com/'], searchElement);

        expect(preventDefault).toHaveBeenCalled();
        expect(window.open).toHaveBeenCalledWith('https://site1.com/test%20query');
    });

    test('handleFormSubmit works when event is undefined or lacks preventDefault', () => {
        expect(() => handleFormSubmit(undefined, ['https://site1.com/'], searchElement)).not.toThrow();
        expect(window.open).toHaveBeenCalledWith('https://site1.com/test%20query');

        jest.clearAllMocks();
        expect(() => handleFormSubmit({}, ['https://site1.com/'], searchElement)).not.toThrow();
        expect(window.open).toHaveBeenCalledWith('https://site1.com/test%20query');
    });

    test('init sets up form submit event listeners correctly', () => {
        init();

        const mediaForm = document.getElementById('mediaForm');
        mediaForm.dispatchEvent(new Event('submit', { cancelable: true }));
        expect(window.open).toHaveBeenCalledTimes(mediaWebsites.length);
        mediaWebsites.forEach(site => {
            expect(window.open).toHaveBeenCalledWith(site + 'test%20query');
        });

        jest.clearAllMocks();

        const songForm = document.getElementById('songForm');
        songForm.dispatchEvent(new Event('submit', { cancelable: true }));
        expect(window.open).toHaveBeenCalledTimes(songWebsites.length);

        jest.clearAllMocks();

        const gameForm = document.getElementById('gameForm');
        gameForm.dispatchEvent(new Event('submit', { cancelable: true }));
        expect(window.open).toHaveBeenCalledTimes(gameWebsites.length);
    });

    test('init falls back to button click listeners if forms are missing', () => {
        document.body.innerHTML = `
          <input id="mediaSearch" value="test query" />
          <button id="mediaButton"></button>
          <input id="songSearch" value="song query" />
          <button id="songButton"></button>
          <input id="gameSearch" value="game query" />
          <button id="gameButton"></button>
        `;

        init();

        const mediaButton = document.getElementById('mediaButton');
        mediaButton.click();
        expect(window.open).toHaveBeenCalledTimes(mediaWebsites.length);

        jest.clearAllMocks();

        const songButton = document.getElementById('songButton');
        songButton.click();
        expect(window.open).toHaveBeenCalledTimes(songWebsites.length);

        jest.clearAllMocks();

        const gameButton = document.getElementById('gameButton');
        gameButton.click();
        expect(window.open).toHaveBeenCalledTimes(gameWebsites.length);
    });

    test('init handles forms present without search inputs', () => {
        document.body.innerHTML = `
          <form id="mediaForm"></form>
          <form id="songForm"></form>
          <form id="gameForm"></form>
        `;
        expect(() => init()).not.toThrow();
    });

    test('init handles buttons present without search inputs', () => {
        document.body.innerHTML = `
          <button id="mediaButton"></button>
          <button id="songButton"></button>
          <button id="gameButton"></button>
        `;
        expect(() => init()).not.toThrow();
    });

    test('init does not crash if elements are missing', () => {
        document.body.innerHTML = '';
        expect(() => init()).not.toThrow();
    });

    test('DOMContentLoaded listener registration when document is loading', () => {
        jest.isolateModules(() => {
            jest.resetModules();
            const addSpy = jest.spyOn(document, 'addEventListener');
            const originalReadyState = document.readyState;
            Object.defineProperty(document, 'readyState', {
                value: 'loading',
                configurable: true
            });

            require('../script');

            expect(addSpy).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));

            Object.defineProperty(document, 'readyState', {
                value: originalReadyState,
                configurable: true
            });
            addSpy.mockRestore();
        });
    });

    test('runs safely in environment without document (e.g. background service worker)', () => {
        jest.isolateModules(() => {
            jest.resetModules();
            const origDoc = global.document;
            delete global.document;

            expect(() => require('../script')).not.toThrow();

            global.document = origDoc;
        });
    });
});
