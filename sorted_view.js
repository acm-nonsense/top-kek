var hash = location.hash;
if(location.hash==""){
    hash = "#ORD";
}
var origin = hash.substr(1,hash.length);
fil = "airport_classed.tsv";

var bardata = [];
var reliability = [];
var airports = [];
var lats = [];
var lons = [];
var ori = 0;


function findArr(arr, target) {
    for (var i = 0; i < arr.length; i++){
        if (target==arr[i]){
            return(i)
        }
    }
}

    d3.tsv(fil, function(data) {
        for (key in data) {
            reliability.push(data[key].cat)
            airports.push(data[key].FAA)
            lats.push(data[key].lat)
            lons.push(data[key].long)
        }
        ori = findArr(airports, origin);
        
        var orLat = lats[findArr(airports, origin)];
        var orLon = lons[findArr(airports, origin)];
        
        for (var i=0; i<airports.length; i++){
            bardata.push(get_distance_between(orLat, orLon, lats[i], lons[i]))
        }

    var margin = { top: 30, right: 30, bottom: 40, left:50 }

    var height = 400 - margin.top - margin.bottom,
        width = 960 - margin.left - margin.right;

    var colors = d3.scale.linear()
    .domain([5, 3, 1])
    .range(['#FC354C', '#837A84', '#0ABFBC'])

    var yScale = d3.scale.linear()
            .domain([0, d3.max(bardata)])
            .range([0, 300]);

    var xScale = d3.scale.ordinal()
            .domain(d3.range(0, bardata.length))
            .rangeBands([0, width], 0.2)
    
    
    //d3.select('#key').html(topics)
    d3.select('#title').html(origin + "<a> Sorted View</a>");
    d3.select('#switch').attr('href', "map.html"+hash);
    d3.select('#pretty').attr('href', "alt-sorted.html"+hash);
    d3.select('#backHome').attr("href", "index.html" + hash);
    d3.select('#details').html("Location: " + orLat + ", " + orLon + " | Category: " + reliability[ori]);

    var myChart = d3.select('#chart').append('svg')
        .style('background', '#FFFFFF')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .selectAll('rect').data(bardata)
        .enter().append('rect')
            .style('fill', function(d,i) {
                return colors(reliability[i]);
            })
            .attr('width', 6)
            .attr('x', function(d,i) {
                return xScale(i);
            })
            .attr('height', function(d) {
                return 0;
            })
            .attr('y', function(d) {
                return 0;
            })
    d3.select('#about').attr("style","margin-top=2vh");

    myChart.transition()
        .attr('height', function(d) {
            return yScale(d);
        })
        .delay(function(d, i) {
            return i * 20;
        })
        .duration(1000)
    
    var circs = d3.select('svg').append('g')
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .selectAll('circle').data(bardata)
        .enter().append('circle')
            .style('fill', function(d,i) {
                return colors(reliability[i]);
            })
            //.attr('width', xScale.rangeBand())
            .attr('cx', function(d,i) {
                return xScale(i) + 3;
            })
            .attr('cy', function(d,i){
                return 0;
            })
            .attr("r", 15)
            .on('click', function(d,i) { 
                window.location.href = 'sorted.html#'+airports[i];
                location.reload();
            })

    
    circs.transition()
        .attr('cy', function(d) {
            return yScale(d);
        })
        .delay(function(d, i) {
            return i * 20;
        })
        .duration(1000)
    
    var texs = d3.select('svg').append('g')
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .selectAll('circle').data(bardata)
        .enter().append('text')
        .style('fill', 'white')
        .attr('x', function(d,i) {
                return xScale(i) - 7.5;
            })
        .attr('y', function(d,i){
                return 0;
            })
        .text(function(d,i){return airports[i]})
        .attr("font-size", "10px")
        .on('click', function(d,i) { 
            window.location.href = 'sorted.html#'+airports[i];
            location.reload();
        })
    
    texs.transition()
        .attr('y', function(d) {
            return yScale(d) + 3;
        })
        .delay(function(d, i) {
            return i * 20;
        })
        .duration(1000)
    
    circs.on('mouseover', function(d,i) {
        d3.select(this)
            .style('opacity', .5)
        
        var r = document.getElementsByTagName("rect");
        var a = r[i];
        a.style.opacity = 0.5;
    })

    circs.on('mouseout', function(d, i) {
        d3.select(this)
            .style('opacity', 1)
        
        var r = document.getElementsByTagName("rect");
        var a = r[i];
        a.style.opacity = 1;
    })
    
    texs.on('mouseover', function(d,i) {
        var r = document.getElementsByTagName("circle");
        var a = r[i];
        a.style.opacity = 0.5;
        
        r = document.getElementsByTagName("rect");
        a = r[i];
        a.style.opacity = 0.5;
    })

    texs.on('mouseout', function(d, i) {
        var r = document.getElementsByTagName("circle");
        var a = r[i];
        a.style.opacity = 1;
        
        r = document.getElementsByTagName("rect");
        a = r[i];
        a.style.opacity = 1;
    })
    
});