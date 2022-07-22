document.getElementById("button").addEventListener("click", open_tabs);

function open_tabs() {
    let search_value = document.getElementById("searchBox").value;
    if (search_value != "") {
        window.open('https://letterboxd.com/search/'+search_value);
        window.open('https://trakt.tv/search?query='+search_value);
        window.open('https://myanimelist.net/search/all?q='+search_value);
        window.open('https://mydramalist.com/search?q='+search_value);
    }
}