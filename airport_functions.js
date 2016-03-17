function get_distance_between(lat1, lon1, lat2, lon2){
    var R = 6371000; // metres
    var φ1 = deg_to_rad(lat1);
    var φ2 = deg_to_rad(lat2);
    var Δφ = deg_to_rad(lat2-lat1);
    var Δλ = deg_to_rad(lon2-lon1);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var dist =  20*((R * c)/1000)/800;
    return(dist);
}

function get_angle_between(lat1, lon1, lat2, lon2){
    var rise = lat2 - lat1;
    var run = lon2 - lon1;
    angle = Math.atan2(rise, run);
    
    return angle;
}

function deg_to_rad(deg){
    return deg * (3.14/180);
}

function rad_to_deg(deg){
    return deg * (3.14/180);
}