var main = (function () {
  $(document).ready(function () {
    $('h1').on('click', function () {
      alert('Title clicked!');
    });


    addLayerImg();
    explode();
  });
function addLayerImg(){
  var canvas = document.createElement('canvas');
  canvas.id = 'explosion-bg-canvas';
  canvas.className = 'explosion-bg';
  var headerElem = document.getElementById("main");
  headerElem.insertBefore(canvas,headerElem.childNodes[0]);
  var headerW = headerElem.offsetWidth;
  var headerH = headerElem.offsetHeight;
  canvas.width = headerW;
  canvas.height = headerH;
  var xScale;
  var yScale;
  var xScalePrev = 1;
  var yScalePrev = 1;
  var xScaleRatio;
  var yScaleRatio;
  var scale;
  var scalePrev = 1;
  var scaleRatio;
  var xOffset = 0;
  var xOffsetPrev = 0;
  var yOffset = 0;
  var yOffsetPrev = 0;
  var ctx = canvas.getContext("2d");

  var img = new Image()
  img.src = '../images/bg-header-tr.png';

  img.onload = function(){
      imgW=img.width
      imgH=img.height

      //fitToBackGroundShape(imgW)
      // Get largest dimension increase

      updateScales()
      ctx.drawImage(img, xOffset, 0, scale*imgW,scale*imgH);
    }
    function updateScales(){
        xScale = headerW / imgW;
        yScale = headerH / imgH;

        xScaleRatio = xScale/xScalePrev
        yScaleRatio = yScale/yScalePrev

        xScalePrev = xScale
        yScalePrev = yScale
        if (xScale > yScale) {
            // The image fits perfectly in x axis, stretched in y
            scale = xScale;
            yOffsetPrev = yOffset
            yOffset = 0 //(headerH - (imgH * scale)) / 2;

        }
        else {
            // The image fits perfectly in y axis, stretched in x
            scale = yScale;
            xOffsetPrev = xOffset
            xOffset = (headerW - (imgW * scale)) / 2;
        }

        scaleRatio = scale/scalePrev
        scalePrev = scale
        //console.log(scale,xOffset,yOffset,xScale,yScale,headerW,headerH)
    }
}

  function explode(){
      var time = 0;

      var canvas = document.createElement('canvas');
      canvas.id = 'explosion-canvas';
      canvas.className = 'explosion';
      var headerElem = document.getElementById("main");
      headerElem.insertBefore(canvas,headerElem.childNodes[0])
      var headerW = headerElem.offsetWidth;
      var headerH = headerElem.offsetHeight;
      canvas.width = headerW;
      canvas.height = headerH;

      var xScale;
      var yScale;
      var xScalePrev = 1;
      var yScalePrev = 1;
      var xScaleRatio;
      var yScaleRatio;
      var scale;
      var scalePrev = 1;
      var scaleRatio;
      var xOffset = 0;
      var xOffsetPrev = 0;
      var yOffset = 0;
      var yOffsetPrev = 0;

      var ctx = canvas.getContext("2d");

      var img = new Image()
      img.src = '../images/bg-header-tr.png';

      img.onload = function(){
          imgW=img.width
          imgH=img.height

          //fitToBackGroundShape(imgW)
          // Get largest dimension increase

          updateScales()

          ctx.drawImage(img, xOffset, 0, scale*imgW,scale*imgH);

          var imgData=ctx.getImageData(0,0,headerW,headerH);

          var nonTransparentPix = []
          var tilesOrig = []
          var tilesNext = []
          setup()

          function setup() {
              for (var i=0;i<imgData.data.length;i+=4){
                  if (imgData.data[i+3] != 0){
                      var x = (i / 4) % headerW;
                      var y = Math.floor((i / 4) / headerW);
                      if(imgData.data[i+3]>200){
                          nonTransparentPix.push([x,y,imgData.data[i],imgData.data[i+1],imgData.data[i+2],imgData.data[i+3]])
                      }
                      imgData.data[i]=255;
                      imgData.data[i+1]=0;
                      imgData.data[i+2]=0;
                      imgData.data[i+3]=255;
                  }
              }
              //ctx.clearRect(0, 0, w, h);
              //ctx.putImageData(imgData,0,0); //red mask

              for (var i=0;i<nonTransparentPix.length;i+=100){
                  for(var j = 0; j<1; j++){
                      var x = nonTransparentPix[i][0]
                      var y = nonTransparentPix[i][1]
                      var r = 20

                      var v1x = getRandomInt(x-r,x-1)
                      var v1y = getRandomInt(y-r,y+r)
                      var v2x = x
                      var v2y = y
                      var v3x = getRandomInt(x+1,x+r)
                      var v3y = getRandomInt(y-r,y+r)

                      var red = nonTransparentPix[i][2]
                      var green = nonTransparentPix[i][3]
                      var blue = nonTransparentPix[i][4]
                      var alpha = nonTransparentPix[i][5]
                      var angle =  getRandomReal(0.65,0.72)
                      var speed = getRandomReal(200,300)
                      var accel = getRandomReal(100,150)
                      var timeToGo = Math.random()*30+1
                      tilesOrig.push({v1x: v1x, v1y: v1y,
                                      v2x: v2x,v2y: v2y,
                                      v3x: v3x,v3y: v3y,
                                      red: red, green: green, blue: blue,alpha: alpha,
                                      angle: angle, speed: speed, accel: accel, timeToGo: timeToGo,
                                      scale: scale});
                      tilesNext.push({v1x: v1x, v1y: v1y,
                                      v2x: v2x,v2y: v2y,
                                      v3x: v3x,v3y: v3y,
                                      red: red, green: green, blue: blue,alpha: alpha,
                                      angle: angle, speed: speed, accel: accel, timeToGo: timeToGo,
                                      scale: scale});
                  }
              }
          }
          //handleResize()
          // window.addEventListener('resize', handleResize);
          window.requestAnimationFrame(render);

          function render (){
              ctx.clearRect(0, 0, headerW, headerH);
              //handleResize()
              drawTiles(tilesNext)
              update();
              //drawTest()
              window.requestAnimationFrame(render);
          }
          function drawTiles(tiles){
              for (var i=0;i<tiles.length;i++){
                  tile = tiles[i]
                  ctx.fillStyle = 'rgba('+tile.red+','+tile.green+','+tile.blue+','+0.8+')'
                  ctx.beginPath()
                  ctx.moveTo(tile.v1x, tile.v1y)
                  ctx.lineTo(tile.v2x, tile.v2y)
                  ctx.lineTo(tile.v3x, tile.v3y)
                  ctx.closePath()
                  ctx.fill()
              }
          }
          function drawTest(){
              drawTiles(tilesOrig)
          }
          function update(){
              var timeInterval=0.01
              time+=timeInterval
              for (var i=0;i<tilesNext.length;i++){
                  tileOrig = tilesOrig[i]
                  tile = tilesNext[i]
                  if (tileOrig.timeToGo<=time){
                      tile.v1x = tileOrig.v1x + (time-tileOrig.timeToGo)*tileOrig.speed
                      tile.v1y = tileOrig.v1y - Math.sin((time-tileOrig.timeToGo)*tileOrig.angle/3)*(512*tileOrig.angle)*3
                      tile.v2x = tileOrig.v2x + (time-tileOrig.timeToGo)*tileOrig.speed
                      tile.v2y = tileOrig.v2y - Math.sin((time-tileOrig.timeToGo)*tileOrig.angle/3)*(512*tileOrig.angle)*3 + Math.sin((time-tileOrig.timeToGo)*40)*25
                      tile.v3x = tileOrig.v3x + (time-tileOrig.timeToGo)*tileOrig.speed
                      tile.v3y = tileOrig.v3y - Math.sin((time-tileOrig.timeToGo)*tileOrig.angle/3)*(512*tileOrig.angle)*3
                  }
                  else{
                      tile.v1x = tileOrig.v1x
                      tile.v1y = tileOrig.v1y
                      tile.v2x = tileOrig.v2x
                      tile.v2y = tileOrig.v2y
                      tile.v3x = tileOrig.v3x
                      tile.v3y = tileOrig.v3y
                  }
              }
          }
          function handleResize() {
              headerElem = document.getElementById("header");
              headerW = headerElem.offsetWidth;
              headerH = headerElem.offsetHeight;
              canvas.width = headerW;
              canvas.height = headerH;
              updateScales()
              updateOrigPos()
              //window.requestAnimationFrame(render);

          }
          function updateOrigPos(){
              //console.log("v1x:",tilesOrig[0].v1x)
              for (var i = 0 ; i < tilesOrig.length ; i++){
                  tile = tilesOrig[i]
                  if (xScale > yScale){
                      tile.v1x = tile.v1x*scaleRatio + 0
                      tile.v1y = tile.v1y*scaleRatio + 0
                      tile.v2x = tile.v2x*scaleRatio + 0
                      tile.v2y = tile.v2y*scaleRatio + 0
                      tile.v3x = tile.v3x*scaleRatio + 0
                      tile.v3y = tile.v3y*scaleRatio + 0
                  }
                  else {
                      tile.v1x = tile.v1x*scaleRatio + xOffset - xOffsetPrev
                      tile.v1y = tile.v1y*scaleRatio + yOffset
                      tile.v2x = tile.v2x*scaleRatio + xOffset - xOffsetPrev
                      tile.v2y = tile.v2y*scaleRatio + yOffset
                      tile.v3x = tile.v3x*scaleRatio + xOffset - xOffsetPrev
                      tile.v3y = tile.v3y*scaleRatio + yOffset
                  }

              }
          }
          function updateScales(){
              xScale = headerW / imgW;
              yScale = headerH / imgH;

              xScaleRatio = xScale/xScalePrev
              yScaleRatio = yScale/yScalePrev

              xScalePrev = xScale
              yScalePrev = yScale
              if (xScale > yScale) {
                  // The image fits perfectly in x axis, stretched in y
                  scale = xScale;
                  yOffsetPrev = yOffset
                  yOffset = 0 //(headerH - (imgH * scale)) / 2;

              }
              else {
                  // The image fits perfectly in y axis, stretched in x
                  scale = yScale;
                  xOffsetPrev = xOffset
                  xOffset = (headerW - (imgW * scale)) / 2;
              }

              scaleRatio = scale/scalePrev
              scalePrev = scale
              //console.log(scale,xOffset,yOffset,xScale,yScale,headerW,headerH)
          }
      }

      function getRandomInt(min, max) {
              return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      function getRandomReal(min, max) {
          return Math.random() * (max - min) + min;
      }



  }
  return {

  };
}());
