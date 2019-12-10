export function plot_dry_earth(g){
            const width = 600;
            const height = 520;
          	const config = {
              speed: 0.005,
              verticalTilt: 0,
              horizontalTilt: -10
            }
            let locations = [];
            const svg = g.append('svg')
                .attr('class','dry_earth')
                .attr('width', width)
                .attr('height', height)
                .style('opacity', 0);
            const markerGroup = svg.append('g');
            const projection = d3.geoOrthographic();
            const initialScale = projection.scale();
            const path = d3.geoPath().projection(projection);
            const center = [width/2, height/2];

            drawGlobe();    
            drawGraticule();
            enableRotation();    

            function drawGlobe() {  
                d3.queue()
                    .defer(d3.json, 'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json')          
                    .await((error, worldData) => {
                        svg.selectAll(".segment_dry")
                            .data(topojson.feature(worldData, worldData.objects.countries).features)
                            .enter().append("path")
                            .attr("class", "segment_dry")
                            .attr("d", path)
                            .style("stroke", "#888")
                            .style("stroke-width", "1px")
                            .style("fill", (d, i) => '#F9F0C3')
                            .style('opacity', 0.6);
                    });
            }

            function drawGraticule() {
                const graticule = d3.geoGraticule()
                    .step([10, 10]);

                svg.append("path")
                    .datum(graticule)
                    .attr("class", "graticule_dry")
                    .attr("d", path)
                    .style("fill", "#DBF2FB")
                    .style("stroke", "#E6E4E4")
            }

            function enableRotation() {
                d3.timer(function (elapsed) {
                    projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
                    svg.selectAll("path").attr("d", path);
                });
            }        

}

export function plot_rich_earth(g){
            const width = 960;
            const height = 500;
          	const config = {
              speed: 0.005,
              verticalTilt: 0,
              horizontalTilt: -10
            }
            let locations = [];
            const svg = g.append('svg').attr('class','rich_earth')
                .attr('width', width).attr('height', height);
            const markerGroup = svg.append('g');
            const projection = d3.geoOrthographic();
            const initialScale = projection.scale();
            const path = d3.geoPath().projection(projection);
            const center = [width/2, height/2];

            drawGlobe();    
            drawGraticule();
            enableRotation();    

            function drawGlobe() {  
                d3.queue()
                    .defer(d3.json, 'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json')          
                    .await((error, worldData) => {
                        svg.selectAll(".segment_rich")
                            .data(topojson.feature(worldData, worldData.objects.countries).features)
                            .enter().append("path")
                            .attr("class", "segment_rich")
                            .attr("d", path)
                            .style("stroke", "#888")
                            .style("stroke-width", "1px")
                            .style("fill", (d, i) => '#15B535')
                            .style("opacity", 0);
                    });
            }

            function drawGraticule() {
                const graticule = d3.geoGraticule()
                    .step([10, 10]);

                svg.append("path")
                    .datum(graticule)
                    .attr("class", "graticule_rich")
                    .attr("d", path)
                    .style("fill", "#90E8FA")
                    .style("stroke", "#BFEAF4")
                    .style('opacity', 0);
            }

            function enableRotation() {
                d3.timer(function (elapsed) {
                    projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
                    svg.selectAll("path").attr("d", path);
                });
            }        

}
