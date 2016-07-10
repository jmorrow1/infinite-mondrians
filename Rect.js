/*
 * Infinite Mondrians
 * by James Morrow
 * jamesmorrowdesign.com
 * github.com/jmorrow1
 */

var NO_FILL = -1;

function Rect (x1_,y1_,x2_,y2_,col_) {
	this.x1 = x1_;
	this.y1 = y1_;
	this.x2 = x2_;
	this.y2 = y2_;
	this.col = col_;
	
	this.display = function() {
		rectMode(CORNERS);
		if (this.col == NO_FILL) {
			noFill();
		}
		else	{
			fill(this.col);
		}
		rect(this.x1, this.y1, this.x2, this.y2);
	};
	
	this.area = function() {
		return this.width() * this.height();
	};
	
	this.width = function() {
		return this.x2-this.x1;
	};
	
	this.height = function() {
		return this.y2-this.y1;
	};
	
	this.toString = function() {
		return "x1 = " + this.x1 + ", y1 = " + this.y1 + ", x2 = " + this.x2 + ", y2 = " + this.y2 + ", col = " + this.col;
	}
}

function area(x1, y1, x2, y2) {
	return (y2-y1) * (x2-x1);
}