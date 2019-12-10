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

    // Draw 2D map
    chart.append('g')
        .attr('class', 'map-2d')
        .selectAll('path')
        .data(data['map2D'].features)
        .enter()
        .append('path')
        .attr('fill', 'white')
        .attr('d', d3.geoPath().projection(map2dProjection))
        .style('stroke', '#000');

    // Add title
    chart.append('text')
         .attr('class', 'map-2d')
         .attr('x', width / 2)
         .attr('y', 30)
         .text('Title')
         .style('text-anchor', 'middle')
         .style('font-weight', '800');

    // Initialize data
    var initSolarData = getMapData('solar_generation', '2018');
    var initWindData = getMapData('wind_generation', '2018');
    var initHydroData = getMapData('hydro_generation', '2018');

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
        .style('opacity', 0);

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
                var newSolarData = getMapData('solar_generation', newYear)
                var newWindData = getMapData('wind_generation', newYear)
                var newHydroData = getMapData('hydro_generation', newYear)

                console.log(g.selectAll('.map-2d-solar circle'))

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
