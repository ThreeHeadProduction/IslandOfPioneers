import * as PIXI from 'pixi.js';

// Erstellen Sie eine Pixi.js-Anwendung
const app = new PIXI.Application({

    width: window.innerWidth,
    height: window.innerHeight
   
});

document.body.appendChild(app.view as HTMLCanvasElement);


// Erstellen Sie ein Pixi.js-Rechteck
const rectangle = new PIXI.Graphics();
rectangle.beginFill(0xFF0000);
rectangle.drawRect(0, 0, 100, 100);
rectangle.endFill();

// Fügen Sie das Rechteck zur Bühne hinzu
app.stage.addChild(rectangle);

enum Hallo{

    hallo,
    nice
}



