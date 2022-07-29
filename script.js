document.getElementById("mediaButton").addEventListener("click", open_media_tabs);
document.getElementById("songButton").addEventListener("click", open_song_tabs);

function open_media_tabs() {
    let search_value = document.getElementById("mediaSearch").value;
    if (search_value != "") {
        window.open('https://letterboxd.com/search/'+search_value);
        window.open('https://trakt.tv/search?query='+search_value);
        window.open('https://myanimelist.net/search/all?q='+search_value);
        window.open('https://mydramalist.com/search?q='+search_value);
    }
}

function open_song_tabs() {
    let search_value = document.getElementById("songSearch").value;
    if (search_value != "") {
        window.open('https://chorus.fightthe.pw/search?query='+search_value);
        window.open('https://bsaber.com/?s='+search_value)
    }
}