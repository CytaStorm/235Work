import { Vector, lerp, clamp } from './utility.js';
import { app, gameScene, deltaTime } from './main.js';
"use strict";

export class Torch extends PIXI.Sprite{
    constructor(texture){
        super(texture)
        this.x = app.renderer.width / 2;
        this.y = app.renderer.height - 100;
        this.width = texture.width / 4;
        this.height = texture.height / 4;
        this.anchor.set(0.5, 0.5);
    }

    /**
     * Follows the cursor.
     */
    followMouse = () => {
        let mousePosition = app.renderer.events.pointer.global;
        let amt = 6 * deltaTime;
        let newX = lerp(this.x, mousePosition.x, amt);
        let newY = lerp(this.y, mousePosition.y, amt);
      
        // keep the ship on the screen with clamp()
        let w2 = this.width / 2;
        let h2 = this.height / 2;

        this.x = clamp(newX, 0 + w2, app.renderer.width - w2);
        this.y = clamp(newY, 0 + h2, app.renderer.height - h2);
    }
}