var fs = require("fs");
var util = require('util')


//Concatenate all the data files.
data = ""
//for (var i = 1; i <= 12; i++) {
	//data += fs.readFileSync(util.format("664729162_T_ONTIME %d.csv",i), "utf8");
    //data += fs.readFileSync(util.format("664729162_T_ONTIME %d.csv",i), "utf8");
//}
//data += fs.readFileSync("664729162_T_ONTIME 8.csv", "utf8");
data += fs.readFileSync("232005403_T_ONTIME.csv", "utf8");

code_name_map = {
	'14107': 'PHX',
    '12892': 'LAX',
    '14771': 'SFO',
    '11292': 'DEN',
    '13303': 'MIA',
    '10397': 'ATL',
    '13930': 'ORD',
    '10721': 'BOS',
    '11433': 'DTW',
    '13487': 'MSP',
    '12953': 'LGA',
    '12889': 'LAS',
    '12478': 'JFK',
    '14057': 'PDX',
    '14100': 'PHL',
    '11298': 'DFW',
    '14869': 'SLC',
    '12264': 'IAD',
    '14747': 'SEA'
}

unsuccessful_counts = {

};

get_code_o = function (title) {
	return title.split(",")[1];
}

get_code_d = function (title) {
	return title.split(",")[2];
}

is_ohare = function (title){
    return title.split(",")[1] == '13930';
}

is_nov21 = function(title){
    return title.split(",")[0] == '2015-11-21'
}


row_cancelled_or_diverted = function (title) {
	title_items = title.split(',');
	return title_items[2] == '1.00' || title_items[3] == '1.00';
}

console.log(data.length); 

data = data.split("\n"); //split data to be iteratible by line
data = data.filter(is_ohare);
data = data.filter(is_nov21);
Object.keys(code_name_map).map(function (code) {
	relevant_rows = data.filter(function (row) {return get_code_d(row) == code;});
	unsuccessful_counts[code_name_map[code]] = (relevant_rows.filter(row_cancelled_or_diverted)).length/relevant_rows.length;
});

console.log(unsuccessful_counts);


fs.writeFileSync('counts.json', unsuccessful_counts);