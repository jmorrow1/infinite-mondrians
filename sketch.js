/*
 * Infinite Mondrians
 * by James Morrow
 * jamesmorrowdesign.com
 * github.com/jmorrow1
 *
 * The entry point for p5.js into the application.
 * 
 */

function infiniteMondrians(p5) {
    var scalar = 1;
    var painting_x, painting_y, painting_sqrt;

    var colors;
    var argsList;
    var rects;

    //condition for which the algorithm is considered to fail and is restarted:
    var noColorDrawn;

    //slider
    var slider;

    //variables for controlling intro animation of a new painting
    var frameNum;
    var animating;

    p5.setup = function() {
        var canvas = p5.createCanvas(p5.displayWidth, p5.displayHeight);
        canvas.parent("canvas");

        painting_sqrt = p5.int(p5.min(p5.windowWidth, p5.windowHeight)) - 120;
        painting_x = p5.windowWidth/2 - painting_sqrt/2;
        painting_y = 5;

        initControllers(0);

        colors = [p5.color(238,227,10), p5.color(60, 67, 129), p5.color(222, 47, 47), p5.color(0, 0, 0)];

        runAlgorithm();

        animating = true;
        frameNum = 0;
        p5.frameRate(30);
    }

    function initControllers(initSliderValue) {
        slider = p5.createSlider(0, painting_sqrt, initSliderValue);
        slider.position(painting_x, painting_y + painting_sqrt + 5);
        slider.size(painting_sqrt, 20);
        slider.touchMoved(draw);
        slider.touchStarted(draw);

        var generateButton = p5.createButton("Generate");
        generateButton.touchStarted(generate);
        generateButton.position(painting_x + painting_sqrt/2 - generateButton.size().width/2, slider.position().y + slider.size().height + 5);

        var saveButton = p5.createButton("Save Image");
        saveButton.id("saveButton");
        saveButton.touchStarted(saveImage);
        saveButton.position(painting_x + painting_sqrt/2 - saveButton.size().width/2, generateButton.position().y + saveButton.size().height + 5);
    }

    var firstDrawCall = true;

    p5.draw = function() {
        if (firstDrawCall) {
          firstDrawCall = false;
          p5.resizeCanvas(p5.windowWidth, p5.windowHeight); //hack to get app to display correctly when loaded on iphone in landscape view
        }

        if (animating) {
            if (frameNum < rects.length) {
                frameNum++;
                drawRectsByFrame(frameNum);
                var slider_position = map(frameNum, 0, rects.length, 0, painting_sqrt);
                slider.value(slider_position);
            }
            else {
                animating = false;
            }
        }
        else {
            drawRectsByFrame(p5.map(slider.value(), 0, painting_sqrt, 0, rects.length));
        }

        if (!animating) {
            noLoop();
        }
    }

    p5.windowResized = function() {
        console.log("windowResized()");
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        var prev_painting_sqrt = painting_sqrt;
        painting_sqrt = p5.int(p5.min(p5.windowWidth, p5.windowHeight)) - 120;
        scalar *= (painting_sqrt / prev_painting_sqrt);
        painting_x = p5.windowWidth/2 - painting_sqrt/2;
        painting_y = 5;
        var sliderValue = slider.value();
        p5.removeElements();
        initControllers(painting_sqrt);
        drawRectsByFrame(frameNum);
    }

    function drawRectsByFrame(iterationNum) {
        if (iterationNum == undefined) {
            iterationNum = frameNum;
        }
        p5.push();
        p5.translate(painting_x, painting_y);
        p5.scale(scalar, scalar);
        p5.background(255);
        p5.stroke(0);
        p5.strokeWeight(4 / scalar);
        for (var i=0; i<iterationNum; i++) {
            var r = rects[i];
            r.display();
        }
        p5.pop();
    }

    function generate() {
        scalar = 1;
        runAlgorithm();
        animating = true;
        frameNum = 0;
        loop();
    }

    function saveImage() {
        p5.loadPixels();
        var img = p5.get(painting_x, painting_y, painting_sqrt + 1, painting_sqrt + 1);
        p5.save(img, 'mondrian.png');
    }

    /*Mondrian-generating Algorithm*/

    function runAlgorithm() {
        applySettingsPreset(int(random(numPresets)));

        clearState();
        var initialCondition = [0, 0, painting_sqrt, painting_sqrt, initial_cell_size];
        argsList.push(initialCondition);

        //algorithm:
        var i=0;
        while (argsList.length != 0) {
            var args = argsList.pop();
            step(args[0], args[1], args[2], args[3], args[4]);
            i++;
        }

        //do-over if too little was drawn:
        if (i < 10) runAlgorithm();

        //do-over if no color was drawn:
        if (noColorDrawn) runAlgorithm();

    }

    function clearState() {
        noColorDrawn = true;
        argsList = [];
        rects = [];
    }

    function step(x1, y1, x2, y2, cellSize) {
        if (x2-x1 <= cutoffWidth || y2-y1 <= cutoffHeight || random(1) < 0.15) { //exit recursive loop
            if (random(1) < p_of_coloring_leaf) {
                noColorDrawn = false;
                rects.push(new Rect(x1, y1, x2, y2, getColor()));
            }
        }
        else { //continue recursive loop

            /*maybe change cell size*/
            var r = random(1);
            if (cellSize > cutoff_past_which_not_to_divide_cell_size) {
                if (r < p_of_dividing_by_3) {
                    cellSize /= 3.0;
                }
                else if (r < p_of_dividing_by_3 + p_of_dividing_by_5) {
                    cellSize /= 5.0;
                }
            }

            /*set up Rects (choose a horizontal cut or a vertical cut)*/
            var r1, r2;
            if (random(1) < 0.5) { //horizontal cut
                var numCellsBetweeny1y2 = int((y2-y1)/cellSize);
                var new_y = y1 + cellSize * int(random(1, numCellsBetweeny1y2));

                r1 = new Rect(x1, y1, x2, new_y, NO_FILL);
                r2 = new Rect(x1, new_y, x2, y2, NO_FILL);
            }
            else { //vertical cut
                var numCellsBetweenx1x2 = int((x2-x1)/cellSize);
                var new_x = x1 + cellSize * int(random(1, numCellsBetweenx1x2));

                r1 = new Rect(x1, y1, new_x, y2, NO_FILL);
                r2 = new Rect(new_x, y1, x2, y2, NO_FILL);
            }

            /*maybe change one or both of the Rects colors from NO_FILL to something else*/
            if (r1.area() <= min_area_to_color_non_leaf) {
                if (random(1) < p_of_coloring_non_leaf) {
                    r1.col = getColor();
                }
            }
            if (r2.area() <= min_area_to_color_non_leaf) {
                if (random(1) < p_of_coloring_non_leaf) {
                    r2.col = getColor();
                }
            }


            /*add Rects to list & add args to list*/
            if (r1.area() > 0) {
                if (r1.col != NO_FILL) {
                    noColorDrawn = false;
                }
                rects.push(r1);
                argsList.push([r1.x1, r1.y1, r1.x2, r1.y2, cellSize]);

            }

            if (r2.area() > 0) {
                if (r2.col != NO_FILL) {
                    noColorDrawn = false;
                }

                rects.push(r2);
                argsList.push([r2.x1, r2.y1, r2.x2, r2.y2, cellSize]);

            }
        }
    }

    function getColor() {
        return colors[int(random(colors.length) - 0.3)]; //the "- 0.3" part is to decrease the chance of getting black
    }
}
