import * as PIXI from "pixi.js";
import { spielfeld } from "./Scene";
import { app } from "./Scene";


const hud = new PIXI.Graphics();
hud.beginFill(new PIXI.Color(0xFF00FF));
hud.drawRect(0, 0, 100, 200);
hud.endFill();
app.stage.addChild(hud);


let felder = [];


function drawFields() {

  for (let i = 0; i < 10; i++) {
    felder.push(new Field(spielfeld.screenWidth/2-45, spielfeld.screenHeight/2-45));
  
  }

  for (let i = 0; i < 1; i++) {

    const field = new PIXI.Graphics()
      .beginFill(0xFFFFFF)
      .drawRect(felder[i].x, felder[i].y, 90,90)
      .endFill()

    spielfeld.addChild(field);
  }
}



class Field {

  constructor(x, y) {
    this.x = x;
    this.y = y;

  }
}

let text = new PIXI.Text('LeinwandX: ', {
  fontFamily: 'Arial',
  fontSize: 24,
  fill: 0xff1010
})

let text1 = new PIXI.Text('LeinwandY: ', {
  fontFamily: 'Arial',
  fontSize: 24,
  fill: 0xff1010
})



let text2 = new PIXI.Text('AppX: ', {
  fontFamily: 'Arial',
  fontSize: 24,
  fill: 0xff10ff
})

let text3 = new PIXI.Text('AppY: ', {
  fontFamily: 'Arial',
  fontSize: 24,
  fill: 0xff10ff
})

text.x = 100;
text.y = 100;
text1.x = 100;
text1.y = 200;
text2.x = 100;
text2.y = 300;
text3.x = 100;
text3.y = 400;

app.stage.addChild(text);
app.stage.addChild(text1);
app.stage.addChild(text2);
app.stage.addChild(text3);


drawFields();

app.ticker.add((deltaTime) => renderer(deltaTime));

function renderer(deltaTime) {

  hud.y = app.screen.height - 200;
  hud.width = app.screen.width;

  if(app.screen.width /2 <= spielfeld.x){
    spielfeld.x = app.screen.width /2;
  }

  if((app.screen.width /2)*-1 >= spielfeld.x){
    spielfeld.x = (app.screen.width /2)*-1;
  }

  if(app.screen.height /2 <= spielfeld.y){
    spielfeld.y = app.screen.height /2;
  }


  if((app.screen.height /2)*-1 >= spielfeld.y){
    spielfeld.y = (app.screen.height /2)*-1;
  }

  text.text = "LeinwandX: " + spielfeld.x
  text1.text = "LeinwandY: " + spielfeld.y
  text2.text = "AppWidth: " + app.screen.width
  text3.text = "AppHeight: " + app.screen.height

  
}


