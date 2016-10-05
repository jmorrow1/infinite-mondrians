/**
  * Infinite Mondrians
  * by James Morrow
  * jamesmorrowdesign.com
  * github.com/jmorrow1
  *
  * The entry point for p5.js into the application.
  *
  */

function infiniteMondrians(p5) {
  //the leftmost x-coordinate of the painting and the upppermost y-coordinate of the painting, respectively:
  var painting_x, painting_y;

  //the side length of the painting, in pixels:
  var painting_sqrt;

  //the color scheme; an array of 4 colors:
  var colors;

  //time within animation (in milliseconds)
  var t = 0;

  //time it takes for an animation to complete (in milliseconds)
  var animationDuration = 1000;

  //the previous time recorded (in milliseconds)
  var prevt;

  //a boolean that tells whether or not the program is in the process of animating a painting:
  var animating;

  //a boolean that tells whether or not it is the first draw call of the program:
  var firstDrawCall = true;

  //a list of lines, a list of lines, and a list of colored rectangles, respectively:
  var lns1, lns2, crs;

  //the value by which to scale the painting
  var scalar = 1;

  /**
   * Called once by p5.js at the beginning of the program
   */
  p5.setup = function() {
    t = 0;
    prevt = p5.millis();
    var canvas = p5.createCanvas(p5.displayWidth, p5.displayHeight);
    canvas.parent('canvas');

    painting_sqrt = p5.int(p5.min(p5.windowWidth, p5.windowHeight)) - 120;
    painting_x = p5.windowWidth/2 - painting_sqrt/2;
    painting_y = 5;

    initControllers(0);

    // colors = [p5.color(238,227,10), p5.color(60, 67, 129), p5.color(222, 47, 47), p5.color(0, 0, 0)];
    colors = [p5.color(234, 198, 50), p5.color(60, 67, 129), p5.color(222, 47, 62), p5.color(0)];

    spawnPainting();

    animating = true;
    t = 0;
    prevt = p5.millis();
    console.log(prevt);
  }

  /**
   * Called once every frame by p5.js
   */
  p5.draw = function() {
    var dt = p5.millis() - prevt;

    //hack to get app to display correctly when loaded on iphone in landscape view:
    if (firstDrawCall) {
      firstDrawCall = false;
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    var numGeomElems = lns1.length + lns2.length + crs.length;
    if (animating) {
      t += dt;
      var frameNum = p5.map(t, 0, animationDuration, 0, numGeomElems);
      if (frameNum < numGeomElems) {
        frameNum++;
        drawGeomByFrame(frameNum);
        var slider_position = map(frameNum, 0, numGeomElems, 0, painting_sqrt);
        slider.value(slider_position);
      }
      else {
        animating = false;
      }
    }
    else {
      // console.log(slider.value());
      var num = p5.int(p5.map(slider.value(), 0, painting_sqrt, 0, numGeomElems));
      drawGeomByFrame(num);
    }

    if (!animating) {
      // p5.noLoop();
    }

    p5.strokeWeight(1);
    p5.stroke(200);
    p5.rectMode(p5.CORNERS);
    p5.noFill();
    p5.rect(painting_x, painting_y, painting_x + painting_sqrt, painting_y + painting_sqrt);

    prevt = p5.millis();
  }

  /**
   * Called by p5.js when the browser window is resized
   */
  p5.windowResized = function() {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    var prev_painting_sqrt = painting_sqrt;
    painting_sqrt = p5.int(p5.min(p5.windowWidth, p5.windowHeight)) - 120;
    scalar *= (painting_sqrt / prev_painting_sqrt);
    painting_x = p5.windowWidth/2 - painting_sqrt/2;
    painting_y = 5;
    var sliderValue = slider.value();
    p5.removeElements();
    initControllers(painting_sqrt);
    var numGeomElems = lns1.length + lns2.length + crs.length;
    var frameNum = p5.map(t, 0, animationDuration, 0, numGeomElems);
    drawGeomByFrame(frameNum);
  }

  /**
   * Draws the geometry up until the last geometric element specified.
   * @param {float} itNum - The index of the last geometric element to draw
   */
  function drawGeomByFrame(itNum) {
    p5.push();
    p5.translate(painting_x, painting_y);
    p5.scale(scalar, scalar);
    p5.background(255);

    //draw geometry
    var i = 0;
    var n = itNum;
    //colored rectangles
    p5.noStroke();
    while (i < n && i < crs.length) {
      crs[i].display(p5);
      i++;
    }
    i -= crs.length;
    n -= crs.length;
    //lines
    p5.stroke(0);
    while (i < n && i < lns1.length) {
      lns1[i].display(p5);
      i++;
    }
    i -= lns1.length;
    n -= lns1.length;
    while (i < n && i < lns2.length) {
      lns2[i].display(p5);
      i++;
    }
    p5.pop();
  }

  /**
   * Initialize the slider and buttons
   * @param {float} initSliderValue - The initial slider value
   */
  function initControllers(initSliderValue) {
    slider = p5.createSlider(0, painting_sqrt, initSliderValue);
    slider.position(painting_x, painting_y + painting_sqrt + 5);
    slider.size(painting_sqrt, 20);
    slider.touchMoved(draw);
    slider.touchStarted(draw);

    var generateButton = p5.createButton("Generate");
    generateButton.mousePressed(spawnPainting);
    generateButton.position(painting_x + painting_sqrt/2 - generateButton.size().width/2, slider.position().y + slider.size().height + 5);

    var saveButton = p5.createButton("Save Image");
    saveButton.id("saveButton");
    saveButton.mousePressed(saveMondrian);
    saveButton.position(painting_x + painting_sqrt/2 - saveButton.size().width/2, generateButton.position().y + saveButton.size().height + 5);
  }

  var timeOfLastSpawn = 0;

  /**
   * Spawns a painting and initiates the animation of it.
   */
  function spawnPainting() {
      scalar = 1;

      generateMondrian();

      animating = true;
      t = 0;
      timeOfLastSpawn = p5.millis();
      // loop();
  }

  /**
   * Generate the geometry for a Mondrian painting, specifically by
   * populating the lns1 (first list of lines), lns2 (second list of lines), and crs (list of colored rectangles).
   */
  function generateMondrian() {
    lns1 = [];
    lns2 = [];
    crs = [];

    //run algorithm
    //1. create and add some vertical grid lines
    var vlns = [];
    var startX  = p5.random(5, 250);
    var endX = painting_sqrt - random(5, 50);
    var x = startX;
    while (x < endX) {
      vlns.push(x);
      lns1.push(consLine(x, 0, x, painting_sqrt, p5));
      x += p5.random(25, 250);
    }
    sort(vlns);

    //2. create and add some horizontal grid lines
    var hlns = [];
    var startY = p5.random(5, 250);
    var endY = painting_sqrt - p5.random(5, 50);
    var y = startY;
    while (y < endY) {
      hlns.push(y);
      lns1.push(consLine(0, y, painting_sqrt, y, p5));
      y += p5.random(25, 250);
    }
    sort(hlns);

    //3. create and add the rectangles implied by the grid lines
    var rs = toRects(hlns, vlns);

    //4. add additional lines and rectangles by bisecting existing rectangles
    var count = (p5.random(1) < 0.5) ? 0 : p5.int(rs.length/p5.random(3, 6));
    for (var i=0; i<count; i++) {
      if (rs.length > 0) {
        var j = p5.int(p5.random(rs.length));
        var r = rs[j];
        rs.splice(j, 1);
        var isHorizLine = p5.random(1) < 0.5;
        if (isHorizLine) {
          if (r.y2 - r.y1 >= 36) {
            var ycoord = p5.random(r.y1+18, r.y2-18);
            lns1.push(consLine(r.x1, ycoord, r.x2, ycoord, p5));
            rs.push(consRect(r.x1, r.y1, r.x2, ycoord));
            rs.push(consRect(r.x1, ycoord, r.x2, ycoord));
          }
        }
        else {
          if (r.x2 - r.x1 >= 36) {
            var xcoord = p5.random(r.x1+18, r.x2-18);
            lns1.push(consLine(xcoord, r.y1, xcoord, r.y2, p5));
            rs.push(consRect(r.x1, r.y1, xcoord, r.y2));
            rs.push(consRect(xcoord, r.y1, r.x2, r.y2));
          }
        }
      }
    }

    //5. add additional rectangles by bisecting existing rectangles
    var rs2 = [];
    count = (p5.random(1) < 0.5) ? 0 : p5.int(rs.length/p5.random(3, 6));
    for (var i=0; i<count; i++) {
      if (rs.length > 0) {
        var j = p5.int(p5.random(rs.length));
        var r = rs[j];
        rs.splice(j, 1);
        var isHorizLine = p5.random(1) < 0.5;
        if (isHorizLine) {
          if (r.y2 - r.y1 >= 36) {
            var ay = p5.random(r.y1+6, r.y2-30);
            var by = ay + p5.random(16, r.y2-6-ay);
            rs2.push(consRect(r.x1, ay, r.x2, by));
          }
          else {
            if (r.x2 - r.x1 >= 36) {
              var ax = p5.random(r.x1+6, r.x2-30);
              var bx = ax + p5.random(16, r.x2-6-ax);
              rs2.push(consRect(ax, r.y1, bx, r.y2));
            }
          }
        }
      }
    }
    rs.concat(rs2);

    //6. color in some of the rectangles
    var end = rs.length / p5.int(p5.random(4, 10));
    for (var i=0; i<end; i++) {
      var j = p5.int(p5.random(rs.length));
      var r = rs[j];
      var col = colors[p5.int(p5.random(colors.length))];
      crs.push(consColoredRect(r, col));
    }

    //7. last chance to add grid lines on top of rectangles
    var n = (p5.random(1) < 0.5) ? 0 : p5.int(p5.random(1, 4));
    for (var i=0; i<n; i++) {
      var isHorizLine = p5.random(1) < 0.5;
      if (isHorizLine) {
        if (hlns.length > 1) {
          var m = p5.int(p5.random(hlns.length-1));
          var lnA = hlns[m];
          var lnB = hlns[m+1];
          if (lnB - lnA >= 40) {
            var lnC = p5.random(lnA+20, lnB-20);
            hlns.push(lnC);
            lns2.push(consLine(0, lnC, painting_sqrt, lnC, p5));
          }
        }
      }
      else {
        if (vlns.length > 1) {
          var m = p5.int(p5.random(vlns.length-1));
          var lnA = vlns[m];
          var lnB = vlns[m+1];
          if (lnB - lnA >= 40) {
            var lnC = p5.random(lnA+20, lnB-20);
            vlns.push(lnC);
            lns2.push(consLine(lnC, 0, lnC, painting_sqrt, p5));
          }
        }
      }
    }
  }

  /**
   * Converts two arrays of floating point numbers representing horizontal and vertical
   * grid lines into the rectangles implied by those grid lines.
   * @param {float[]} hlns - the horizontal grid lines
   * @param {float[]} vlns - the vertical grid lines
   * @return an array of rectangles
   */
  function toRects(hlns, vlns) {
    var rs = [];

    for (var i=-1; i<vlns.length; i++) {
      for (var j=-1; j<hlns.length; j++) {
        var x1 = (i >= 0) ? vlns[i] : 0;
        var y1 = (j >= 0) ? hlns[j] : 0;
        var x2 = (i+1 < vlns.length) ? vlns[i+1] : painting_sqrt;
        var y2 = (j+1 < hlns.length) ? hlns[j+1] : painting_sqrt;

        rs.push(consRect(x1, y1, x2, y2));
      }
    }

    return rs;
  }

  /**
   * Sorts an array of floating point numbers in ascending order.
   * @param {float[]} xs - an array of floating point numbers
   */
  function sort(xs) {
    for (var i=0; i<xs.length; i++) {
      for (var j=i+1; j<xs.length; j++) {
        if (xs[j] < xs[i]) {
          var temp = xs[j];
          xs[j] = xs[i];
          xs[i] = temp;
        }
      }
    }
  }

  /**
   * Saves the canvas as a png image.
   */
  function saveMondrian() {
    p5.loadPixels();
    var img = p5.get(painting_x+1, painting_y+1, painting_sqrt-1, painting_sqrt-1);
    p5.save(img, 'mondrian.png');
  }
}
