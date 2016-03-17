var hash = location.hash;
if(location.hash==""){
    hash = "#ORD";
}
var origin = hash.substr(1,hash.length);
var fil = "airport_classed.tsv";

var dists = [];
var reliability = [];
var airports = [];
var lats = [];
var lons = [];
var ori = 0;
var radii = [50, 100, 150, 200, 250];

var orbital_center = [140, 378];

function findArr(arr, target) {
    for (var i = 0; i < arr.length; i++){
        if (target==arr[i]){
            return(i)
        }
    }
}

    d3.tsv(fil, function(data) {
        for (key in data) {
            reliability.push(data[key].cat);
            airports.push(data[key].FAA);
            lats.push(data[key].lat);
            lons.push(data[key].long);
        }
        ori = findArr(airports, origin);
        
        var orLat = lats[ori];
        var orLon = lons[ori];
        
        for (var i=0; i<airports.length; i++){
            dists.push(get_distance_between(orLat, orLon, lats[i], lons[i]))
        }

    var margin = { top: 30, right: 30, bottom: 40, left:50 }

    var height = 600 - margin.top - margin.bottom,
        width = 960 - margin.left - margin.right;

    var colors = d3.scale.linear()
    .domain([5, 3, 1])
    .range(['#FC354C', '#837A84', '#0ABFBC'])
    
    //d3.select('#key').html(topics)
    d3.select('#title').html(origin + "<a> Map View</a>");
    d3.select('#switch').attr('href', "sorted.html"+hash);
    d3.select('#backHome').attr("href", "index.html" + hash);
    d3.select('#details').html("Location: " + orLat + ", " + orLon + " | Category: " + reliability[ori]);
        
    var oribitals = d3.select('#chart').append('svg')
        .style('background', '#FFFFFF')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .selectAll('cirlce').data(radii)
        .enter().append('circle')
            .style('stroke', function(d,i) {
                return colors(i+1);
            })
            .style("stroke-width", "1")
            .style('fill', "none")
            .attr("cy", (height/2))
            .attr("cx", (width/2))
            .attr("r", function(d){return 0;})
        

    var destination = d3.select('svg').append('svg')
        .append('g')
        .selectAll('circle').data(dists)
        .enter().append('circle')
            .style('fill', function(d,i) {
                return colors(reliability[i]);
            })
            .attr("id", function(d,i){return "k"+airports[i]})
            .attr("cx", function(d,i){
//                var angle = get_angle_between(lats[ori], lons[ori], lats[i], lons[i]);
//                dx = Math.cos(angle) * radii[reliability[i]-1];
//                pos = 440 + dx;
//                console.log([airports[i],
//                             angle * (180/3.1415), angle]);
//                return pos;
                    return 440;
            })
            .attr("cy", function(d,i){
//                var angle = get_angle_between(lats[ori], lons[ori], lats[i], lons[i]);
//                dy = Math.sin(angle) * radii[reliability[i]-1];
//                pos = 265 - dy;
                return 265
//                return pos;
            })
            .attr("r", 15)
            .style('opacity', 0.8)
        .on('click', function(d,i) { 
            window.location.href = 'map.html#'+airports[i];
            location.reload();
        })
    
    var destinationTags = d3.select('svg').append('svg')
        .append('g')
        .selectAll('text').data(airports)
        .enter().append('text')
            .style('fill', "white")
            .attr("x", function(d,i){
                var angle = get_angle_between(lats[ori], lons[ori], lats[i], lons[i]);
                dx = Math.cos(angle) * radii[reliability[i]-1];
                pos = 440 + dx - 9;
                return pos;
            })
            .attr("y", function(d,i){
                var angle = get_angle_between(lats[ori], lons[ori], lats[i], lons[i]);
                dy = Math.sin(angle) * radii[reliability[i]-1];
                pos = 265 - dy+4;
                return pos;
            })
            .text(function(d,i){return airports[i]})
            .attr("font-size", "10px")
    .on('click', function(d,i) { 
            window.location.href = 'map.html#'+airports[i];
            location.reload();
        })
    
    var originAir = d3.select('svg').append('svg')
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .append('g')
        .append('circle')
        .style('fill', "#0A8FBF")
        .attr("cy", (height/2))
        .attr("cx", (width/2))
        .attr("r", 15)
        d3.select('svg').append('svg')
        .append('text')
            .style('fill', 'white')
            .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
            .text(origin)
            .attr("font-size", "12px")
            .attr("y", (239))
            .attr("x", (377))
    
    destination.on('mouseover', function(d,i) {
        d3.select(this)
            .style('opacity', 1.0)
    })
    destination.on('mouseout', function(d, i) {
        d3.select(this)
            .style('opacity', 0.8)
    })
    
    destinationTags.on('mouseover', function(d,i) {
        var bubble = document.getElementById("k"+d);
        bubble.style.opacity = 1.0;
    })
    destinationTags.on('mouseout', function(d, i) {
        var bubble = document.getElementById("k"+d);
        bubble.style.opacity = 0.8;
    })
    
    oribitals.transition()
        .attr("r", function(d){return d;})
        .delay(function(d, i) {
            return i * 20;
        })
        .duration(1000)
    
    destination.transition()
        .attr("cx", function(d){return d;})
        .attr("cx", function(d,i){
                var angle = get_angle_between(lats[ori], lons[ori], lats[i], lons[i]);
                dx = Math.cos(angle) * radii[reliability[i]-1];
                pos = 440 + dx;
                console.log([airports[i],
                             angle * (180/3.1415), angle]);
                return pos;
            })
        .attr("cy", function(d,i){
                var angle = get_angle_between(lats[ori], lons[ori], lats[i], lons[i]);
                dy = Math.sin(angle) * radii[reliability[i]-1];
                pos = 265 - dy+4;
                return pos;
            })
        .delay(function(d, i) {
            return i * 20;
        })
        .duration(1100)
        
    
    d3.select('#about').attr("style","margin-top=2vh");

    
});