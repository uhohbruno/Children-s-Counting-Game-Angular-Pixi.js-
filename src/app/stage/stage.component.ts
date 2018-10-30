import { Component, OnInit } from '@angular/core';
import * as PIXI from '../../../node_modules/pixi.js/dist/pixi.js';

import { Howl, Howler } from '../../../node_modules/howler/dist/howler.min.js';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {




    function onDragEnd() {
      this.dragging = false;
      this.data = null;
    }
    function onDragMove() {
      if (this.dragging) {

        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;

        this.y = newPosition.y;
      }

    }
    function onDragStart(event) {
      this.data = event.data;
      this.dragging = true;

    }

    function createFace(i) {

      i = Math.floor(i);
      let face = new PIXI.Sprite(PIXI.Texture.fromImage('../../assets/img/tile00' + (i + 1) + '.png'));

      face.on('pointerdown', onDragStart);
      face.on('pointerup', checkIfCorrect);
      face.on('pointerup', onDragEnd);
      face.on('pointeroutside', onDragEnd);
      face.on('pointermove', onDragMove);
      face.buttonMode = true;
      face.scale.x /= 2;
      face.scale.y /= 2;
      face.interactive = true;
      face.anchor.set(0.5);
      face.x = (i % fingersCount) * 160;
      face.y = Math.floor(i / fingersCount) * 70;
      faces.addChild(face);

      var textSample = new PIXI.Text('Placeholder', {
        fontFamily: 'Arial',
        fontSize: 35,
        fill: 'white',
        align: 'left'
      });

      textSample.position.set(0, 100);
      textSample.text = i + 1;
      textSample.numVar = i;

      face.addChild(textSample);


      const sound = new Howl({
        src: ['../../assets/sound/' + (i + 1) + '.mp3']
      });
      sound.play();



      let numText = new PIXI.Text((i + 1), {
        fontFamily: "Helvetica",
        fill: '#fff',
        fontSize: "36px"
      });                       

      // set boundaries 
      let maxWidth = (window.innerWidth - 200);
      let maxHeight = (window.innerHeight - 200);
      let randomWidth = (Math.random() * maxWidth + 100);
      let randomHeight = (Math.random() * maxHeight + 100);


      let numContainer = new PIXI.Container();

      let numContainerGraphic = new PIXI.Graphics();
      
      

      numText.x = randomWidth;
      numText.y = randomHeight;
      
      numText.anchor.set(0.5);
      numText.numVar = i;
      numText.refId = 'circleNum';
      numContainerGraphic.beginFill('0#79859a', '0.25');
      numContainerGraphic.drawCircle(0, 0, 60);
      numContainerGraphic.endFill();
      
      let numContainerSprite = new PIXI.Sprite(numContainerGraphic.generateTexture());
     numContainerSprite.anchor.set(0.5);
      

      numContainer.numVar = i;
      numContainer.isCircle = true;
      //setting variables to test match and deploy dissapear animation 

      numContainer.addChild(numContainerSprite);
      app.stage.addChild(numText, numContainer);
      numContainer.x = randomWidth;
      numContainer.y = randomHeight;
    }
    function destroyCurrent(circleSlot, numSlot, face) {
      
      let moveAway = new PIXI.ticker.Ticker();
      moveAway.stop();
      moveAway.add((delta) => {

        circleSlot.scale.x /= 1.13;
        circleSlot.scale.y /= 1.13;
        numSlot.scale.x /= 1.13;
        numSlot.scale.y /= 1.13;
        face.parent.scale.x /= 1.13;
        face.parent.scale.y /= 1.13;

        numSlot.rotation += 0.1 * delta;
        circleSlot.rotation += 0.1 * delta;
        face.parent.rotation += 0.1 * delta;
      });
      moveAway.start();
    }
    function checkIfCorrect(event) {
      
      let correctNum;
      let correctCircleSlot;
      let numI = this.children[0].numVar;

      for(let elements of app.stage.children) {
        if(elements.isCircle && elements.numVar === numI) {
          correctCircleSlot = elements;
        }
      }
      

      for (let circleNums of app.stage.children) {

        if ((circleNums.numVar === this.children[0].numVar) && (circleNums.refId === 'circleNum')) {

          correctNum = circleNums;
          numI = circleNums.numVar;
        }

      }
      let xTestClose = (Math.abs(correctNum.worldTransform.tx - this.children[0].worldTransform.tx) <= 50);
      let yTestClose = (Math.abs(correctNum.worldTransform.ty - this.children[0].worldTransform.ty) <= 100);

      if (xTestClose && yTestClose) {
        console.log('NClose \n Now use this object to select all elements here ');
        console.log(correctCircleSlot);
        destroyCurrent(correctCircleSlot, correctNum, this.children[0]);
        // celebrate();

      }
      else {
        console.log('Not close');

      }
      console.log(correctNum, 'test');
      
      console.log('clicked on element X \n', correctNum.worldTransform.tx);
      console.log('clicked on element X \n', this.children[0].worldTransform.tx);

      console.log('clicked on element y \n', correctNum.worldTransform.ty );
      console.log('clicked on element y \n', this.children[0].worldTransform.ty);

      console.log(this.children[0].numVar);
      for (let numbers of app.stage.children) {
        console.log(numbers);
      }



      // 



    }


    let faces = new PIXI.Container();
    faces.interactive = true;

    faces.x = window.innerWidth / 4;
    faces.y = window.innerHeight / 2;
    let app = new PIXI.Application(800, 600, { backgroundColor: 0x2B89C2 });
    app.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);

   
    

    app.stage.addChild(faces);

    //Timer and iterator setup for appearing sequential hands

    let u = 0;
    let vu = 0.01;
    let startTimer = 0;
    let start = false;
    const fingersCount = 5;
  

    app.ticker.add((delta) => {

      if (startTimer < 1) {
        startTimer += 0.01;
      } else {
        start = true;
      }

      if (start) {
        if (u > fingersCount - 0.5) {
          // do nothing
        } else {
          u += vu;
          if (u % 1 >= 0 && u % 1 <= 0.01) {
            createFace(u);
          }
        }
      }
    });











    document.body.appendChild(app.view);


  }

}









