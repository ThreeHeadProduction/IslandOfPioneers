"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PIXI = require("pixi.js");
// Erstellen Sie eine Pixi.js-Anwendung
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight
});
document.body.appendChild(app.view);
// Erstellen Sie ein Pixi.js-Rechteck
const rectangle = new PIXI.Graphics();
rectangle.beginFill(0xFF0000);
rectangle.drawRect(0, 0, 100, 100);
rectangle.endFill();
// Fügen Sie das Rechteck zur Bühne hinzu
app.stage.addChild(rectangle);
var Hallo;
(function (Hallo) {
    Hallo[Hallo["hallo"] = 0] = "hallo";
    Hallo[Hallo["nice"] = 1] = "nice";
})(Hallo || (Hallo = {}));
