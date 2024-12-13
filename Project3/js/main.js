import { WordBlock } from "./word.js";
import { Torch } from "./torch.js";
import { rectsIntersect } from "./utility.js"
"use strict";
//Game Variables
//Resources
let garbageWordsAPI = "https://random-word-api.herokuapp.com/word?number=50";
let allLinesLink = "js/quotes.txt";
let assets;
//SFX
let collectSFX;
let buttonSFX;
let narration1;
let narration2;
let narration3;
let narration4;
let narration5;
let narration6;
let narration7;
let narration8;

let allLines = Array();
let garbageWords = Array();

//Level specific
let currentQuote = Array();
export let fallingBlocks = Array();
let levelWordPool = Array();
let randomWordChance = 40;
let collectedWords = Array();
let torch;

//Logic
export let deltaTime;
let spawnInterval = 3;
let timeSinceLastSpawn = 0;

//GFX
const main = document.querySelector("#main");
export const app = new PIXI.Application();
globalThis.__PIXI_APP__ = app;
await app.init({ resizeTo: window, background: '#070707' })
main.appendChild(app.canvas);

//Gameplay Scene
export let gameScene = new PIXI.Container();
let mainMenu = new PIXI.Container();
let levelEnd = new PIXI.Container();
let quoteScreen = new PIXI.Container();

//UI
let buttonStyle = {
    fill: 0xd9a950,
    fontSize: 48,
    trim: true,
    padding: 5,
    fontFamily: 'Los Guripas'
};

let regStyle = {
    fill: 0x000000,
    fontSize: 100,
    stroke: 0xe64937,
    strokeThickness: 6,
    wordWrap: true,
    wordWrapWidth: 0.9 * app.renderer.width,
    trim: true,
    padding: 5,
    fontFamily: 'Los Guripas'
};

app.ticker.add(gameLoop);

Setup();

/**
 * Sets up resources and starts the game
 */
async function Setup() {
    //Load sprites
    PIXI.Assets.addBundle("sprites", {
        torch: "images/torch.png"
    });
    assets = await PIXI.Assets.loadBundle("sprites");
    LoadSounds()
    
    StartGame();
}

function LoadSounds(){
    collectSFX = new Howl({
        src: ["sounds/ui_dun_pit_torch_add.wav"],
    });
    buttonSFX = new Howl({
        src: ["sounds/ui_button_click.wav"],
    });
    narration1 = new Howl({
        src: ["sounds/Narration/narration1.wav"],
    });
    narration2 = new Howl({
        src: ["sounds/Narration/narration2.wav"],
    });
    narration3 = new Howl({
        src: ["sounds/Narration/narration3.wav"],
    });
    narration4 = new Howl({
        src: ["sounds/Narration/narration4.wav"],
    });
    narration5 = new Howl({
        src: ["sounds/Narration/narration5.wav"],
    });
    narration6 = new Howl({
        src: ["sounds/Narration/narration6.wav"],
    });
    narration7 = new Howl({
        src: ["sounds/Narration/narration7.wav"],
    });
    narration8 = new Howl({
        src: ["sounds/Narration/narration8.wav"],
    });
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
    //Create Main Menu
    LoadMainMenu();
    app.stage.addChild(mainMenu);
    app.stage.addChild(gameScene);
    gameScene.visible = false;
    app.stage.addChild(levelEnd);
    levelEnd.visible = false;
    app.stage.addChild(quoteScreen);
    quoteScreen.visible = false;
}

function LoadMainMenu() {
    let startLabel1 = new PIXI.Text("AncestorBlaster", regStyle);
    startLabel1.anchor.set(0.5, 0.5);
    startLabel1.x = app.renderer.width / 2;
    startLabel1.y = app.renderer.height / 2;
    mainMenu.addChild(startLabel1)

    // 1C make start game button
    let startButton = new PIXI.Text("Begin your Descent", buttonStyle);
    startButton.anchor.set(0.5, 0.5);
    startButton.x = app.renderer.width / 2;
    startButton.y = app.renderer.height - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", LoadFirstLevel);
    startButton.on("pointerover", (e) => (e.target.alpha = 0.7));
    startButton.on("pointerout", (e) => (e.currentTarget.alpha = 1.0));
    mainMenu.addChild(startButton);
}

function ReturnMainMenu() {
    buttonSFX.play();
    mainMenu.visible = true;
    gameScene.visible = false;
    levelEnd.visible = false;
}

async function LoadFirstLevel() {
    buttonSFX.play();
    await SetGarbageWords();
    await SetQuotes();
    NewLevel();
}

/**
 * Main Game loop
 */
function gameLoop() {
    if (!gameScene.visible) return;
    deltaTime = 1 / app.ticker.FPS;

    timeSinceLastSpawn += deltaTime;

    CleanObjects();
    //Spawn blocks according to time and words left
    if (timeSinceLastSpawn >= spawnInterval &&
        levelWordPool.length != 0) {
        if (levelWordPool.length == 1) {
            SpawnTextBlock(levelWordPool.shift(), true);
        }
        else {
            SpawnTextBlock(levelWordPool.shift());
        }
    }
}

function SpawnTextBlock(text, isLastWord = false) {
    spawnInterval = Math.random() * 2;
    let newBlock;
    if (isLastWord) {
        newBlock = new WordBlock(text, true);
    } else {
        newBlock = new WordBlock(text);
    }
    gameScene.addChild(newBlock);
    fallingBlocks.push(newBlock);
    app.ticker.add(newBlock.descend);
    timeSinceLastSpawn = 0;
}

/**
 * Handles collisions and destroying offscreen blocks.
 */
function CleanObjects() {
    //removes words that fall off the bottom of the screen
    for (let i = 0; i < fallingBlocks.length; i++) {

        //check collision
        let word = fallingBlocks[i];
        if (rectsIntersect(word, torch)) {
            collectedWords.push(word.text);
            collectSFX.play();
            DestroyWord(word, i);
        }

        //stay onscreen otherwise
        if (word.y <= app.renderer.height - word.height) continue;

        //Destroy word when fall offscreen
        DestroyWord(word, i);
    }
}

/**
 * Destroys Word Block
 * @param {word} word Word to destroy
 * @param {number} i Index of word in fallingBlocks array
 */
function DestroyWord(word, i) {
    console.log(word);
    gameScene.removeChild(word);
    fallingBlocks.splice(i, 1);
    if (word.isLastWord) {
        //load end of level screen
        EndLevel();
    }
}

function ClearScene(scene) {
    console.log(scene);
    for (let i of scene.children) {
        scene.removeChild(i);
    }
}

/**
 * Sets up level
 */
async function NewLevel() {
    GenerateLevelWordPool();
    ClearScene(quoteScreen);
    mainMenu.visible = false;
    quoteScreen.visible = true;
    levelEnd.visible = false;
    let quote = new PIXI.Text(CleanQuoteArray(currentQuote), regStyle);
    quote.anchor.set(0.5, 0.5);
    quote.x = app.renderer.width / 2;
    //console.log(quote.x);
    quote.y = app.renderer.height / 2;
    quoteScreen.addChild(quote);

    let beginLevel = new PIXI.Text("Start!", buttonStyle);
    beginLevel.anchor.set(0.5, 0.5);
    beginLevel.x = app.renderer.width / 2;
    beginLevel.y = app.renderer.height - 100;
    beginLevel.interactive = true;
    beginLevel.buttonMode = true;

    quoteScreen.addChild(beginLevel);

    let quoteRef = (CleanQuoteArray(currentQuote));
    switch (quoteRef){
        case "Can the defiled be consecrated? Can the fallen find rest?":
            narration1.play();
            break;
        case "We fall so that we may learn to pick ourselves up once again.":
            narration2.play();
            break;
        case "In the end, every plan relies upon a strong arm, and tempered steel.":
            narration3.play();
            break;
        case "As the fiend falls, a faint hope blossoms.":
            narration4.play();
            break;
        case "Their formation is broken - maintain the offensive.":
            narration5.play();
            break;
        case "Monstrous size has no intrinsic merit, unless inordinate exsanguination be considered a virtue.":
            narration6.play();
            break;
        case "Madness, our old friend!":
            narration7.play();
            break;
        case "Frustration and fury, more destructive than a hundred cannons.":
            narration8.play();
            break;
    }
    beginLevel.on("pointerup", StartLevel);
    beginLevel.on("pointerover", (e) => (e.target.alpha = 0.7));
    beginLevel.on("pointerout", (e) => (e.currentTarget.alpha = 1.0));
}

function StartLevel() {
    buttonSFX.play();
    ClearScene(gameScene);
    mainMenu.visible = false;
    levelEnd.visible = false;
    gameScene.visible = true;
    quoteScreen.visible = false;
    torch = new Torch(assets.torch);
    gameScene.addChild(torch);
    collectedWords = Array();
    app.ticker.add(torch.followMouse);

}

function EndLevel() {
    console.log("endLevel")
    gameScene.visible = false;
    levelEnd.visible = true;

    let startLabel1 = new PIXI.Text("Your Quote:", regStyle);
    startLabel1.anchor.set(0.5, 0.5);
    startLabel1.x = app.renderer.width / 2;
    startLabel1.y = app.renderer.height / 2 - 150;
    levelEnd.addChild(startLabel1)

    let startLabel2 = new PIXI.Text(CleanQuoteArray(collectedWords), regStyle);
    startLabel2.anchor.set(0.5, 0.5);
    startLabel2.x = app.renderer.width / 2 - 10;
    startLabel2.y = app.renderer.height / 2;
    levelEnd.addChild(startLabel2)

    //There are more words
    if (allLines.length != 0) {
        let nextLevel = new PIXI.Text("Next level", buttonStyle);
        nextLevel.anchor.set(0.5, 0.5);
        nextLevel.x = app.renderer.width / 2;
        nextLevel.y = app.renderer.height - 100;
        nextLevel.interactive = true;
        nextLevel.buttonMode = true;
        nextLevel.on("pointerup", NewLevel);
        nextLevel.on("pointerover", (e) => (e.target.alpha = 0.7));
        nextLevel.on("pointerout", (e) => (e.currentTarget.alpha = 1.0));
        levelEnd.addChild(nextLevel);
    }
    else {
        //Load main menu
        let returnMainMenu = new PIXI.Text("Main Menu", buttonStyle);
        returnMainMenu.anchor.set(0.5, 0.5);
        returnMainMenu.x = app.renderer.width / 2;
        returnMainMenu.y = app.renderer.height - 100;
        returnMainMenu.interactive = true;
        returnMainMenu.buttonMode = true;
        returnMainMenu.on("pointerup", ReturnMainMenu);
        returnMainMenu.on("pointerover", (e) => (e.target.alpha = 0.7));
        returnMainMenu.on("pointerout", (e) => (e.currentTarget.alpha = 1.0));
        levelEnd.addChild(returnMainMenu);
    }
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
 * Returns string built of words in array.
 */
function CleanQuoteArray(inputArray) {
    let result = "";
    for (let i = 0; i < inputArray.length; i++) {
        //Not last word
        if (i < inputArray.length - 1) {
            result += inputArray[i] + " ";
        }
        else {
            result += inputArray[i];
        }
    }
    result = result.trim();
    return result;
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
