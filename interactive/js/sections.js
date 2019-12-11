/*
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */

import { plot_dry_earth, plot_rich_earth } from './earth.js';
import {
    plot_line_temp,
    plot_line_co2,
    plot_line_co2_ratio
} from './line_animations.js';
import { plot_top_countries } from './top_countries.js';
import { plot_map_2d } from './map_2d.js';

var scrollVis = function() {
    // constants to define the size
    // and margins of the vis area.
    var width = 600;
    var height = 520;
    var margin = { top: 0, left: 20, bottom: 40, right: 10 };

    // Keep track of which visualization
    // we are on and which was the last
    // index activated. When user scrolls
    // quickly, we want to call all the
    // activate functions that they pass.
    var lastIndex = -1;
    var activeIndex = 0;

    // main svg used for visualization
    var svg = null;

    // d3 selection that will be used
    // for displaying visualizations
    var g = null;

    // When scrolling to a new section
    // the activation function for that
    // section is called.
    var activateFunctions = [];
    // If a section has an update function
    // then it is called while scrolling
    // through the section with the current
    // progress through the section.
    var updateFunctions = [];

    /**
     * chart
     *
     * @param selection - the current d3 selection(s)
     *  to draw the visualization in. For this
     *  example, we will be drawing it in #vis
     */
    var chart = function(selection) {
        selection.each(function(data) {
            var svg = d3.select(this).append('svg');

            svg.attr('width', width + margin.left + margin.right);
            svg.attr('height', height + margin.top + margin.bottom);

            svg.append('g');

            // this group element will be used to contain all
            // other elements.
            g = svg
                .select('g')
                .attr(
                    'transform',
                    'translate(' + margin.left + ',' + margin.top + ')'
                );

            setupVis(data);

            setupSections();
        });
    };

    var show_dry_earth;
    var show_line_temp;
    var show_line_co2;
    var show_line_co2_ratio;
    var show_top_countries;
    var show_map_2d;
    var show_rich_earth;
    /**
     * setupVis - creates initial elements for all
     * sections of the visualization.
     */
    var setupVis = function(data) {
        // Show the dry earth
        show_dry_earth = plot_dry_earth(g);

        // Show Animated Line Plot with Temperature
        show_line_temp = plot_line_temp(data, g);

        // Show Animated Line Plot with CO2
        show_line_co2 = plot_line_co2(data, g);

        // Show Animated Line Plot with CO2 Ratio
        show_line_co2_ratio = plot_line_co2_ratio(data, g);

        // Show Map 2d for renewables and emissions
        show_map_2d = plot_map_2d(data, g);

        // Top Countries Plot
        show_top_countries = plot_top_countries(
            data['top_countries_ratios'],
            data['region_map']
        );

        // Show the rich earth
        show_rich_earth = plot_rich_earth(g);
    };

    /**
     * setupSections - each section is activated
     * by a separate function. Here we associate
     * these functions to the sections based on
     * the section's index.
     *
     */
    var setupSections = function() {
        // activateFunctions are called each
        // time the active section changes
        activateFunctions[0] = showDryEarth;
        activateFunctions[1] = showTempLine;
        activateFunctions[2] = showCO2Line;
        activateFunctions[3] = showCO2RatioLine;
        activateFunctions[4] = showMapHydro;
        activateFunctions[5] = showMapWind;
        activateFunctions[6] = showMapSolar;
        activateFunctions[7] = showTopCountries;
        activateFunctions[8] = showRichEarth;

        // updateFunctions are called while
        // in a particular section to update
        // the scroll progress in that section.
        // Most sections do not need to be updated
        // for all scrolling and so are set to
        // no-op functions.
        for (var i = 0; i < 9; i++) {
            updateFunctions[i] = function() {};
        }
    };

    /**
     * ACTIVATE FUNCTIONS
     *
     * These will be called their
     * section is scrolled to.
     *
     * General pattern is to ensure
     * all content for the current section
     * is transitioned in, while hiding
     * the content for the previous section
     * as well as the next section (as the
     * user may be scrolling up or down).
     *
     */
    function showDryEarth() {
        g.selectAll('.dry_earth')
            .transition()
            .duration(600)
            .style('opacity', 1)
            .style('pointer-events', 'all');

        g.selectAll('.segment_dry')
            .transition()
            .duration(600)
            .style('opacity', 0.6);

        g.selectAll('.graticule_dry')
            .transition()
            .duration(600)
            .style('opacity', 1);

        g.selectAll('.temp_plot')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');

        g.select('#temp_path_text')
            .style('opacity', '0')
            .style('pointer-events', 'none');
    }

    function showTempLine() {
        g.selectAll('.dry_earth')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');

        // Set first graph to be visible
        g.selectAll('.temp_plot')
            .transition()
            .duration(600)
            .style('opacity', 1)
            .style('pointer-events', 'all');

        var path = g.select('#temp_path');
        var pathlength = path.node().getTotalLength();
        var transitionPath = d3
            .transition()
            .ease(d3.easeExp)
            .duration(4000);
        path.attr('stroke-dashoffset', pathlength);
        path.transition(transitionPath)
            .attr('stroke', 'darkred')
            .attr('stroke-dashoffset', 0);

        // Retransitioning of Text
        g.select('#temp_path_text')
            .style('opacity', '0')
            .transition()
            .ease(d3.easeExp, 100)
            .duration(7000)
            .style('opacity', '1')
            .style('pointer-events', 'all');

        // Set next graph to be invisible when scroll back up
        g.selectAll('.co2_plot')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');
    }

    function showCO2Line() {
        // Set previous graph to be invisible
        g.selectAll('.temp_plot')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');

        g.select('#temp_path_text')
            .style('opacity', '0')
            .style('pointer-events', 'none');

        // Show current graph
        g.selectAll('.co2_plot')
            .transition()
            .duration(600)
            .style('opacity', 1)
            .style('pointer-events', 'all');

        var path = g.select('#co2_path');
        var pathlength = path.node().getTotalLength();
        var transitionPath = d3
            .transition()
            .ease(d3.easeExp)
            .duration(4000);
        path.attr('stroke-dashoffset', pathlength);
        path.transition(transitionPath).attr('stroke-dashoffset', 0);

        // Retransitioning of Text
        g.select('#co2_path_text')
            .style('opacity', '0')
            .transition()
            .ease(d3.easeExp, 100)
            .duration(7000)
            .style('opacity', '1')
            .style('pointer-events', 'all');

        // Set next graph to be invisible
        g.selectAll('.co2_ratio_plot')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');

        g.select('#co2_ratio_path_text')
            .style('opacity', '0')
            .style('pointer-events', 'none');
    }

    function showCO2RatioLine() {
        // Set previous graph to be invisible
        g.selectAll('.co2_plot')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');

        g.select('#co2_path_text')
            .style('opacity', '0')
            .style('pointer-events', 'none');

        // Show current graph
        g.selectAll('.co2_ratio_plot')
            .transition()
            .duration(600)
            .style('opacity', 1)
            .style('pointer-events', 'all');

        // Retransitioning of Line Graph
        var path = g.select('#co2_ratio_path');
        var pathlength = path.node().getTotalLength();
        var transitionPath = d3
            .transition()
            .ease(d3.easeExp)
            .duration(4000);
        path.attr('stroke-dashoffset', pathlength);
        path.transition(transitionPath).attr('stroke-dashoffset', 0);

        // Retransitioning of Text
        g.select('#co2_ratio_path_text')
            .style('opacity', '0')
            .transition()
            .ease(d3.easeExp, 100)
            .duration(7000)
            .style('opacity', '1')
            .style('pointer-events', 'all');

        // Set next graph to be invisible
        g.selectAll('#map-2d')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');

        g.selectAll('.map-2d-hydro circle')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');
    }


    function showMapHydro() {
        // Show current graph
        g.selectAll('.co2_ratio_plot')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');
        // Retransitioning of Text
        g.select('#co2_ratio_path_text')
            .style('opacity', '0')
            .style('pointer-events', 'none');

        // Set title
        d3.selectAll('#map-2d')
          .select('text')
          .transition()
          .duration(600)
          .text('Countries and Renewable Energy Generation by Terawatt-hours');

        g.selectAll('.map-2d-carbon circle')
            .transition()
            .duration(600)
            .style('pointer-events', 'none')
            .style('opacity', 0);

        g.selectAll('#map-2d')
            .transition()
            .duration(600)
            .style('opacity', 1)
            .style('pointer-events', 'all');

        g.selectAll('.map-2d-hydro circle')
            .transition()
            .duration(600)
            .style('opacity', 1)
            .style('pointer-events', 'all');

        g.selectAll('.map-2d-wind circle')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');
    }

    function showMapWind() {
        g.selectAll('.map-2d-hydro circle')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');

        g.selectAll('#map-2d')
            .transition()
            .duration(600)
            .style('opacity', 1)
            .style('pointer-events', 'all');

        g.selectAll('.map-2d-wind circle')
            .transition()
            .duration(600)
            .style('opacity', 1)
            .style('pointer-events', 'all');

        g.selectAll('.map-2d-solar circle')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');
    }

    function showMapSolar() {
        g.selectAll('.map-2d-wind circle')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');

        g.selectAll('#map-2d')
            .transition()
            .duration(600)
            .style('opacity', 1)
            .style('pointer-events', 'all');

        g.selectAll('.map-2d-solar circle')
            .transition()
            .duration(600)
            .style('opacity', 1)
            .style('pointer-events', 'all');

        // Set next graph to be invisible
        d3.select('#top_countries_ratio')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');

        d3.selectAll('.dot')
            .attr('cy', 0)
            .style('opacity', 0);
    }

    function showTopCountries() {
        // Set Jay's section to 0
        g.selectAll('.map-2d-solar circle')
            .transition()
            .duration(600)
            .style('pointer-events', 'none')
            .style('opacity', 0);

        g.selectAll('#map-2d')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');

        d3.select('#top_countries_ratio')
            .transition()
            .duration(600)
            .style('opacity', 1)
            .style('pointer-events', 'all');

        show_top_countries();

        g.selectAll('.rich_earth')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');

        g.selectAll('.segment_rich')
            .transition()
            .duration(600)
            .style('opacity', 0);

        g.selectAll('.graticule_rich')
            .transition()
            .duration(600)
            .style('opacity', 0);
    }

    function showRichEarth() {
        g.selectAll('.rich_earth')
            .transition()
            .duration(600)
            .style('opacity', 1)
            .style('pointer-events', 'all');

        g.selectAll('.segment_rich')
            .transition()
            .duration(600)
            .style('opacity', 0.6);

        g.selectAll('.graticule_rich')
            .transition()
            .duration(600)
            .style('opacity', 1);

        g.selectAll('#top_countries_ratio')
            .transition()
            .duration(600)
            .style('opacity', 0)
            .style('pointer-events', 'none');

        d3.selectAll('.dot')
            .attr('cy', 0)
            .style('opacity', 0);
    }

    /**
     * UPDATE FUNCTIONS
     *
     * These will be called within a section
     * as the user scrolls through it.
     *
     * We use an immediate transition to
     * update visual elements based on
     * how far the user has scrolled
     *
     */
    function updateGraphMidway() {
        // Insert code here
    }

    /**
     * DATA FUNCTIONS
     *
     * Used to coerce the data into the
     * formats we need to visualize
     *
     */
    function getData() {
        // Insert code here
    }

    /**
     * activate -
     *
     * @param index - index of the activated section
     */
    chart.activate = function(index) {
        activeIndex = index;
        var sign = activeIndex - lastIndex < 0 ? -1 : 1;
        var scrolledSections = d3.range(
            lastIndex + sign,
            activeIndex + sign,
            sign
        );
        scrolledSections.forEach(function(i) {
            activateFunctions[i]();
        });
        lastIndex = activeIndex;
    };

    /**
     * update
     *
     * @param index
     * @param progress
     */
    chart.update = function(index, progress) {
        updateFunctions[index](progress);
    };

    // return chart function
    return chart;
};

/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(data) {
    // create a new plot and
    // display it
    var plot = scrollVis();
    d3.select('#vis')
        .datum(data)
        .call(plot);

    // setup scroll functionality
    var scroll = scroller().container(d3.select('#graphic'));

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));

    // setup event handling
    scroll.on('active', function(index) {
        // highlight current step text
        d3.selectAll('.step').style('opacity', function(d, i) {
            return i === index ? 1 : 0.1;
        });

        // activate current section
        plot.activate(index);
    });

    scroll.on('progress', function(index, progress) {
        plot.update(index, progress);
    });
}

// load data and display

d3.queue()
    .defer(d3.csv, 'data/annual_temp_emissions.csv')
    .defer(
        d3.json,
        'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
    )
    .defer(d3.csv, 'data/geocoding.csv')
    .defer(d3.csv, 'data/solar_generation.csv')
    .defer(d3.csv, 'data/wind_generation.csv')
    .defer(d3.csv, 'data/hydro_generation.csv')
    .defer(d3.csv, 'data/carbon_generation.csv')
    .defer(d3.csv, 'data/renewables_generation.csv')
    .defer(d3.csv, 'data/top_countries_ratio.csv')
    .defer(d3.csv, 'data/regions_mapping.csv')
    .await(function(
        error,
        annual_temp_emissions,
        map2D,
        geocoding,
        solar_generation,
        wind_generation,
        hydro_generation,
        carbon_generation,
        renewables_generation,
        top_countries_ratios,
        region_map
    ) {
        if (error) {
            console.error('Oh dear, something went wrong: ' + error);
        } else {
            var data = {};
            var geoDict = {};
            // HACK: Turn geocoding into a hashmap
            for (var i = 0; i < geocoding.length; i++) {
                geoDict[geocoding[i].country] = {
                    LON: geocoding[i].LON,
                    LAT: geocoding[i].LAT
                };
            }
            data['annual_temp_emissions'] = annual_temp_emissions;
            data['map2D'] = map2D;
            data['geoDict'] = geoDict;
            data['solar_generation'] = solar_generation;
            data['wind_generation'] = wind_generation;
            data['hydro_generation'] = hydro_generation;
            data['carbon_generation'] = carbon_generation;
            data['renewables_generation'] = renewables_generation;
            data['top_countries_ratios'] = top_countries_ratios;
            data['region_map'] = region_map;
            display(data);
        }
    });
