export function plot_top_countries(data) {
    var countries = [];
    var energy = [];

    Object.keys(data[0]).forEach(function(key) {
        countries.push(key);
        energy.push(+data[0][key]);
    });

    const svg = d3.select('svg');

    const margin = {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100
    };

    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const chart = svg
        .select('g')
        .append('g')
        .attr('id', 'top_countries_ratio')
        .attr('transform', `translate(${margin.left},100)`)
        .style('opacity', 0);

    const grp = chart
        .append('g')
        .attr('transform', `translate(-${margin.left},-${margin.top})`);

    // Create scales
    const yScale = d3
        .scaleLinear()
        .range([height, 0])
        .domain([d3.min(energy), d3.max(energy)]);

    const xScale = d3
        .scaleLinear()
        .range([width, 0])
        .domain([1, countries.length + 1]);

    // Add the X Axis
    chart
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', width)
        .attr('y', '3em')
        .style('text-anchor', 'end')
        .style('fill', 'gray')
        .style('font-size', '1.1em')
        .text('Country Ranking');

    // Add the Y Axis
    chart
        .append('g')
        .attr('transform', `translate(0, 0)`)
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left)
        .attr('dy', '5em')
        .style('text-anchor', 'end')
        .style('fill', 'gray')
        .style('font-size', '1.1em')
        .text('Renewable Energy Generation / Total Energy Consumed');

    // Tooltip
    // var tooltip = d3
    //     .select('#top_countries_ratio')
    //     .append('text')
    //     .attr('class', 'tooltipscatter')
    //     .style('opacity', 0);

    var tooltip = d3
        .select('#vis')
        .append('div')
        .attr('class', 'tooltipscatter')
        .style('opacity', 0);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    chart
        .append('g')
        .attr('pointer-events', 'all')
        .selectAll('dot')
        .data(energy)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('pointer-events', 'all')
        .style('opacity', 0)
        .attr('cx', function(d, i) {
            return xScale(i + 1);
        })
        .attr('cy', 0)
        .attr('r', 3)
        .style('fill', function(d, i) {
            return color(i);
        })
        .on('mouseover', function(d, i) {
            tooltip
                .transition()
                .duration(200)
                .style('opacity', 0.9);
            tooltip
                .html(
                    countries[i] +
                        '<br/> Rank: ' +
                        (i + 1) +
                        '<br/> Renewable Percent: ' +
                        (d * 100).toFixed(1) +
                        '%'
                )
                .style('top', yScale(d) + 'px')
                .style('left', xScale(i + 1) + 'px')
                .style('display', 'block');
        })
        .on('mouseout', function(d) {
            tooltip
                .transition()
                .duration(500)
                .style('opacity', 0);
        });

    return function() {
        d3.selectAll('.dot')
            .transition()
            .delay(function(d, i) {
                return (countries.length - i) * 20;
            })
            .attr('cy', function(d) {
                return yScale(d);
            })
            .style('opacity', 0.8);
    };
}
