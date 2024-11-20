// 1
window.onload = (e) => 
    { document.querySelector("#search").onclick = searchButtonClicked;
        document.querySelector("#next").onclick = nextButtonClicked;
        document.querySelector("#back").onclick = backButtonClicked;
     };

// 2
let displayTerm = "";
let GIPHY_KEY = "V9rK692HR8uMfjk7g5LLHFFV4Hw70M5i";
let currentPageOffset = 0;

let history = [];
let favImagesIDs = [];

// 3
function searchButtonClicked() {
    console.log("searchButtonClicked() called");

    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    term = term.trim();

    term = encodeURIComponent(term);

    if (term.length < 1) return;

    url += "&q=" + term;

    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;
    currentPageOffset = 0;

    document.querySelector("#status").innerHTML = "<b>Searching for '" +
        displayTerm + "'<b>";

    console.log(url);
    history.push(term);
    console.group(history);
    getData(url);
}

// 3
function nextButtonClicked() {
    console.log("searchButtonClicked() called");

    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7"

    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    term = term.trim();

    term = encodeURIComponent(term);

    if (term.length < 1) return;

    url += "&q=" + term;

    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    currentPageOffset += parseInt(limit);
    console.log(currentPageOffset);

    url += `&offset=${currentPageOffset}`
    getData(url);
}

function backButtonClicked() {
    console.log("searchButtonClicked() called");

    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7"

    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    term = term.trim();

    term = encodeURIComponent(term);

    if (term.length < 1) return;

    url += "&q=" + term;

    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    if (currentPageOffset - parseInt(limit) > 0){
        currentPageOffset -= parseInt(limit);
        url += `&offset=${currentPageOffset}`
    }
    getData(url);
}

function getData(url) {
    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;
    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e) {
    let xhr = e.target;

    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    if (!obj.data || obj.data.legnth == 0) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" +
            displayTerm + "'</b>";
        return;
    }

    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = "<p><i>Here are " + results.length + " results for '" +
        displayTerm + "'</i></p>";

    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        let smallURL = result.images.fixed_width_small.url;
        if (!smallURL) smallURL = "images/no-image-found.png";

        let url = result.url;

        let line = `<div class='result'><img src='${smallURL}' title= '${result.id}' />`;
        line += `<span><a target='_blank' href='${url}'>View on Giphy</a></span>
				<p>Rating: ${result.rating.toUpperCase()}</p></div>`;
        bigString += line;
    }

    document.querySelector("#content").innerHTML = bigString;

    document.querySelector("#status").innerHTML = "<b>Success!</b>";

}

function dataError(e) {
    console.log("An error occurred");
}