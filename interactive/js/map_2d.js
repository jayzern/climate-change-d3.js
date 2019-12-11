export function plot_map_2d(data, g) {
    var width = 600;
    var height = 520;

    // One group for the entire chart
    var chart = g.append('g')
        .attr('id', 'map-2d')
        .style('opacity', 0);

    // Projection
    var map2dProjection = d3
        .geoNaturalEarth2()
        .scale(width / 1.3 / Math.PI)
        .translate([width / 2, height / 2]);

    var rMin = 1;
    var rMax = 50;

    // Create Scales for each data
    var rScaleMap2dSolar = d3
        .scaleLinear()
        .domain([0, d3.max(data['solar_generation'], d => +d.generation)])
        .range([rMin, rMax]);

    var rScaleMap2dWind = d3
        .scaleLinear()
        .domain([0, d3.max(data['wind_generation'], d => +d.generation)])
        .range([rMin, rMax]);

    var rScaleMap2dHydro = d3
        .scaleLinear()
        .domain([0, d3.max(data['hydro_generation'], d => +d.generation)])
        .range([rMin, rMax]);

    var rScaleMap2dCarbon = d3
        .scaleLinear()
        .domain([0, d3.max(data['carbon_generation'], d => +d.generation)])
        .range([rMin, rMax]);

    var rScaleMap2dRenewables = d3
        .scaleLinear()
        .domain([0, d3.max(data['renewables_generation'], d => +d.generation)])
        .range([rMin, rMax]);

    // Keep track of year for scroller
    var mapYear = '2018';

    // Function to fetch data based on year and type, i.e. renewables
    var getMapData = function(type, year) {
        return data[type].filter(data => data.year == year)
    };

    // Tool tip for hover hover
    var tooltip = d3
        .select('#vis')
        .append('div')
        .attr('class', 'tooltipscatter')
        .style('pointer-events', 'none')
        .style('opacity', 0);

    // Draw 2D map
    chart.append('g')
        .attr('class', 'map-2d')
        .selectAll('path')
        .data(data['map2D'].features)
        .enter()
        .append('path')
        .attr('fill', 'white')
        .attr('d', d3.geoPath().projection(map2dProjection))
        .style('stroke', '#000')

    // Add title
    chart.append('text')
         .attr('class', 'map-2d')
         .attr('x', width / 2)
         .attr('y', 30)
         .text('Countries and Renewable Energy Generation by Terawatt-hours')
         .style('text-anchor', 'middle')
         .style('font-weight', '800');


    // Initialize data
    var initSolarData = getMapData('solar_generation', '2018');
    var initWindData = getMapData('wind_generation', '2018');
    var initHydroData = getMapData('hydro_generation', '2018');
    var initCarbonData = getMapData('carbon_generation', '2018');
    var initRenewablesData = getMapData('renewables_generation', '2018');
    console.log(initRenewablesData)

    // Draw Circles
    chart.append('g')
        .attr('class', 'map-2d-solar')
        .selectAll('circle')
        .data(initSolarData, d => d.country) // Object Constancy map by country
        .enter()
        .append('circle')
            .attr('class', 'solar')
            .attr('fill-opacity', 0.5)
            .attr('r', function(d) {
                return rScaleMap2dSolar(d.generation);
            })
            .attr('transform', function(d) {
                try {
                    return (
                        'translate(' +
                        map2dProjection([
                            +data['geoDict'][d.country].LON,
                            +data['geoDict'][d.country].LAT
                        ]) +
                        ')'
                    );
                } catch {
                  // Do something
                }
            })
            .style('stroke', '#000')
            .style('fill', 'yellow')
            .on('mouseover', function(d, i) {
                var coords = map2dProjection([
                    +data['geoDict'][d.country].LON,
                    +data['geoDict'][d.country].LAT
                ]);
                tooltip
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9);

                tooltip
                    .html(
                        d.country +
                        '<br/> Solar (TWh): ' +
                        parseFloat(d.generation).toFixed(2)
                    )
                    .style('top', coords[1] + 'px')
                    .style('left', coords[0] + 'px')
                    .style('display', 'block');
            })
            .on('mouseout', function(d) {
                tooltip
                    .transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .style('pointer-events', 'none')
            .style('opacity', 0);

    chart.append('g')
        .attr('class', 'map-2d-wind')
        .selectAll('circle')
        .data(initWindData, d => d.country) // Object Constancy map by country
        .enter()
        .append('circle')
            .attr('fill-opacity', 0.5)
            .attr('r', function(d) {
                return rScaleMap2dWind(d.generation);
            })
            .attr('transform', function(d) {
                try {
                    return (
                        'translate(' +
                        map2dProjection([
                            +data['geoDict'][d.country].LON,
                            +data['geoDict'][d.country].LAT
                        ]) +
                        ')'
                    );
                } catch {
                  // Do something
                }
            })
            .style('stroke', '#000')
            .style('fill', 'gray')
            .on('mouseover', function(d, i) {
                var coords = map2dProjection([
                    +data['geoDict'][d.country].LON,
                    +data['geoDict'][d.country].LAT
                ]);
                tooltip
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9);

                tooltip
                    .html(
                        d.country +
                        '<br/> Wind (TWh): ' +
                        parseFloat(d.generation).toFixed(2)
                    )
                    .style('top', coords[1] + 'px')
                    .style('left', coords[0] + 'px')
                    .style('display', 'block');
            })
            .on('mouseout', function(d) {
                tooltip
                    .transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .style('pointer-events', 'none')
            .style('opacity', 0);

    chart.append('g')
        .attr('class', 'map-2d-hydro')
        .selectAll('circle')
        .data(initHydroData, d => d.country) // Object Constancy map by country
        .enter()
        .append('circle')
            .attr('fill-opacity', 0.5)
            .attr('r', function(d) {
                return rScaleMap2dHydro(d.generation);
            })
            .attr('transform', function(d) {
                try {
                    return (
                        'translate(' +
                        map2dProjection([
                            +data['geoDict'][d.country].LON,
                            +data['geoDict'][d.country].LAT
                        ]) +
                        ')'
                    );
                } catch {
                  // Do something
                }
            })
            .style('stroke', '#000')
            .style('fill', 'blue')
            .on('mouseover', function(d, i) {
                var coords = map2dProjection([
                    +data['geoDict'][d.country].LON,
                    +data['geoDict'][d.country].LAT
                ]);
                tooltip
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9);

                tooltip
                    .html(
                        d.country +
                        '<br/> Hydro (TWh): ' +
                        parseFloat(d.generation).toFixed(2)
                    )
                    .style('top', coords[1] + 'px')
                    .style('left', coords[0] + 'px')
                    .style('display', 'block');
            })
            .on('mouseout', function(d) {
                tooltip
                    .transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .style('pointer-events', 'none')
            .style('opacity', 0);


    chart.append('g')
        .attr('class', 'map-2d-carbon')
        .selectAll('circle')
        .data(initCarbonData, d => d.country) // Object Constancy map by country
        .enter()
        .append('circle')
            .attr('class', 'carbon')
            .attr('fill-opacity', 0.5)
            .attr('r', function(d) {
                return rScaleMap2dCarbon(d.generation);
            })
            .attr('transform', function(d) {
                try {
                    return (
                        'translate(' +
                        map2dProjection([
                            +data['geoDict'][d.country].LON,
                            +data['geoDict'][d.country].LAT
                        ]) +
                        ')'
                    );
                } catch {
                  // Do something
                }
            })
            .style('stroke', '#000')
            .style('fill', 'black')
            .on('mouseover', function(d, i) {
                var coords = map2dProjection([
                    +data['geoDict'][d.country].LON,
                    +data['geoDict'][d.country].LAT
                ]);
                tooltip
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9);

                tooltip
                    .html(
                        d.country +
                        '<br/> Million tonnes of CO2: <br/>' +
                        parseFloat(d.generation).toFixed(2)
                    )
                    .style('top', coords[1] + 'px')
                    .style('left', coords[0] + 'px')
                    .style('display', 'block');
            })
            .on('mouseout', function(d) {
                tooltip
                    .transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .style('pointer-events', 'none')
            .style('opacity', 0);

    chart.append('g')
        .attr('class', 'map-2d-renewables')
        .selectAll('circle')
        .data(initRenewablesData, d => d.country) // Object Constancy map by country
        .enter()
        .append('circle')
            .attr('class', 'carbon')
            .attr('fill-opacity', 0.5)
            .attr('r', function(d) {
                return rScaleMap2dRenewables(d.generation);
            })
            .attr('transform', function(d) {
                try {
                    return (
                        'translate(' +
                        map2dProjection([
                            +data['geoDict'][d.country].LON,
                            +data['geoDict'][d.country].LAT
                        ]) +
                        ')'
                    );
                } catch {
                  // Do something
                }
            })
            .style('stroke', '#000')
            .style('fill', 'green')
            .on('mouseover', function(d, i) {
                var coords = map2dProjection([
                    +data['geoDict'][d.country].LON,
                    +data['geoDict'][d.country].LAT
                ]);
                tooltip
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9);

                tooltip
                    .html(
                        d.country +
                        '<br/> Total Renewables (TWh): <br/>' +
                        parseFloat(d.generation).toFixed(2)
                    )
                    .style('top', coords[1] + 'px')
                    .style('left', coords[0] + 'px')
                    .style('display', 'block');
            })
            .on('mouseout', function(d) {
                tooltip
                    .transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .style('pointer-events', 'none')
            .style('opacity', 0);


    // Slider
    var dataTime = d3.range(0, 20).map(function(d) {
        return new Date(1999 + d, 10, 3);
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
                var newSolarData = getMapData('solar_generation', newYear)
                var newWindData = getMapData('wind_generation', newYear)
                var newHydroData = getMapData('hydro_generation', newYear)
                var newCarbonData = getMapData('carbon_generation', newYear)
                var newRenewablesData = getMapData('renewables_generation', newYear)

                // Update Solar
                //g.select('.map-2d circle')
                g.selectAll('.map-2d-solar circle')
                    .data(newSolarData, d => d.country)
                    .transition()
                    .duration(500)
                    .attr('r', function(d) {
                        return rScaleMap2dSolar(d.generation);
                    });

                // Update Wind
                g.selectAll('.map-2d-wind circle')
                    .data(newWindData, d => d.country)
                    .transition()
                    .duration(500)
                    .attr('r', function(d) {
                        return rScaleMap2dWind(d.generation);
                    });

                // Update Hydro
                g.selectAll('.map-2d-hydro circle')
                    .data(newHydroData, d => d.country)
                    .transition()
                    .duration(500)
                    .attr('r', function(d) {
                        return rScaleMap2dHydro(d.generation);
                    });

                // Update Carbon
                g.selectAll('.map-2d-carbon circle')
                    .data(newCarbonData, d => d.country)
                    .transition()
                    .duration(500)
                    .attr('r', function(d) {
                        return rScaleMap2dCarbon(d.generation);
                    });

                // Update Renewables
                g.selectAll('.map-2d-renewables circle')
                    .data(newRenewablesData, d => d.country)
                    .transition()
                    .duration(500)
                    .attr('r', function(d) {
                        return rScaleMap2dRenewables(d.generation);
                    });

                // Then update the current Year
                mapYear = newYear;
            }
        });

    var gTime = chart
        .append('g')
        .attr('class', 'map-2d')
        .attr('transform', 'translate(15,500)');

    gTime.call(sliderTime);
}
