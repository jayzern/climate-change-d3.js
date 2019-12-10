export function plot_map_2d(data, g) {
    var width = 600;
    var height = 520;

    // Projection
    var map2dProjection = d3
        .geoNaturalEarth2()
        .scale(width / 1.3 / Math.PI)
        .translate([width / 2, height / 2]);

    var rScaleMap2dSolar = d3
        .scaleLinear()
        .domain([0, d3.max(data['solar_generation'], d => +d.generation)])
        .range([1, 50]);

    // Keep track of year for scroller
    var mapYear = '2018';

    // Draw 2D map
    g.append('g')
        .attr('class', 'map-2d')
        .selectAll('path')
        .data(data['map2D'].features)
        .enter()
        .append('path')
        .attr('fill', 'white')
        .attr('d', d3.geoPath().projection(map2dProjection))
        .style('stroke', '#000')

    // Draw Circles
    g.append('g')
        .attr('class', 'map-2d')
        .selectAll('circle')
        .data(data['solar_generation'])
        .enter()
        .append('circle')
        .attr('fill-opacity', 0.5)
        .attr('r', function(d) {
            if (d.year == mapYear) {
                try {
                    return rScaleMap2dSolar(d.generation);
                } catch {
                    // Do something
                }
            }
        })
        .attr('transform', function(d) {
            if (d.year == mapYear) {
                try {
                    return (
                        'translate(' +
                        map2dProjection([
                            +data['geoDict'][d['country']].LON,
                            +data['geoDict'][d['country']].LAT
                        ]) +
                        ')'
                    );
                } catch (err) {
                    // Do something
                }
            }
        })
        .style('stroke', '#000')
        .style('fill', 'blue');

    // Slider
    var dataTime = d3.range(0, 10).map(function(d) {
        return new Date(2009 + d, 10, 3);
    });

    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(dataTime))
        .max(d3.max(dataTime))
        .step(1000 * 60 * 60 * 24 * 365)
        .width(580)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues(dataTime)
        .default(new Date(2018, 10, 3))
        .on('onchange', val => {
            var newYear = d3.timeFormat('%Y')(val);

            // If new year then transition
            if (newYear != mapYear) {
                //console.log("Years match, do something")
                g.selectAll('.map-2d circle')
                    //.transition()
                    //.duration(2000)
                    .attr('r', function(d) {
                        if (d.year == newYear) {
                            try {
                                return rScaleMap2dSolar(d.generation);
                            } catch {
                                // Do something
                            }
                        }
                    })
                    .attr('transform', function(d) {
                        if (d.year == newYear) {
                            try {
                                return (
                                    'translate(' +
                                    map2dProjection([
                                        +data['geoDict'][d['country']].LON,
                                        +data['geoDict'][d['country']].LAT
                                    ]) +
                                    ')'
                                );
                            } catch (err) {
                                // Do something
                            }
                        }
                    });

                // Then update the current Year
                mapYear = newYear;
            }
        });

    var gTime = g
        .append('g')
        .attr('class', 'map-2d')
        .attr('transform', 'translate(15,500)');

    gTime.call(sliderTime);
}
