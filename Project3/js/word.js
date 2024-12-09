import { Vector } from './utility.js';
import { app, gameScene, deltaTime } from './main.js';
"use strict";
export class WordBlock extends PIXI.Graphics{
    /** 
    * @param {string} text Text to display
    */
    constructor(text){
        super();
        //Fields
        this.x = Math.random() * app.renderer.width;
        this.y = 0;
        this.text = text;

        //Velocity
        //Go straight down
        this._velocity = new Vector(0, 100);

        //Inside Text
        let word = new PIXI.Text({
            text: text,
            style: {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 0xFFFFFF,
                align:'center',
            }
        });
        word.anchor.set(0.5, 0.5);

        //Prevent words from spawning offscreen left-right
        if (this.x + word.width / 2 > app.renderer.width){
            this.x = app.renderer.width - word.width / 2
        }

        //Background Rect
        this.fill(0x292929);
        this.rect(-word.width / 2, -word.height / 2, word.width, word.height);
        this.fill();

        //Application
        this.addChild(word);
    }

    /**
     * @param {float} deltaTime Time since last frame
     */
    descend = () => {
        this.y += this._velocity.y * deltaTime;
        if (this.y > app.renderer.height - this.height){
            gameScene.removeChild(this);
            delete(this);
        }
    }
}