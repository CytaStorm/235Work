let history = [];
let favImages = [];
let favDropDownMenu;
let histDropDownMenu;

let loadFavoriteImages = () => {
    favImages = JSON.parse(localStorage.getItem("favImages"));
    if (favImages === null){
        favImages = [];
    }
    //console.log("here " + favImages);
    else {
        //console.log(favImages);
        for (const fav of favImages) {
            loadFavorite({id: fav.id, imgSrcURL: fav.imgSrcURL, imgURL: fav.imgURL});
        }
    }
}

let loadHistoryStartup = () => {
	history = JSON.parse(localStorage.getItem("history"));
	if (history === null) {
		history = [];
	}
	else {
		for (const hist of history){
			loadHistory(hist);
		}
	}
}
// 1
window.onload = (e) => 
    {
        favDropDownMenu = document.querySelector("#favorites-content")
        histDropDownMenu = document.querySelector("#history-content")
        document.querySelector("#search").onclick = searchButtonClicked;
        document.querySelector("#next").onclick = nextButtonClicked;
        document.querySelector("#back").onclick = backButtonClicked;
		loadFavoriteImages();
		loadHistoryStartup();
     };

// 2
let displayTerm = "";
let GIPHY_KEY = "V9rK692HR8uMfjk7g5LLHFFV4Hw70M5i";
let currentPageOffset = 0;

let loadFavorite = (e) => {
	
	let newDiv = document.createElement("div");

    //Fav link
	let newLink = document.createElement("a");
	newLink.href = e.imgURL;
    newLink.target = "_blank";

	let newImg = document.createElement("img");
	newImg.src = e.imgSrcURL;

    //Remove fav button
    let removeButton = document.createElement("button");
    removeButton.onclick = (a) => {
        favDropDownMenu.removeChild(removeButton.parentElement);
        favImages = favImages.filter((e) => e.id != newLink.innerHTML);
        //console.log(favImages);

        // find existing fav image in search result, uncheck the fav star
        const children = document.querySelector("#content").childNodes;
        for (const searchResult of children){
            const img =   // span
                          searchResult.childNodes[0].
                          // a
                          childNodes[0].
                          //img
                          childNodes[0];
            if (img.title = e.id) {
                //checkbox
                searchResult.childNodes[1].checked = false;
                break;
            }
        }
        let jsonedList = JSON.stringify(favImages);
        localStorage.setItem("favImages", jsonedList);
    }

	favDropDownMenu.appendChild(newDiv);
	newLink.appendChild(newImg);
    newDiv.appendChild(removeButton);
	newDiv.appendChild(newLink);
}

let addToFavorites = (e) => {
	const exists = (element) => element.id === e.id;
    if (favImages.some(exists)){
		return;
    }
    loadFavorite(e);
    favImages.push(e);

    let jsonedList = JSON.stringify(favImages);
    localStorage.setItem("favImages", jsonedList);
}

let loadHistory = (e) => {
	let newDiv = document.createElement("div");
    //Fav link
	let newLink = document.createElement("a");
	newLink.href = "#";
	newLink.innerHTML = e;

	newDiv.appendChild(newLink);
	histDropDownMenu.prepend(newDiv);
}

let addToHistory = (e) => {
	loadHistory(e);
	history.push(e);

    let jsonedHistory = JSON.stringify(history);
    localStorage.setItem("history", jsonedHistory);
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

    //console.log(url);
    addToHistory(term);
    getData(url);
}

// 3
function nextButtonClicked() {
    if (document.querySelector(".result") === null){
        //console.log("next button clicked, ignore");
        return;
    }
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7"

    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    let term = history[history.length - 1];
    displayTerm = term;

    term = term.trim();

    term = encodeURIComponent(term);

    if (term.length < 1) return;

    url += "&q=" + term;

    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    currentPageOffset += parseInt(limit);
    //console.log(currentPageOffset);

    url += `&offset=${currentPageOffset}`
    getData(url);
}

function backButtonClicked() {
    if (document.querySelector(".result") === null){
        return;
    }
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7"

    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    let term = history[history.length - 1];
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
    //console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    if (!obj.data || obj.data.legnth == 0) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" +
            displayTerm + "'</b>";
        return;
    }

    let results = obj.data;
    //console.log("results.length = " + results.length);
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

        let newSpan = document.createElement("span");
        let newLink = document.createElement("a");
        newLink.target = "_blank";
        newLink.href = url;
        
        let newImg = document.createElement("img");
        newImg.src = smallURL;
        newImg.title = result.id;

        newLink.appendChild(newImg);
        newSpan.appendChild(newLink);
        newDiv.appendChild(newSpan);

        let star = document.createElement("input");
        star.className = "favButton";
        star.type = "checkbox";
        for (const fav of favImages) {
            if (fav.id == result.id){
                star.checked = true;
            }
        }
        star.onclick = () => addToFavorites({id: result.id, imgSrcURL: smallURL, imgURL: url});
        newDiv.appendChild(star);

        document.querySelector("#content").appendChild(newDiv);
    }

    document.querySelector("#status").innerHTML = "<b>Success!</b>";
}


function dataError(e) {
    console.log("An error occurred");
}