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

// let dropButton = document.querySelector(".dropbtn");
// dropButton.onmouseover = (e) => {
	
// } 

let addToFavorites = (e, f) => {
    if (favImagesIDs.includes(e)){
		return;
    }
    favImagesIDs.push(e);
	let newDiv = document.createElement("div");
	let newImg = document.createElement("img");
	newImg.src = f.src;
	let newLink = document.createElement("a");
	newLink.href = "#";
	newLink.innerHTML = e;
	document.querySelector(".dropdown-content").appendChild(newDiv);
	newDiv.appendChild(newImg);
	newDiv.appendChild(newLink);
}
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

    document.querySelector("#content").textContent = '';
    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    if (!obj.data || obj.data.legnth == 0) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" +
            displayTerm + "'</b>";
        return;
    }

    let results = obj.data;
    console.log("results.length = " + results.length);
    document.querySelector("#results > p").remove();
    if (document.querySelectorAll("#resultText").length === 0){
        let resultTextDiv = document.createElement("p");
        resultTextDiv.id = "resultText";
        resultTextDiv.innerHTML = `<p><i>Here are ${results.length} results for '
        ${displayTerm}'</i></p>`

        document.querySelector("#results").insertBefore(resultTextDiv, document.querySelector("#content"));
    } else {
        document.querySelector("resultText").innerHTML = 
        `<p><i>Here are ${results.length} results for '${displayTerm}'</i>
        </p>`;
    }

    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        let smallURL = result.images.fixed_width_small.url;
        if (!smallURL) smallURL = "images/no-image-found.png";

        let url = result.url;

        let newDiv = document.createElement("div");
        newDiv.className = "result";

        let newImg = document.createElement("img");
        newImg.src = smallURL;
        newImg.title = result.id;
        newDiv.appendChild(newImg);

        let newSpan = document.createElement("span");
        let newLink = document.createElement("a");
        newLink.innerHTML = "View On Giphy";
        newLink.target = "_blank";
        newLink.href = url;
        newSpan.appendChild(newLink);
        
        newDiv.appendChild(newSpan);

        let newRating = document.createElement("p");
        newRating.innerHTML = `Rating: ${result.rating.toUpperCase()}`;
        newDiv.appendChild(newRating);

        let favoriteButton = document.createElement("button");
        favoriteButton.className = "favButton";
        favoriteButton.innerHTML = "Add to Favorites";
        favoriteButton.onclick = () => addToFavorites(result.id, newImg);
        newDiv.appendChild(favoriteButton);

        document.querySelector("#content").appendChild(newDiv);

    }

    document.querySelector("#status").innerHTML = "<b>Success!</b>";

}


function dataError(e) {
    console.log("An error occurred");
}