/*
 * Infinite Mondrians
 * by James Morrow
 * jamesmorrowdesign.com
 * github.com/jmorrow1
 *
 * Different presets for the generation algorithm.
 *
 */

var cutoffWidth;
var cutoffHeight;
var p_of_dividing_by_3;
var p_of_dividing_by_5;
var initial_cell_size;
var cutoff_past_which_not_to_divide_cell_size;
var p_of_coloring_leaf;
var p_of_coloring_non_leaf;
var min_area_to_color_non_leaf;

var numPresets = 5;
function applySettingsPreset(i) {
	switch(i) {
		case 0 :
			cutoffWidth = 50;
			cutoffHeight = 50;
			p_of_dividing_by_3 = 0.2;
			p_of_dividing_by_5 = 0;
			initial_cell_size = 50;
			cutoff_past_which_not_to_divide_cell_size = 20;
			p_of_coloring_leaf = 0.25;
			p_of_coloring_non_leaf = 0.01;
			min_area_to_color_non_leaf = 40000;
			break;
		case 1:
			cutoffWidth = 50;
            cutoffHeight = 50;
            p_of_dividing_by_3 = 0.15;
            p_of_dividing_by_5 = 0;
			initial_cell_size = 50;
            cutoff_past_which_not_to_divide_cell_size = 20;
            p_of_coloring_leaf = 0.4;
            p_of_coloring_non_leaf = 0;
            min_area_to_color_non_leaf = 0;
         case 2:
			cutoffWidth = 150;
            cutoffHeight = 150;
            p_of_dividing_by_3 = 0.5;
            p_of_dividing_by_5 = 0;
			initial_cell_size = 100;
            cutoff_past_which_not_to_divide_cell_size = 20;
            p_of_coloring_leaf = 0.25;
            p_of_coloring_non_leaf = 0.01;
            min_area_to_color_non_leaf = 0;
            break;
		case 3:
			cutoffWidth = 50;
            cutoffHeight = 50;
            p_of_dividing_by_3 = 0.25;
            p_of_dividing_by_5 = 0.25;
			initial_cell_size= 250;
            cutoff_past_which_not_to_divide_cell_size = 20;
            p_of_coloring_leaf = 0.25;
            p_of_coloring_non_leaf = 0.01;
            min_area_to_color_non_leaf = 0;
            break;
		case 4:
            cutoffWidth = 150;
            cutoffHeight = 150;
            p_of_dividing_by_3 = 0.3;
            p_of_dividing_by_5 = 0;
			initial_cell_size = 166.6667;
            cutoff_past_which_not_to_divide_cell_size = 20;
            p_of_coloring_leaf = 0.25;
            p_of_coloring_non_leaf = 0.01;
            min_area_to_color_non_leaf = 50000;
            
            break;
	}
}