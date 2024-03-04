import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

export const app = new PIXI.Application({
  view: document.querySelector("canvas"),
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  autoDensity: true,
  backgroundColor: 0x000000,
  resolution: window.devicePixelRatio
});


export const spielfeld = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  events: app.renderer.events,
})

  .drag()



app.stage.addChild(spielfeld);


function resizeTo() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  //spielfeld.resize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resizeTo);
