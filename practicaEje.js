d3.json('Practica/practica_airbnb.json')
    .then((featureCollection) => {
        drawAxis(featureCollection);
    });

function drawAxis(featureCollection) {

    
    

    var widthA = 800;
    var heightA = 800;
    var marginbottom = 100;
    var margintop = 50;
    /* console.log("La collecion es " + featureCollection.features); */

    var svgAxis = d3.select('.axis')
        .append('svg')
        .attr('width', widthA)
        .attr('height', heightA + marginbottom + margintop)
        .append('g')
        .attr("transform", "translate(0," + margintop + ")");

    
    
    
    var num_bed=[];
    var total_pro=[];
    var inputA =[];
    featureCollection.features.forEach( (d) =>{
        /* console.log(window.barrioSele) */
        if(d.properties.name == window.barrioSele){
            
            d.properties.avgbedrooms.forEach((g)=>{
                inputA.push(g);
                num_bed.push(g.bedrooms);
                total_pro.push(+g.total);
            });
            
           
        }                
    });
   /*  console.log("Numero de habitaciones " + num_bed); */

   



    //Creacion de escalas
    var xscaleA = d3.scaleBand()
    .domain(num_bed)
        .range([0, widthA])
        .padding(0.1);
    
    var yscaleA = d3.scaleLinear()
        .domain([0, Math.max.apply(null,total_pro)])
        .range([heightA, 0]);
    
    //Creación de eje X
    var xaxis = d3.axisBottom(xscaleA);
    

    //Creacion de los rectangulos
   



    var rect = svgAxis
        .selectAll('rect')
        .data(inputA)
        .enter()
        .append('rect')
        .attr("fill", "#93CAAE");
    
    
    rect
        .attr("x", function(d) {
            return xscaleA(d.bedrooms);
        })
        .attr('y', d => {
            return yscaleA(0)
        })
        .attr("width", xscaleA.bandwidth())
        .attr("height", function() {
            return heightA - yscaleA(0); //Al cargarse los rectangulos tendran una altura de 0 
        });
    
    rect
        .transition() //transición de entrada
        //.ease(d3.easeBounce)
        .duration(1000)
        .delay(function(d, i) {
            return (i * 1000)
        })
        .attr('y', d => {
            return yscaleA(d.total)
        })
        .attr("height", function(d) {
            return heightA - yscaleA(d.total); //Altura real de cada rectangulo.
        });
    
    
    //Añadimos el texto correspondiente a cada rectangulo.
    var text = svgAxis.selectAll('text')
        .data(inputA)
        .enter()
        .append('text')
        .text(d => d.total)
        .attr("x", function(d) {
            return xscaleA(d.bedrooms) + xscaleA.bandwidth() / 2;
        })
        .attr('y', d => {
            return yscaleA(d.total)
        })
        .style("opacity", 0);
   
    text
        .transition()
        //.ease(d3.easeBounce)
        .duration(500)
        .delay(d3.max(inputA, function(d, i) {
            return i;
        }) * 1000 + 1000)
        .style("opacity", 1);
    
    //Añadimos el eje X
    svgAxis.append("g")
        .attr("transform", "translate(0," + heightA + ")")
        .call(xaxis);   

    };