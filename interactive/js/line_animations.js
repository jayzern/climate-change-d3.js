export function plot_line_temp(data, g) {
    // Data from: https://www.ncdc.noaa.gov/monitoring-references/faq/anomalies.php#anomalies
    var width = 600;
    var height = 520;
    var margin = { top: 100, left: 100, bottom: 100, right: 100 };
    var gr = g
        .append('g')
        .attr('class', 'temp_plot')
        .style('opacity', 0);

    // Create scales
    const yScale = d3
        .scaleLinear()
        .range([height, margin.top])
        .domain([-3, 3]);

    const xScale = d3
        .scaleLinear()
        .range([0, width - margin.right - margin.left])
        .domain(
            d3.extent(
                data['annual_temp_emissions'],
                dataPoint => dataPoint.year
            )
        );

    // Outputs a path data string to use for the path
    const line = d3
        .line()
        .x(dataPoint => xScale(dataPoint.year))
        .y(dataPoint => yScale(dataPoint.Value));

    // Add path
    const path = gr
        .append('path')
        .attr('id', 'temp_path')
        .attr('transform', `translate(${margin.left},0)`)
        .datum(data['annual_temp_emissions'])
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 4.0)
        .attr('d', line);

    const pathLength = path.node().getTotalLength();
    const transitionPath = d3
        .transition()
        .ease(d3.easeExp)
        .duration(4000);

    path.attr('stroke-dashoffset', pathLength)
        .attr('stroke-dasharray', pathLength)
        .transition(transitionPath);
    //.attr("stroke", "darkred")
    //.attr("stroke-dashoffset", 0);

    var last_point = data['annual_temp_emissions'];
    // Add label to lines
    gr.append('text')
        .attr('id', 'temp_path_text')
        .attr(
            'transform',
            `translate(${width - margin.right + 10}, ${yScale(
                last_point[last_point.length - 1].Value
            )})`
        )
        .attr('text-anchor', 'start')
        .style('fill', 'darkred')
        .style('opacity', '0')
        .text('Temperature');
    /*.transition()
        .ease(d3.easeExp,100)
        .duration(7000)
        .style("opacity","1");*/

    // Add the X Axis
    gr.append('g')
        .attr('transform', `translate(${margin.left},${height})`)
        .call(
            d3
                .axisBottom(xScale)
                .ticks(10, 'd')
                .tickSizeOuter(0)
        );

    // Label for X Axis
    gr.append('text')
        .attr(
            'transform',
            'translate(' + width / 2 + ' ,' + (height + margin.bottom) + ')'
        )
        .style('text-anchor', 'middle')
        .text('Year');

    // Add the Y Axis
    gr.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).tickSizeOuter(0));

    // Label for Y Axis
    gr.append('text')
        .attr('x', margin.left)
        .attr('y', height / 2)
        .attr(
            'transform',
            `translate(${-width / 2 + margin.left - 10}, ${margin.top +
                height / 2 +
                50}) rotate(-90)`
        )
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Standardized Difference from Average of Variable');

    // Add the Title
    gr.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top)
        .style('text-anchor', 'middle')
        .text('Annual Growth of the Anomaly Value of Global Temperature');
}

export function plot_line_co2(data, g) {
    // Data from: https://www.ncdc.noaa.gov/monitoring-references/faq/anomalies.php#anomalies
    var width = 600;
    var height = 520;
    var margin = { top: 100, left: 100, bottom: 100, right: 100 };
    var gr = g
        .append('g')
        .attr('class', 'co2_plot')
        .style('opacity', 0);

    // Create scales
    const yScale = d3
        .scaleLinear()
        .range([height, margin.top])
        .domain([-3, 3]);

    const xScale = d3
        .scaleLinear()
        .range([0, width - margin.right - margin.left])
        .domain(
            d3.extent(
                data['annual_temp_emissions'],
                dataPoint => dataPoint.year
            )
        );

    // Outputs a path data string to use for the path
    const line_temp = d3
        .line()
        .x(dataPoint => xScale(dataPoint.year))
        .y(dataPoint => yScale(dataPoint.Value));

    const line_co2 = d3
        .line()
        .x(dataPoint => xScale(dataPoint.year))
        .y(dataPoint => yScale(dataPoint.co2));

    // Add path
    const path_temp = gr
        .append('path')
        .attr('transform', `translate(${margin.left},0)`)
        .datum(data['annual_temp_emissions'])
        .attr('fill', 'none')
        .attr('stroke', 'darkred')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 4.0)
        .attr('d', line_temp);

    // Add path
    const path_co2 = gr
        .append('path')
        .attr('id', 'co2_path')
        .attr('transform', `translate(${margin.left},0)`)
        .datum(data['annual_temp_emissions'])
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 4.0)
        .attr('d', line_co2);

    const pathLength = path_co2.node().getTotalLength();
    const transitionPath = d3
        .transition()
        .ease(d3.easeExp)
        .duration(4000);

    path_co2
        .attr('stroke-dashoffset', pathLength)
        .attr('stroke-dasharray', pathLength);
    //.transition(transitionPath)
    //.attr("stroke-dashoffset", 0);

    var last_point = data['annual_temp_emissions'];

    gr.append('text')
        .attr('id', 'co2_path_text')
        .attr(
            'transform',
            `translate(${width - margin.right + 10}, ${yScale(
                last_point[last_point.length - 1].co2
            )})`
        )
        .attr('text-anchor', 'start')
        .style('fill', 'grey')
        .style('opacity', '0')
        .text('CO2 Emissions');
    //.transition()
    //.ease(d3.easeExp,100)
    //.duration(7000)
    //.style("opacity","1");

    // Add the X Axis
    gr.append('g')
        .attr('transform', `translate(${margin.left},${height})`)
        .call(
            d3
                .axisBottom(xScale)
                .ticks(10, 'd')
                .tickSizeOuter(0)
        );

    // Label for X Axis
    gr.append('text')
        .attr(
            'transform',
            'translate(' + width / 2 + ' ,' + (height + margin.bottom) + ')'
        )
        .style('text-anchor', 'middle')
        .text('Year');

    // Add the Y Axis
    gr.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).tickSizeOuter(0));

    // Label for Y Axis
    gr.append('text')
        .attr('x', margin.left)
        .attr('y', height / 2)
        .attr(
            'transform',
            `translate(${-width / 2 + margin.left - 10}, ${margin.top +
                height / 2 +
                50}) rotate(-90)`
        )
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Standardized Difference from Average of Variable');

    // Add the Title
    gr.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top)
        .style('text-anchor', 'middle')
        .text('Annual Growth of CO2 Emissions');
}

export function plot_line_co2_ratio(data, g) {
    // Data from: https://www.ncdc.noaa.gov/monitoring-references/faq/anomalies.php#anomalies
    var width = 600;
    var height = 520;
    var margin = { top: 100, left: 100, bottom: 100, right: 100 };
    var gr = g
        .append('g')
        .attr('class', 'co2_ratio_plot')
        .style('opacity', 0);

    // Create scales
    const yScale = d3
        .scaleLinear()
        .range([height, margin.top])
        .domain([-3, 3]);

    const xScale = d3
        .scaleLinear()
        .range([0, width - margin.right - margin.left])
        .domain(
            d3.extent(
                data['annual_temp_emissions'],
                dataPoint => dataPoint.year
            )
        );

    // Outputs a path data string to use for the path
    const line_temp = d3
        .line()
        .x(dataPoint => xScale(dataPoint.year))
        .y(dataPoint => yScale(dataPoint.Value));

    const line_co2 = d3
        .line()
        .x(dataPoint => xScale(dataPoint.year))
        .y(dataPoint => yScale(dataPoint.co2));

    const line_co2_ratio = d3
        .line()
        .x(dataPoint => xScale(dataPoint.year))
        .y(dataPoint => yScale(dataPoint.annual_emission_rate));

    // Add path
    const path_temp = gr
        .append('path')
        .attr('transform', `translate(${margin.left},0)`)
        .datum(data['annual_temp_emissions'])
        .attr('fill', 'none')
        .attr('stroke', 'darkred')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 4.0)
        .attr('d', line_temp);

    // Add path
    const path_co2 = gr
        .append('path')
        .attr('transform', `translate(${margin.left},0)`)
        .datum(data['annual_temp_emissions'])
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 4.0)
        .attr('d', line_co2);

    // Add path
    const path_co2_ratio = gr
        .append('path')
        .attr('id', 'co2_ratio_path')
        .attr('transform', `translate(${margin.left},0)`)
        .datum(data['annual_temp_emissions'])
        .attr('fill', 'none')
        .attr('stroke', 'lightblue')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 4.0)
        .attr('d', line_co2_ratio);

    const pathLength = path_co2_ratio.node().getTotalLength();
    const transitionPath = d3
        .transition()
        .ease(d3.easeExp)
        .duration(4000);

    path_co2_ratio
        .attr('stroke-dashoffset', pathLength)
        .attr('stroke-dasharray', pathLength);
    //.transition(transitionPath)
    //.attr("stroke-dashoffset", 0);

    var last_point = data['annual_temp_emissions'];

    gr.append('text')
        .attr('id', 'co2_ratio_path_text')
        .attr(
            'transform',
            `translate(${width - margin.right + 5}, ${yScale(
                last_point[last_point.length - 1].annual_emission_rate
            )})`
        )
        .attr('text-anchor', 'start')
        .attr('font-size', '12')
        .style('fill', 'lightblue')
        .style('opacity', '0')
        .text('CO2 Emission Rate');
    //.transition()
    //.ease(d3.easeExp,100)
    //.duration(7000)
    //.style("opacity","1");

    // Add the X Axis
    gr.append('g')
        .attr('transform', `translate(${margin.left},${height})`)
        .call(
            d3
                .axisBottom(xScale)
                .ticks(10, 'd')
                .tickSizeOuter(0)
        );

    // Label for X Axis
    gr.append('text')
        .attr(
            'transform',
            'translate(' + width / 2 + ' ,' + (height + margin.bottom) + ')'
        )
        .style('text-anchor', 'middle')
        .text('Year');

    // Add the Y Axis
    gr.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).tickSizeOuter(0));

    // Label for Y Axis
    gr.append('text')
        .attr('x', margin.left)
        .attr('y', height / 2)
        .attr(
            'transform',
            `translate(${-width / 2 + margin.left - 10}, ${margin.top +
                height / 2 +
                50}) rotate(-90)`
        )
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Standardized Difference from Average of Variable');

    // Add the Title
    gr.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top)
        .style('text-anchor', 'middle')
        .text('Annual Decrease of CO2 Emission Rates');
}
