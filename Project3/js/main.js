import { WordBlock } from "./word.js";
import { Torch } from "./torch.js";
"use strict";
//Game Variables
//Resources
let garbageWordsAPI = "https://random-word-api.herokuapp.com/word?number=50";
let allLinesLink = "js/quotes.txt";
let assets;

let allLines = Array();
let garbageWords = Array();

//Level specific
let currentQuote = Array();
let fallingBlocks = Array();
let levelWordPool = Array();
let randomWordChance = 40;

//Logic
export let deltaTime;
let spawnInterval = 3;
let timeSinceLastSpawn = 0;

//GFX
const main = document.querySelector("#main");
export const app = new PIXI.Application();
globalThis.__PIXI_APP__ = app;
await app.init({ resizeTo: window, background: '#aaaaaa' })
main.appendChild(app.canvas);
export let gameScene;

app.ticker.add(gameLoop);


Setup();

/**
 * Sets up resources and starts the game
 */
async function Setup() {
    await SetGarbageWords();
    await SetQuotes();
    //Load sprites
    PIXI.Assets.addBundle("sprites", {
        torch: "images/torch.png"
    });
    assets = await PIXI.Assets.loadBundle("sprites");
    StartGame();
}

/**
 * Sets the array of possible quotes to pick from
 */
async function SetQuotes() {
    let FetchQuotes = async () => (await fetch(allLinesLink)).text();
    allLines = ((await FetchQuotes()).split("\n"));
}

/**
 * Sets the array of garbage, filler words.
 */
async function SetGarbageWords() {
    let FetchGarbageWords = async () => (await fetch(garbageWordsAPI)).json();
    garbageWords = await FetchGarbageWords();
}

/**
 * Starts the game
 */
async function StartGame() {
    gameScene = new PIXI.Container();
    app.stage.addChild(gameScene);
    NewLevel()
}

/**
 * Main Game loop
 */
function gameLoop() {
    deltaTime = 1 / app.ticker.FPS;

    timeSinceLastSpawn += deltaTime;
    //Spawn blocks according to time and words left
    if (timeSinceLastSpawn >= spawnInterval && 
        levelWordPool.length != 0){
        SpawnTextBlock(levelWordPool.shift());
    }
}

function SpawnTextBlock(text) {
    spawnInterval = Math.random() * 2 + 3
    let newBlock = new WordBlock(text);
    gameScene.addChild(newBlock);
    app.ticker.add(newBlock.descend);
    timeSinceLastSpawn = 0;
}

/**
 * Sets up level
 */
function NewLevel() {
    GenerateLevelWordPool();
    let torch = new Torch(assets.torch);
    gameScene.addChild(torch);
    app.ticker.add(torch.followMouse);
}


/**
 * Generates word pool for the level.
 */
function GenerateLevelWordPool() {
    currentQuote = GetNewQuote().trim().split(' ');
    let wordPoolQuote = [...currentQuote];

    //Create word spawn order in level
    //50/50 chance next word to spawn will be garbage
    while (wordPoolQuote.length != 0) {
        let wordPoolRoll = Math.floor(Math.random() * 101);
        const isGarbageWord = wordPoolRoll <= randomWordChance;
        if (isGarbageWord) {
            levelWordPool.push(garbageWords[Math.floor(Math.random() * garbageWords.length)]);
        }
        else {
            levelWordPool.push(wordPoolQuote.shift());
        }
    }
    console.log(levelWordPool);
}

/**
 * Gets a new quote, and removes it from the pool of quotes.
 * @returns A new quote.
 */
function GetNewQuote() {
    if (allLines.length == 0) {
        console.log("no more quotes");
        return;
    }
    return allLines.splice(Math.floor(Math.random() * allLines.length), 1)[0];
}
