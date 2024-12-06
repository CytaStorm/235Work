"use strict";
debugger;
const main = document.querySelector("#main");
const app = new PIXI.Application();
await app.init({ width: 640, height: 360 })


// #2 - Append its "view" (a <canvas> tag that it created for us) to the DOM
main.appendChild(app.canvas);

// #1 - make a square
// https://pixijs.download/release/docs/PIXI.Graphics.html
const square = new PIXI.Graphics();
square.beginFill(0xFF0000); 	// red in hexadecimal
square.lineStyle(3, 0xFFFF00, 1); // lineWidth,color in hex, alpha
square.drawRect(0, 0, 40, 40); 	// x,y,width,height
square.endFill();
square.x = 25;
square.y = 50;
app.stage.addChild(square);  	// now you can see it

// #2 make a circle
let radius = 20;
const circle = new PIXI.Graphics();
circle.beginFill(0xFF0000);
circle.drawCircle(0, 0, radius);
circle.endFill();
circle.x = 125;
circle.y = 50;
app.stage.addChild(circle);