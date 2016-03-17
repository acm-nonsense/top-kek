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

    var tooltip = d3.select('body').append('div')
            .style('position', 'absolute')
            .style('padding', '0 10px')
            .style('background', 'white')
            .style('opacity', 0)
    
    
    //d3.select('#key').html(topics)
    d3.select('#title').html(origin + "<a> Sorted View</a>");
    d3.select('#map').attr('href', "map.html"+hash);
    d3.select('#sort').attr('href', "sorted.html"+hash);
    d3.select('#title').html(origin + "<a> Alt Sort View</a>");
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
            //.attr('width', xScale.rangeBand())
            .attr('width', 24)
            .attr('x', function(d,i) {
                return xScale(i);
            })
            .attr('height', function(d) {
                return 0;
                //return yScale(d);
            })
            .attr('y', 0)
        .on('mouseover', function(d,i) {
                d3.select(this)
                .style('opacity', .5)
            })
        .on('mouseout', function(d, i) {
            d3.select(this)
                .style('opacity', 1)
            })
        .on('click', function(d,i) { 
            window.location.href = 'alt-sorted.html#'+airports[i];
            location.reload();
        })
    
    myChart.transition()
        .attr('height', function(d) {
            return yScale(d);
        })
        .delay(function(d, i) {
            return i * 20;
        })
        .duration(1000)
    
    d3.select('#about').attr("style","margin-top=2vh");
    
    var texs = d3.select('svg').append('g')
        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        .selectAll('text').data(bardata)
        .enter().append('text')
        .style('fill', 'white')
        .attr('x', function(d,i) {
                return xScale(i) + 1;
            })
        .attr('y', function(d,i){
                return yScale(d) - 1;
            })
        .attr('font-weight', 'bold')
        .text(function(d,i){return airports[i]})
        .attr("font-size", "10px")
        .on('click', function(d,i) { 
            window.location.href = 'sorted.html#'+airports[i];
            location.reload();
        })



    
});