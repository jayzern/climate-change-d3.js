/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
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
        selection.each(function(rawData) {
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

            // Jay: Process ur data here
            var data = null;
            console.log(rawData);
            // data = process(rawData)

            setupVis(data);

            setupSections();
        });
    };

    /**
     * setupVis - creates initial elements for all
     * sections of the visualization.
     *
     * @param wordData - data object for each word.
     * @param fillerCounts - nested data that includes
     *  element for each filler word type.
     * @param histData - binned histogram data
     */
    var setupVis = function(data) {
      // JAY: add graphs here, set opacity to 0

      // Projection
      var map2dProjection = d3.geoNaturalEarth2()
          .scale(width / 1.3 / Math.PI)
          .translate([width / 2, height / 2])
      var rScaleMap2dSolar = d3.scaleLinear()
        .domain([0, d3.max(data["solar_generation"], d => +d.generation)])
        .range([1, 50]);

      // Draw 2D map
      g.append("g")
        .attr('class', 'blue-rect')
        .selectAll("path")
        .data(data["map2D"].features)
        .enter().append("path")
          .attr("fill", "white")
          .attr("d", d3.geoPath()
              .projection(map2dProjection)
          )
          .style("stroke", "#000")

      // Draw Circles
      g.append("g")
        .attr('class', 'blue-rect')
        .selectAll("circle")
        .data(data["solar_generation"])
        .enter().append("circle")
          .attr('fill-opacity', 0.5)
          .attr("r", function(d) {
            if (d.year == "2018") {
              try {
                return rScaleMap2dSolar(d.generation)
              } catch {
                // Do something
              }
            }
          })
          .attr("transform", function(d) {
            if (d.year == "2018") {
              try {
                return "translate(" + map2dProjection([
                  +data["geoDict"][d["country"]].LON,
                  +data["geoDict"][d["country"]].LAT
                ]) + ")";
              } catch(err) {
                // Do something
              }
            }
          })
          .style("stroke", "#000")
          .style("fill", "green");


      g.append("rect")
        .attr('class', 'blue-rect2')
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", "300")
        .attr("height", "300")
        .attr("fill", "lightblue")
        .attr('opacity', 0);

      g.append("rect")
        .attr('class', "red-rect")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", "300")
        .attr("height", "300")
        .attr("fill", "red")
        .attr('opacity', 0);

      g.append("rect")
        .attr('class', "green-rect")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", "300")
        .attr("height", "300")
        .attr("fill", "green")
        .attr('opacity', 0);
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
        activateFunctions[0] = showBlueRect;
        activateFunctions[1] = showRedRect;
        activateFunctions[2] = showGreenRect;

        // updateFunctions are called while
        // in a particular section to update
        // the scroll progress in that section.
        // Most sections do not need to be updated
        // for all scrolling and so are set to
        // no-op functions.
        for (var i = 0; i < 3; i++) {
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
    function showBlueRect() {
        // Set first graph to be visible
        g.selectAll('.blue-rect')
            .transition()
            .duration(600)
            .attr('opacity', 1);

        // Set next graph to be invisible when scroll back up
        g.selectAll('.red-rect')
            .transition()
            .duration(600)
            .attr('opacity', 0);
    }

    function showRedRect() {
        // Set previous graph to be invisible
        g.selectAll('.blue-rect')
            .transition()
            .duration(600)
            .attr('opacity', 0);

        // Set next graph to be invisible
        g.selectAll('.green-rect')
            .transition()
            .duration(600)
            .attr('opacity', 0);

        // Set current graph to be visible
        g.selectAll('.red-rect')
            .transition()
            .duration(600)
            .attr('opacity', 1);
    }

    function showGreenRect() {
        // Set previous graph to be invisible
        g.selectAll('.red-rect')
            .transition()
            .duration(600)
            .attr('opacity', 0);

        // Set current graph to be visible
        g.selectAll('.green-rect')
            .transition()
            .duration(600)
            .attr('opacity', 1);
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
// d3.csv('http://localhost:8888/data/solar_generation.csv', display);

d3.queue()
.defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
.defer(d3.csv, 'http://localhost:8888/data/geocoding.csv')
.defer(d3.csv, 'http://localhost:8888/data/solar_generation.csv')
.defer(d3.csv, 'http://localhost:8888/data/renewables_vs_emissions.csv')
.await(function(error, map2D, geocoding, solar_generation, file2) {
    if (error) {
      console.error('Oh dear, something went wrong: ' + error);
    } else {
      var data = {}
      var geoDict = {}
      // HACK: Turn geocoding into a hashmap
      for (i = 0; i < geocoding.length; i++) {
        geoDict[geocoding[i].country] = {
          "LON": geocoding[i].LON,
          "LAT": geocoding[i].LAT
        }
      }
      data["map2D"] = map2D
      data["geoDict"] = geoDict
      data["solar_generation"] = solar_generation
      data["renewables_vs_emissions"] = file2
      display(data)
    }
});
