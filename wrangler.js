var fs = require("fs");
var util = require('util')

data = ""
for (var i = 1; i <= 12; i++) {
	data += fs.readFileSync(util.format("664729162_T_ONTIME %d.csv",i), "utf8");
}

code_name_map = {
	'13930': 'ORD',
	'10397':'ATL',
	'12892':'LAX',
	'11298':'DFW',
	'12478':'JFK',
	'11292':'DEN'
}

unsuccessful_counts = {

};

get_code = function (title) {
	first_comma = title.indexOf(',');
	second_comma = title.indexOf(',',first_comma+1);
	return title.substr(first_comma+1,second_comma-first_comma-1);
}

row_cancelled_or_diverted = function (title) {
	title_items = title.split(',');
	return title_items[2] == '1.00' || title_items[3] == '1.00';
}

console.log(data.length);

data = data.split("\n");
data = data.slice(1,data.length)
Object.keys(code_name_map).map(function (code) {
	relevant_rows = data.filter(function (row) {return get_code(row) == code;});
	unsuccessful_counts[code] = relevant_rows.filter(row_cancelled_or_diverted).length/relevant_rows.length;
});

console.log(unsuccessful_counts);


fs.writeFileSync('counts.json', unsuccessful_counts);