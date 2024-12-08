"use strict";
const main = document.querySelector("#main");
const app = new PIXI.Application();
await app.init({ width: 500, height: 500 })


// #2 - Append its "view" (a <canvas> tag that it created for us) to the DOM
main.appendChild(app.canvas);

// #1 - make a square
// https://pixijs.download/release/docs/PIXI.Graphics.html
const square = new PIXI.Graphics();
square.fill(0xFF0000); 	// red in hexadecimal
square.setStrokeStyle(3, 0xFFFF00, 1); // lineWidth,color in hex, alpha
square.rect(0, 0, 40, 40); 	// x,y,width,height
square.fill();
square.x = 25;
square.y = 50;
app.stage.addChild(square);  	// now you can see it

// #2 make a circle
let radius = 20;
const circle = new PIXI.Graphics();
circle.fill(0xFF0000);
circle.circle(0, 0, radius);
circle.fill();
circle.x = 125;
circle.y = 50;
app.stage.addChild(circle);