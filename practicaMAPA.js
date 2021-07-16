
d3.json('Practica/practica_airbnb.json')
.then((featureCollection) => {
    window.barrioSele="Palacio"
    drawMap(featureCollection);
});

var tooltipM = d3.select("div").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute") //Para obtener la posicion correcta sobre los circulos
    .style("pointer-events", "none") //Para evitar el flicker
    //.style("opacity", 0)
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px");

function drawMap(featureCollection) {
    
    var width = 800;
    var height = 800;

    var svg = d3.select('div.map')
        .append('svg')
        .attr('width', width)
        .attr('height', height+110)
        .attr('padding-top', 50 )
        .append('g');

    var center = d3.geoCentroid(featureCollection); 

    /* console.log(center) */


    var projection = d3.geoMercator()
        .fitSize([width, height], featureCollection) // equivalente a  .fitExtent([[0, 0], [width, height]], featureCollection)
        //.scale(1000)
        //Si quiero centrar el mapa en otro centro que no sea el devuelto por fitSize.
        .center(center) //centrar el mapa en una long,lat determinada
        .translate([width / 2, height / 2]) //centrar el mapa en una posicion x,y determinada

    //console.log(projection([long,lat]))

    //Para crear paths a partir de una proyección 
    var pathProjection = d3.geoPath().projection(projection);
    //console.log(pathProjection(featureCollection.features[0]))
    var features = featureCollection.features;

    var createdPath = svg.selectAll('path')
        .data(features)
        .enter()
        .append('path')
        .attr('d', (d) => pathProjection(d))
        .attr("opacity", function(d, i) {
            d.opacity = 1
            return d.opacity
        })
        .attr("transform", "translate(0,110)");

    createdPath.on('mouseover', handleMouseOverM);
    createdPath.on('mouseout', handleMouseOutM);
    createdPath.on('click', function(event, d){
        d3.select(this);
        d3.select(".axis > *").remove()
        window.barrioSele = d.properties.name;
        /* console.log(window.barrioSele); */
        drawAxis(featureCollection);
    }); 

    var prices=[];
    features.forEach( (d) =>{
            var valor = +d.properties.avgprice;
            if (valor > 0) prices.push(valor);
            
    });

    var minPromPrices = Math.min.apply(null,prices);
    var maxPromPrices = Math.max.apply(null,prices);

    /* console.log("todos los precios " + prices);
    console.log("promedio max " + maxPromPrices);  */



    var sequentialScale = d3.scaleSequential()
    .domain([minPromPrices,maxPromPrices])
    .interpolator(d3.interpolateSpectral);

    /* console.log(sequentialScale(19));
    console.log(sequentialScale(200));
    console.log(sequentialScale(120)); */
    createdPath.attr('fill', (d) => sequentialScale(d.properties.avgprice));



    //Creacion de una leyenda
            
            
    svg
    .append("g")
    .attr("class", "legendSequential")
    .attr("transform", "translate(0,40)")
    ;

    var legendSequential = d3.legendColor()
    .shapeWidth(60)
    .cells(10)
    .orient("horizontal")
    .scale(sequentialScale);

    svg.select(".legendSequential")
    .call(legendSequential);

    svg.append("text")
    .attr("y", 20)
    .text("Escala secuencial de precios en Euros");

    svg.append("text").attr("y",100)
    .text("WARNING: El color negro indica SIN precio conocido.")
    

    }

    function handleMouseOverM(event, d) {

    /* console.log(d) */
    tooltipM
    .transition()
    .duration(200)
    .style("visibility", "visible")
    .style("left", event.pageX + 20 + "px")
    .style("top", event.pageY - 30 + "px")
    .text(`Area: ${d.properties.name}, Price: ${d.properties.avgprice} Eur`);
    }

    function handleMouseOutM(event, d) {

    tooltipM.transition().duration(200).style("visibility", "hidden");

    }

    /* window.barrioSele="Palacio"
    function handleMouseClickM(event, d){
        
    } */